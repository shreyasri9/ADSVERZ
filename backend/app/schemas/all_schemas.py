from datetime import datetime, date
from typing import List, Optional, Any
from pydantic import BaseModel, EmailStr, Field

# Base ORM config class for Pydantic V1 & V2 compatibility
class ORMModel(BaseModel):
    class Config:
        orm_mode = True
        from_attributes = True


# ================= AUTH SCHEMAS =================
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "brand"  # "admin", "brand", "hospital"


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    # Fields for profiles if registration includes them
    company_name: Optional[str] = None  # for brand
    hospital_name: Optional[str] = None  # for hospital


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase, ORMModel):
    id: int
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user: UserResponse


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# ================= BRAND SCHEMAS =================
class BrandBase(BaseModel):
    company_name: str
    gst_number: Optional[str] = None
    industry_category: Optional[str] = None
    contact_phone: Optional[str] = None


class BrandCreate(BrandBase):
    user_id: int


class BrandUpdate(BaseModel):
    company_name: Optional[str] = None
    gst_number: Optional[str] = None
    industry_category: Optional[str] = None
    contact_phone: Optional[str] = None


class BrandResponse(BrandBase, ORMModel):
    id: int
    user_id: int


# ================= HOSPITAL SCHEMAS =================
class HospitalBase(BaseModel):
    hospital_name: str
    hospital_type: Optional[str] = None
    address: Optional[str] = None
    contact_phone: Optional[str] = None


class HospitalCreate(HospitalBase):
    user_id: int


class HospitalUpdate(BaseModel):
    hospital_name: Optional[str] = None
    hospital_type: Optional[str] = None
    address: Optional[str] = None
    contact_phone: Optional[str] = None


class HospitalResponse(HospitalBase, ORMModel):
    id: int
    user_id: int


# ================= SCREEN SCHEMAS =================
class ScreenBase(BaseModel):
    screen_id: str
    name: str
    location_detail: Optional[str] = None
    size: Optional[str] = None
    screen_type: str = "TV"


class ScreenCreate(ScreenBase):
    hospital_id: int


class ScreenUpdate(BaseModel):
    name: Optional[str] = None
    location_detail: Optional[str] = None
    size: Optional[str] = None
    screen_type: Optional[str] = None
    is_online: Optional[bool] = None


class ScreenResponse(ScreenBase, ORMModel):
    id: int
    hospital_id: int
    is_online: bool
    last_sync: datetime


# ================= ADVERTISEMENT SCHEMAS =================
class AdvertisementBase(BaseModel):
    media_url: str
    media_type: str = "image"  # "image", "video"
    duration_seconds: int = 15
    file_size: Optional[int] = None
    cloudinary_id: Optional[str] = None


class AdvertisementCreate(AdvertisementBase):
    campaign_id: int


class AdvertisementResponse(AdvertisementBase, ORMModel):
    id: int
    campaign_id: int


# ================= CAMPAIGN SCHEMAS =================
class CampaignBase(BaseModel):
    name: str
    start_date: date
    end_date: date
    target_hospital_id: int


class CampaignCreate(CampaignBase):
    # Base contains properties required on creation
    pass


class CampaignResponse(CampaignBase, ORMModel):
    id: int
    brand_id: int
    status: str
    created_at: datetime
    advertisements: List[AdvertisementResponse] = []
    # Nested response objects for cleaner listings
    brand_company_name: Optional[str] = None
    hospital_name: Optional[str] = None


class CampaignStatusUpdate(BaseModel):
    status: str  # "approved", "rejected"


# ================= SUPPORT TICKET SCHEMAS =================
class SupportTicketBase(BaseModel):
    subject: str
    category: str = "technical"  # "technical", "content", "screen", "account"
    message: str


class SupportTicketCreate(SupportTicketBase):
    pass


class SupportTicketReply(BaseModel):
    admin_reply: str
    status: str = "in_progress"  # "in_progress", "closed"


class SupportTicketResponse(SupportTicketBase, ORMModel):
    id: int
    user_id: int
    status: str
    admin_reply: Optional[str] = None
    created_at: datetime
    user_email: Optional[str] = None


# ================= ANALYTICS SCHEMAS =================
class DashboardStats(BaseModel):
    total_hospitals: int
    total_brands: int
    total_screens: int
    total_campaigns: int
    active_campaigns: int
    active_screens: int
    tickets_open: int
