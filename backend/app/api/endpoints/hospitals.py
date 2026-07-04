from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date

from app.database.session import get_db
from app.api.endpoints.auth import get_current_user, RoleChecker
from app.models.all_models import User, Hospital, Screen, Campaign
from app.schemas.all_schemas import HospitalResponse, HospitalUpdate, ScreenResponse, ScreenCreate, CampaignResponse

router = APIRouter()

# Role guard for Hospital
hospital_guard = RoleChecker(["hospital"])

@router.get("/profile", response_model=HospitalResponse)
def get_hospital_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(hospital_guard)
):
    """Retrieve hospital profile details for the logged-in hospital user."""
    hospital = db.query(Hospital).filter(Hospital.user_id == current_user.id).first()
    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital profile not found."
        )
    return hospital


@router.put("/profile", response_model=HospitalResponse)
def update_hospital_profile(
    profile_in: HospitalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(hospital_guard)
):
    """Update hospital profile details."""
    hospital = db.query(Hospital).filter(Hospital.user_id == current_user.id).first()
    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital profile not found."
        )
        
    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(hospital, field, value)
        
    db.commit()
    db.refresh(hospital)
    return hospital


@router.get("/my-screens", response_model=List[ScreenResponse])
def get_my_screens(
    db: Session = Depends(get_db),
    current_user: User = Depends(hospital_guard)
):
    """Retrieve all screens registered by the logged-in hospital."""
    hospital = db.query(Hospital).filter(Hospital.user_id == current_user.id).first()
    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital profile not found."
        )
    return db.query(Screen).filter(Screen.hospital_id == hospital.id).all()


@router.post("/my-screens", response_model=ScreenResponse, status_code=status.HTTP_201_CREATED)
def register_my_screen(
    screen_in: ScreenCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(hospital_guard)
):
    """Register a new signage display screen for the logged-in hospital."""
    hospital = db.query(Hospital).filter(Hospital.user_id == current_user.id).first()
    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital profile not found."
        )
        
    # Check screen ID uniqueness
    existing_screen = db.query(Screen).filter(Screen.screen_id == screen_in.screen_id).first()
    if existing_screen:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Screen ID '{screen_in.screen_id}' is already registered."
        )
        
    # Force hospital_id to match current hospital's ID for safety
    db_screen = Screen(
        hospital_id=hospital.id,
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


@router.get("/active-campaigns", response_model=List[CampaignResponse])
def get_hospital_active_campaigns(
    db: Session = Depends(get_db),
    current_user: User = Depends(hospital_guard)
):
    """Retrieve all approved campaigns targeted at this hospital."""
    hospital = db.query(Hospital).filter(Hospital.user_id == current_user.id).first()
    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital profile not found."
        )
        
    today = date.today()
    # Fetch campaigns that are approved and actively running (or scheduled)
    campaigns = db.query(Campaign).filter(
        Campaign.target_hospital_id == hospital.id,
        Campaign.status == "approved"
    ).all()
    
    result = []
    for c in campaigns:
        c_schema = CampaignResponse.model_validate(c)
        c_schema.brand_company_name = c.brand.company_name if c.brand else "Unknown Brand"
        c_schema.hospital_name = hospital.hospital_name
        result.append(c_schema)
        
    return result
