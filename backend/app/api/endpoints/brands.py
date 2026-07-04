from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.api.endpoints.auth import get_current_user, RoleChecker
from app.models.all_models import User, Brand, Campaign
from app.schemas.all_schemas import BrandResponse, BrandUpdate, CampaignResponse

router = APIRouter()

# Role guard for Brand
brand_guard = RoleChecker(["brand"])

@router.get("/profile", response_model=BrandResponse)
def get_brand_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(brand_guard)
):
    """Retrieve the brand profile of the logged-in brand user."""
    brand = db.query(Brand).filter(Brand.user_id == current_user.id).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found."
        )
    return brand


@router.put("/profile", response_model=BrandResponse)
def update_brand_profile(
    profile_in: BrandUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(brand_guard)
):
    """Update the brand profile details."""
    brand = db.query(Brand).filter(Brand.user_id == current_user.id).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found."
        )
        
    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(brand, field, value)
        
    db.commit()
    db.refresh(brand)
    return brand


@router.get("/my-campaigns", response_model=List[CampaignResponse])
def get_my_campaigns(
    db: Session = Depends(get_db),
    current_user: User = Depends(brand_guard)
):
    """Retrieve all campaigns submitted by the logged-in brand user."""
    brand = db.query(Brand).filter(Brand.user_id == current_user.id).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found."
        )
        
    campaigns = db.query(Campaign).filter(Campaign.brand_id == brand.id).all()
    
    # We populate the brand and hospital names manually for the CampaignResponse schema
    result = []
    for c in campaigns:
        # Create schema mapping
        c_schema = CampaignResponse.model_validate(c)
        c_schema.brand_company_name = brand.company_name
        c_schema.hospital_name = c.target_hospital.hospital_name if c.target_hospital else "Unknown Hospital"
        result.append(c_schema)
        
    return result
