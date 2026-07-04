import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.database.session import Base, engine, SessionLocal
from app.database.seed import seed_db
from app.api.endpoints import auth, brands, hospitals, campaigns, advertisements, support, admin

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

# Auto seed database on initialization if empty
db = SessionLocal()
try:
    seed_db(db)
finally:
    db.close()

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Adsverz Smart Campus Media Network API Service",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup static files directory for local upload fallback
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
UPLOADS_DIR = STATIC_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

# Mount the static directory
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Register Api Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(brands.router, prefix=f"{settings.API_V1_STR}/brands", tags=["Brands"])
app.include_router(hospitals.router, prefix=f"{settings.API_V1_STR}/hospitals", tags=["Hospitals"])
app.include_router(campaigns.router, prefix=f"{settings.API_V1_STR}/campaigns", tags=["Campaigns"])
app.include_router(advertisements.router, prefix=f"{settings.API_V1_STR}/advertisements", tags=["Advertisements"])
app.include_router(support.router, prefix=f"{settings.API_V1_STR}/support", tags=["Support Tickets"])
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin Panel"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs_url": "/docs"
    }
