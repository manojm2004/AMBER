# ---------------------------------------------------------
# STAGE 1: FRONTEND REACT COMPILATION (VITE)
# ---------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Install dependencies first for Docker caching
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Copy actual code and compile optimized production build
COPY frontend/ .
RUN npm run build

# ---------------------------------------------------------
# STAGE 2: PYTHON FASTAPI BACKEND & FINAL IMAGE
# ---------------------------------------------------------
FROM python:3.10-slim AS final-server
WORKDIR /app

# System dependencies required for OpenCV, TensorFlow, and SQLite
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all python code (excluding ignored files)
COPY . .

# Copy the compiled Vite React frontend from Stage-1 directly into the Python container
# This allows our FastAPI 'StaticFiles' mount to serve the entire app from a single port!
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Ensure data folders exist for DB and images
RUN mkdir -p /app/data/raw/real/CAPTURE_FOLDER \
    && mkdir -p /app/data/raw/real/PROCESSED \
    && mkdir -p /app/data/uploaded

# Expose port 8000 for Cloud platforms (Render, Heroku, AWS)
EXPOSE 8000

# Fire the multi-core production server bootloader!
CMD ["python", "start_prod_server.py"]
