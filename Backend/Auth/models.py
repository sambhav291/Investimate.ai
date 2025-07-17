from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True)  # nullable for Google users
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)  # nullable for Google users
    name = Column(String, nullable=True)  # Google display name
    profile_pic = Column(String, nullable=True)  # Google profile picture URL
    is_google_account = Column(Boolean, default=False)  # Optional

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