from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    
    # ✅ FIX: Reverted from 'full_name' back to 'name' to match the database
    name = Column(String, nullable=True)
    
    profile_pic = Column(String, nullable=True)
    
    # ✅ FIX: Reverted from 'is_oauth_user' back to 'is_google_account'
    is_google_account = Column(Boolean, default=False)

    reports = relationship("UserReport", back_populates="user")
    
    @property
    def display_name(self):
        """Return the display name, fallback to username or email"""
        return self.name or self.username or self.email

class UserReport(Base):
    __tablename__ = "user_reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="reports")
