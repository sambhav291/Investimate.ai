from pydantic import BaseModel, EmailStr
from typing import Optional

# --- User Schemas ---

class UserCreate(BaseModel):
    username: Optional[str] = None
    email: EmailStr
    password: str
    # Keep full_name here as it's used by the API and Google's response
    full_name: Optional[str] = None
    profile_pic: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: Optional[str] = None 
    email: EmailStr
    # ✅ FIX: Changed to 'name' to match the database model field
    name: Optional[str] = None
    profile_pic: Optional[str] = None
    # ✅ FIX: Changed to 'is_google_account' to match the database model field
    is_google_account: bool

    class Config:
        from_attributes = True

# --- Token Schemas ---

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class RefreshRequest(BaseModel):
    refresh_token: str
