import os
import shutil
from pathlib import Path
from fastapi import UploadFile
import cloudinary
import cloudinary.uploader
from app.core.config import settings

# Configure Cloudinary if credentials are provided
has_cloudinary = False
if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )
    has_cloudinary = True

# Setup Local uploads directory as fallback
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"
UPLOADS_DIR = STATIC_DIR / "uploads"

def upload_media_file(file: UploadFile, folder: str = "adsverz") -> dict:
    """
    Upload file. Streams to Cloudinary if keys are present,
    otherwise saves to local static/uploads and returns a local relative URL.
    """
    filename = file.filename or "uploaded_media"
    
    if has_cloudinary:
        try:
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                file.file,
                folder=folder,
                resource_type="auto"
            )
            return {
                "media_url": result.get("secure_url"),
                "media_type": "video" if "video" in result.get("resource_type", "") else "image",
                "file_size": result.get("bytes", 0),
                "cloudinary_id": result.get("public_id")
            }
        except Exception as e:
            # Fallback to local on error
            print(f"Cloudinary upload failed: {e}. Falling back to local upload.")
    
    # Local Upload Fallback
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename to avoid collision
    from uuid import uuid4
    ext = Path(filename).suffix
    unique_filename = f"{uuid4()}{ext}"
    dest_path = UPLOADS_DIR / unique_filename
    
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Determine type by extension
    media_type = "image"
    if ext.lower() in [".mp4", ".mov", ".avi", ".webm", ".mkv"]:
        media_type = "video"
        
    file_size = dest_path.stat().st_size
    
    # URL will map to the static mount: e.g. http://localhost:8000/static/uploads/filename
    # We save relative URL path, which the main app will serve
    media_url = f"/static/uploads/{unique_filename}"
    
    return {
        "media_url": media_url,
        "media_type": media_type,
        "file_size": file_size,
        "cloudinary_id": None
    }
