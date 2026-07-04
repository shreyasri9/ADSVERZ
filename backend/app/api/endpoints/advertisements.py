from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.endpoints.auth import RoleChecker
from app.models.all_models import User, Brand, Campaign, Advertisement
from app.schemas.all_schemas import AdvertisementResponse
from app.services.cloudinary_service import upload_media_file

router = APIRouter()

# Guard
brand_guard = RoleChecker(["brand"])

@router.post("/upload", response_model=AdvertisementResponse, status_code=status.HTTP_201_CREATED)
def upload_advertisement(
    campaign_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(brand_guard)
):
    """Upload advertisement media file and link it to an existing campaign."""
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
            detail="Cannot add advertisements to a campaign that is already approved or rejected."
        )
        
    # Check media type limit or size
    # Perform upload
    upload_result = upload_media_file(file, folder=f"adsverz/campaign_{campaign_id}")
    
    # Save to db
    db_ad = Advertisement(
        campaign_id=campaign_id,
        media_url=upload_result["media_url"],
        media_type=upload_result["media_type"],
        file_size=upload_result["file_size"],
        cloudinary_id=upload_result["cloudinary_id"],
        duration_seconds=30 if upload_result["media_type"] == "video" else 15
    )
    db.add(db_ad)
    db.commit()
    db.refresh(db_ad)
    return db_ad


@router.delete("/{ad_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_advertisement(
    ad_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(brand_guard)
):
    """Delete an uploaded advertisement file."""
    brand = db.query(Brand).filter(Brand.user_id == current_user.id).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found."
        )
        
    ad = db.query(Advertisement).filter(Advertisement.id == ad_id).first()
    if not ad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertisement not found."
        )
        
    # Verify campaign ownership
    if ad.campaign.brand_id != brand.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this advertisement."
        )
        
    if ad.campaign.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete advertisements from a campaign that is already approved or rejected."
        )
        
    db.delete(ad)
    db.commit()
    return None
