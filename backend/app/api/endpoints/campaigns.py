from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.api.endpoints.auth import get_current_user, RoleChecker
from app.models.all_models import User, Brand, Hospital, Campaign, Advertisement
from app.schemas.all_schemas import CampaignCreate, CampaignResponse, HospitalResponse

router = APIRouter()

# Guards
brand_guard = RoleChecker(["brand"])
any_user_guard = get_current_user  # Any logged-in user

@router.get("/hospitals", response_model=List[HospitalResponse])
def list_available_hospitals(
    db: Session = Depends(get_db),
    current_user: User = Depends(brand_guard)
):
    """Retrieve list of all hospitals available for campaign targeting."""
    return db.query(Hospital).all()


@router.post("/", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
def create_campaign(
    campaign_in: CampaignCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(brand_guard)
):
    """Create a new campaign targeting a specific hospital."""
    brand = db.query(Brand).filter(Brand.user_id == current_user.id).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found. Please complete brand registration."
        )
        
    # Check target hospital exists
    hospital = db.query(Hospital).filter(Hospital.id == campaign_in.target_hospital_id).first()
    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target hospital not found."
        )
        
    # Create database object
    db_campaign = Campaign(
        brand_id=brand.id,
        name=campaign_in.name,
        start_date=campaign_in.start_date,
        end_date=campaign_in.end_date,
        target_hospital_id=campaign_in.target_hospital_id,
        status="pending"
    )
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    
    # Format return
    c_schema = CampaignResponse.model_validate(db_campaign)
    c_schema.brand_company_name = brand.company_name
    c_schema.hospital_name = hospital.hospital_name
    return c_schema


@router.get("/{campaign_id}", response_model=CampaignResponse)
def get_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(any_user_guard)
):
    """Get detail of a specific campaign."""
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found."
        )
        
    # Security: Brands can only view their own campaigns. Hospitals can only view assigned, approved campaigns. Admin can see all.
    if current_user.role == "brand":
        brand = db.query(Brand).filter(Brand.user_id == current_user.id).first()
        if not brand or campaign.brand_id != brand.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this campaign."
            )
    elif current_user.role == "hospital":
        hospital = db.query(Hospital).filter(Hospital.user_id == current_user.id).first()
        if not hospital or campaign.target_hospital_id != hospital.id or campaign.status != "approved":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this campaign."
            )
            
    c_schema = CampaignResponse.model_validate(campaign)
    c_schema.brand_company_name = campaign.brand.company_name if campaign.brand else "Unknown Brand"
    c_schema.hospital_name = campaign.target_hospital.hospital_name if campaign.target_hospital else "Unknown Hospital"
    return c_schema


@router.delete("/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(brand_guard)
):
    """Delete a campaign. Brands can only delete their own campaigns and only if they are still pending."""
    brand = db.query(Brand).filter(Brand.user_id == current_user.id).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found."
        )
        
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found."
        )
        
    if campaign.brand_id != brand.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this campaign."
        )
        
    if campaign.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a campaign that is already approved or rejected."
        )
        
    db.delete(campaign)
    db.commit()
    return None
