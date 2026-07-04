from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Date, Text
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="brand", nullable=False)  # "admin", "brand", "hospital"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    brand_profile = relationship("Brand", back_populates="user", uselist=False, cascade="all, delete-orphan")
    hospital_profile = relationship("Hospital", back_populates="user", uselist=False, cascade="all, delete-orphan")
    support_tickets = relationship("SupportTicket", back_populates="user", cascade="all, delete-orphan")


class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    company_name = Column(String, nullable=False)
    gst_number = Column(String, nullable=True)
    industry_category = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)

    # Relationships
    user = relationship("User", back_populates="brand_profile")
    campaigns = relationship("Campaign", back_populates="brand", cascade="all, delete-orphan")


class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    hospital_name = Column(String, nullable=False)
    hospital_type = Column(String, nullable=True)
    address = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)

    # Relationships
    user = relationship("User", back_populates="hospital_profile")
    screens = relationship("Screen", back_populates="hospital", cascade="all, delete-orphan")
    campaigns = relationship("Campaign", back_populates="target_hospital", cascade="all, delete-orphan")


class Screen(Base):
    __tablename__ = "screens"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    screen_id = Column(String, unique=True, index=True, nullable=False)  # e.g., "RVCE-01"
    name = Column(String, nullable=False)
    location_detail = Column(String, nullable=True)
    size = Column(String, nullable=True)  # e.g., "55 inch", "75 inch"
    screen_type = Column(String, default="TV", nullable=False)  # "TV", "Digital Standee", "Kiosk", etc.
    is_online = Column(Boolean, default=True, nullable=False)
    last_sync = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    hospital = relationship("Hospital", back_populates="screens")


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    target_hospital_id = Column(Integer, ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, default="pending", nullable=False)  # "pending", "approved", "rejected"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    brand = relationship("Brand", back_populates="campaigns")
    target_hospital = relationship("Hospital", back_populates="campaigns")
    advertisements = relationship("Advertisement", back_populates="campaign", cascade="all, delete-orphan")


class Advertisement(Base):
    __tablename__ = "advertisements"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False)
    media_url = Column(String, nullable=False)
    media_type = Column(String, default="image", nullable=False)  # "image", "video"
    duration_seconds = Column(Integer, default=15, nullable=False)
    file_size = Column(Integer, nullable=True)
    cloudinary_id = Column(String, nullable=True)

    # Relationships
    campaign = relationship("Campaign", back_populates="advertisements")


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject = Column(String, nullable=False)
    category = Column(String, default="technical", nullable=False)  # "technical", "content", "screen", "account"
    message = Column(Text, nullable=False)
    status = Column(String, default="open", nullable=False)  # "open", "in_progress", "closed"
    admin_reply = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="support_tickets")
