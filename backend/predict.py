from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, Query, Request
from fastapi.responses import StreamingResponse, FileResponse
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import shutil
import os
import cv2
import numpy as np
import tensorflow as tf
import csv
import io
import asyncio

from . import models, schemas, auth, database
from .security import validate_image_file, safe_filename, rate_limiter

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])

# --- Directory Config ---
CAPTURE_DIR = os.path.join("data", "raw", "real", "CAPTURE_FOLDER")
PROCESSED_DIR = os.path.join("data", "raw", "real", "PROCESSED")

os.makedirs(CAPTURE_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

# --- Load Model Once ---
MODEL_PATH = os.path.join("models", "milk_classifier_cnn.keras")
model = None

def get_model():
    global model
    if model is None:
        try:
            model = tf.keras.models.load_model(MODEL_PATH)
        except Exception as e:
            print(f"Error loading model: {e}")
    return model

LABELS = {0: 'Pure', 1: 'Glucose', 2: 'Adulterated', 3: 'Pathogens'}

# --- Prediction Logic ---
def predict_image(img_path: str):
    ml_model = get_model()
    if not ml_model:
        raise HTTPException(status_code=500, detail="ML Model not loaded.")
        
    img = cv2.imread(img_path)
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file format.")
        
    img = cv2.resize(img, (128, 128))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=0)

    preds = ml_model.predict(img, verbose=0)
    idx = int(np.argmax(preds[0]))
    conf = float(preds[0][idx])
    
    return LABELS[idx], conf

# --- Endpoints ---

@router.post("/upload", response_model=schemas.PredictionRecordResponse)
async def upload_and_predict(
    request: Request,
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    # Rate limit uploads: max 10 uploads/min per IP
    client_ip = request.client.host
    if not rate_limiter.is_allowed(client_ip, cost=1.0, refill_rate=0.17, max_tokens=10.0):
        raise HTTPException(status_code=429, detail="Too many uploads. Please wait a moment.")

    upload_dir = os.path.join("data", "uploaded")
    os.makedirs(upload_dir, exist_ok=True)

    # Read file bytes for validation BEFORE saving to disk
    file_bytes = await file.read()

    # Validate: extension + MIME type + magic bytes + size
    validate_image_file(
        filename=file.filename or "upload",
        content_type=file.content_type or "",
        file_bytes=file_bytes
    )

    # Generate a safe, unpredictable filename (prevents path traversal & enumeration)
    secure_name = safe_filename(file.filename or "upload")
    file_path = os.path.join(upload_dir, secure_name)

    with open(file_path, "wb") as buffer:
        buffer.write(file_bytes)

    # Run prediction in a background thread (prevents blocking the async event loop)
    try:
        label, conf = await asyncio.to_thread(predict_image, file_path)
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    # Store original filename for display, but use secure_name on disk
    record = models.PredictionRecord(
        user_id=current_user.id,
        filename=file.filename or "upload",
        prediction_label=label,
        confidence=conf
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return record


@router.get("/live_scan", response_model=List[schemas.PredictionRecordResponse])
def scan_live_capture(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Scan the CAPTURE_FOLDER for new hardware images, process them, and move them to PROCESSED_DIR."""
    new_records = []
    
    # Read files in the folder (ignore directories)
    if not os.path.exists(CAPTURE_DIR):
        return []
        
    for fname in sorted(os.listdir(CAPTURE_DIR)):
        file_path = os.path.join(CAPTURE_DIR, fname)
        if not os.path.isfile(file_path):
            continue
            
        ext = fname.lower().split(".")[-1]
        if ext not in ["jpg", "jpeg", "png", "bmp", "tiff", "gif"]:
            continue
            
        try:
            # Predict
            label, conf = predict_image(file_path)
            
            # Record it
            record = models.PredictionRecord(
                user_id=current_user.id,
                filename=fname,
                prediction_label=label,
                confidence=conf
            )
            db.add(record)
            db.commit()
            db.refresh(record)
            
            # Move file to PROCESSED so it doesn't get processed again
            dest_path = os.path.join(PROCESSED_DIR, fname)
            shutil.move(file_path, dest_path)
            
            new_records.append(record)
            
        except Exception as e:
            print(f"Failed to process {fname}: {str(e)}")
            
    return new_records


@router.get("/export_csv")
def export_history_csv(
    token: str = Query(...), 
    db: Session = Depends(database.get_db)
):
    """Generates a CSV on the server, bypassing any strict frontend browser download blockers."""
    # Authenticate via URL token
    try:
        from jose import jwt
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username = payload.get("sub")
        user = db.query(models.User).filter(models.User.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    records = db.query(models.PredictionRecord)\
                .filter(models.PredictionRecord.user_id == user.id)\
                .order_by(models.PredictionRecord.timestamp.desc())\
                .all()
                
    stream = io.StringIO()
    writer = csv.writer(stream)
    writer.writerow(["Timestamp", "Filename", "Prediction", "Confidence%"])
    
    for r in records:
        conf_pct = f"{(r.confidence * 100):.2f}%"
        writer.writerow([
            r.timestamp.strftime("%Y-%m-%d %H:%M:%S"), 
            r.filename, 
            r.prediction_label, 
            conf_pct
        ])
        
    response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=amber_hardware_history.csv"
    return response


@router.get("/history", response_model=List[schemas.PredictionRecordResponse])
def get_prediction_history(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Retrieve all past predictions for the current logged in user."""
    records = db.query(models.PredictionRecord).filter(
        models.PredictionRecord.user_id == current_user.id
    ).order_by(models.PredictionRecord.timestamp.desc()).all()
    return records


@router.delete("/history/{record_id}")
def delete_prediction_record(
    record_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Delete a specific prediction record and its physical image file."""
    record = db.query(models.PredictionRecord).filter(
        models.PredictionRecord.user_id == current_user.id,
        models.PredictionRecord.id == record_id
    ).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
        
    # Physically delete the image file from the hard drive if it exists
    filename = record.filename
    possible_paths = [
        os.path.join("data", "uploaded", filename),
        os.path.join(PROCESSED_DIR, filename),
        os.path.join(CAPTURE_DIR, filename)
    ]
    for p in possible_paths:
        if os.path.exists(p):
            try:
                os.remove(p)
            except Exception as e:
                print(f"Error removing {p}: {e}")
                
    # Delete from DB
    db.delete(record)
    db.commit()
    return {"detail": "Record permanently deleted"}


@router.get("/image/{filename}")
def get_prediction_image(
    filename: str,
    current_user: models.User = Depends(auth.get_current_user)  # Auth required!
):
    """Securely stream an image — path traversal safe, auth-gated."""
    # Strip path traversal attempts (e.g. ../../etc/passwd)
    safe_name = os.path.basename(filename)
    if not safe_name or safe_name != filename:
        raise HTTPException(status_code=400, detail="Invalid filename.")

    # Resolve allowed base directories
    base_dirs = [
        os.path.abspath(os.path.join("data", "uploaded")),
        os.path.abspath(PROCESSED_DIR),
        os.path.abspath(CAPTURE_DIR),
    ]

    for base in base_dirs:
        candidate = os.path.abspath(os.path.join(base, safe_name))
        # Verify the resolved path is strictly inside the allowed base
        if candidate.startswith(base + os.sep) and os.path.isfile(candidate):
            return FileResponse(candidate, media_type="image/jpeg")

    raise HTTPException(status_code=404, detail="Image not found.")


@router.get("/stats")
def get_prediction_stats(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Get aggregated statistics for the dashboard."""
    records = db.query(models.PredictionRecord).filter(
        models.PredictionRecord.user_id == current_user.id
    ).all()
    
    total = len(records)
    total_today = 0
    today_date = datetime.utcnow().date()
    
    counts = {"Pure": 0, "Glucose": 0, "Adulterated": 0, "Pathogens": 0}
    for r in records:
        if r.timestamp.date() == today_date:
            total_today += 1
            
        if r.prediction_label in counts:
            counts[r.prediction_label] += 1
            
    return {
        "total": total,
        "total_today": total_today,
        "breakdown": counts
    }
