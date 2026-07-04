from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database.session import get_db
from app.api.endpoints.auth import RoleChecker
from app.models.all_models import User, Brand, Hospital, Screen, Campaign, SupportTicket, Advertisement
from app.schemas.all_schemas import (
    DashboardStats, CampaignResponse, CampaignStatusUpdate,
    HospitalResponse, BrandResponse, ScreenResponse, ScreenCreate
)

router = APIRouter()

# Guard for super admins only
admin_guard = RoleChecker(["admin"])

@router.get("/stats", response_model=DashboardStats)
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_guard)
):
    """Retrieve summarized statistics across the entire Adsverz network."""
    total_hospitals = db.query(Hospital).count()
    total_brands = db.query(Brand).count()
    total_screens = db.query(Screen).count()
    total_campaigns = db.query(Campaign).count()
    
    active_campaigns = db.query(Campaign).filter(Campaign.status == "approved").count()
    active_screens = db.query(Screen).filter(Screen.is_online == True).count()
    tickets_open = db.query(SupportTicket).filter(SupportTicket.status != "closed").count()
    
    return {
        "total_hospitals": total_hospitals,
        "total_brands": total_brands,
        "total_screens": total_screens,
        "total_campaigns": total_campaigns,
        "active_campaigns": active_campaigns,
        "active_screens": active_screens,
        "tickets_open": tickets_open
    }


@router.get("/campaigns", response_model=List[CampaignResponse])
def list_all_campaigns(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_guard)
):
    """Retrieve all campaigns in the system (pending, approved, and rejected)."""
    campaigns = db.query(Campaign).order_by(Campaign.created_at.desc()).all()
    
    result = []
    for c in campaigns:
        c_schema = CampaignResponse.model_validate(c)
        c_schema.brand_company_name = c.brand.company_name if c.brand else "Unknown Brand"
        c_schema.hospital_name = c.target_hospital.hospital_name if c.target_hospital else "Unknown Hospital"
        result.append(c_schema)
    return result


@router.post("/campaigns/{campaign_id}/status", response_model=CampaignResponse)
def update_campaign_status(
    campaign_id: int,
    status_in: CampaignStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_guard)
):
    """Approve or reject a submitted advertising campaign."""
    status_val = status_in.status.lower()
    if status_val not in ["approved", "rejected", "pending"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status. Must be 'approved', 'rejected', or 'pending'."
        )
        
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found."
        )
        
    campaign.status = status_val
    db.commit()
    db.refresh(campaign)
    
    c_schema = CampaignResponse.model_validate(campaign)
    c_schema.brand_company_name = campaign.brand.company_name if campaign.brand else "Unknown Brand"
    c_schema.hospital_name = campaign.target_hospital.hospital_name if campaign.target_hospital else "Unknown Hospital"
    return c_schema


@router.get("/hospitals", response_model=List[HospitalResponse])
def get_all_hospitals(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_guard)
):
    """Retrieve a list of all registered hospitals."""
    return db.query(Hospital).all()


@router.get("/brands", response_model=List[BrandResponse])
def get_all_brands(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_guard)
):
    """Retrieve a list of all registered brands."""
    return db.query(Brand).all()


@router.get("/screens", response_model=List[ScreenResponse])
def get_all_screens(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_guard)
):
    """Retrieve a list of all screens in the network."""
    return db.query(Screen).all()


@router.post("/screens", response_model=ScreenResponse, status_code=status.HTTP_201_CREATED)
def register_screen_admin(
    screen_in: ScreenCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_guard)
):
    """Add a new screen to any hospital (Admin feature)."""
    # Check target hospital exists
    hospital = db.query(Hospital).filter(Hospital.id == screen_in.hospital_id).first()
    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target hospital not found."
        )
        
    # Check Screen ID uniqueness
    existing_screen = db.query(Screen).filter(Screen.screen_id == screen_in.screen_id).first()
    if existing_screen:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Screen ID '{screen_in.screen_id}' is already registered."
        )
        
    db_screen = Screen(
        hospital_id=screen_in.hospital_id,
        screen_id=screen_in.screen_id,
        name=screen_in.name,
        location_detail=screen_in.location_detail,
        size=screen_in.size,
        screen_type=screen_in.screen_type,
        is_online=True,
        last_sync=datetime.now()
    )
    db.add(db_screen)
    db.commit()
    db.refresh(db_screen)
    return db_screen
