import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
try:
    from pydantic_settings import BaseSettings
except ImportError:
    # Fallback to standard Pydantic if pydantic_settings is not present
    from pydantic import BaseModel as BaseSettings  # type: ignore

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "ADSVERZ"
    
    # JWT Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey_adsverz_2026_dev_only_change_in_production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours for convenience in v1
    
    # Database Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./adsverz.db")
    
    # Cloudinary Settings (Optional, with mock fallback if missing)
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://adsverz.vercel.app",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
