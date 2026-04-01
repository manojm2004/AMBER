from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

# --- Authentication & User Schemas ---

class UserCreate(BaseModel):
    username: str
    email: Optional[str] = None
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None


# --- Prediction History Schemas ---

class PredictionRecordResponse(BaseModel):
    id: int
    filename: str
    prediction_label: str
    confidence: float
    timestamp: datetime

    class Config:
        from_attributes = True
