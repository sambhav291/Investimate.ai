from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# class User(BaseModel):
#     id: int
#     username: str
#     class Config:
#         orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    model_config = {
        "from_attributes": True
    }

class UserOut(BaseModel):
    id: int
    username: Optional[str] = None 
    email: EmailStr
    name: Optional[str] = None
    profile_pic: Optional[str] = None
    is_google_account: Optional[bool] = None
    model_config = {
        "from_attributes": True
    }

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


