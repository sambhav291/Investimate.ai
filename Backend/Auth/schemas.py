from pydantic import BaseModel, EmailStr
from typing import Optional

# --- User Schemas ---

class UserCreate(BaseModel):
    username: Optional[str] = None
    email: EmailStr
    password: str
    name: Optional[str] = None
    profile_pic: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: Optional[str] = None 
    email: EmailStr
    name: Optional[str] = None
    profile_pic: Optional[str] = None
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
