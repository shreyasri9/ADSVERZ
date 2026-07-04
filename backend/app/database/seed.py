from sqlalchemy.orm import Session
from datetime import datetime
from app.core import security
from app.database.session import SessionLocal, Base, engine
from app.models.all_models import User, Brand, Hospital, Screen, Campaign, Advertisement, SupportTicket

def seed_db(db: Session):
    # Check if database is already seeded
    if db.query(User).filter(User.email == "admin@adsverz.com").first():
        print("Database already seeded.")
        return

    print("Seeding database...")

    # 1. Create Admin
    admin_user = User(
        email="admin@adsverz.com",
        hashed_password=security.get_password_hash("admin123"),
        full_name="Super Admin",
        role="admin"
    )
    db.add(admin_user)
    db.commit()

    # 2. Create Hospitals
    hospitals_data = [
        {
            "email": "rvce@adsverz.com",
            "password": "hospital123",
            "name": "RV College of Engineering",
            "type": "University Campus",
            "address": "Mysore Road, Bengaluru, Karnataka 560059",
            "phone": "080-67178021",
            "screens": [
                {
                    "screen_id": "RVCE-01",
                    "name": "RVCE - Cafeteria",
                    "location_detail": "Main Cafeteria Block",
                    "size": "55 inch",
                    "screen_type": "TV"
                }
            ]
        },
        {
            "email": "pesu@adsverz.com",
            "password": "hospital123",
            "name": "PES University",
            "type": "University Campus",
            "address": "100 Feet Ring Rd, Banashankari, Bengaluru, Karnataka 560085",
            "phone": "080-26721983",
            "screens": [
                {
                    "screen_id": "PESU-01",
                    "name": "PES University - Block A",
                    "location_detail": "Admissions Office Block A",
                    "size": "55 inch",
                    "screen_type": "TV"
                }
            ]
        },
        {
            "email": "bmsit@adsverz.com",
            "password": "hospital123",
            "name": "BMSIT",
            "type": "University Campus",
            "address": "Doddaballapur Main Road, Yelahanka, Bengaluru, Karnataka 560064",
            "phone": "080-68730400",
            "screens": [
                {
                    "screen_id": "BMS-03",
                    "name": "BMSIT - Main Plaza",
                    "location_detail": "Main Entrance Plaza",
                    "size": "75 inch",
                    "screen_type": "Digital Standee"
                }
            ]
        },
        {
            "email": "ait@adsverz.com",
            "password": "hospital123",
            "name": "Acharya Institute of Technology",
            "type": "University Campus",
            "address": "Soladevanahalli, Hesaraghatta Main Rd, Bengaluru, Karnataka 560107",
            "phone": "080-22345678",
            "screens": [
                {
                    "screen_id": "AIT-01",
                    "name": "Acharya Institute of Technology - Gate 1",
                    "location_detail": "Main Gate Lounge",
                    "size": "65 inch",
                    "screen_type": "Billboard"
                }
            ]
        }
    ]

    for h_data in hospitals_data:
        h_user = User(
            email=h_data["email"],
            hashed_password=security.get_password_hash(h_data["password"]),
            full_name=h_data["name"],
            role="hospital"
        )
        db.add(h_user)
        db.commit()
        db.refresh(h_user)

        h_profile = Hospital(
            user_id=h_user.id,
            hospital_name=h_data["name"],
            hospital_type=h_data["type"],
            address=h_data["address"],
            contact_phone=h_data["phone"]
        )
        db.add(h_profile)
        db.commit()
        db.refresh(h_profile)

        # Add Screens
        for s_data in h_data["screens"]:
            screen = Screen(
                hospital_id=h_profile.id,
                screen_id=s_data["screen_id"],
                name=s_data["name"],
                location_detail=s_data["location_detail"],
                size=s_data["size"],
                screen_type=s_data["screen_type"],
                is_online=True,
                last_sync=datetime.now()
            )
            db.add(screen)
            db.commit()

    # 3. Create Brands
    brands_data = [
        {
            "email": "dell@adsverz.com",
            "password": "brand123",
            "name": "Dell Technologies",
            "company_name": "Dell India Pvt Ltd",
            "gst": "29AAAAA1111A1Z1",
            "category": "Tech Hardware",
            "phone": "9876543210"
        },
        {
            "email": "coursera@adsverz.com",
            "password": "brand123",
            "name": "Coursera Inc",
            "company_name": "Coursera Learning India",
            "gst": "29BBBBB2222B2Z2",
            "category": "EdTech",
            "phone": "9123456789"
        }
    ]

    for b_data in brands_data:
        b_user = User(
            email=b_data["email"],
            hashed_password=security.get_password_hash(b_data["password"]),
            full_name=b_data["name"],
            role="brand"
        )
        db.add(b_user)
        db.commit()
        db.refresh(b_user)

        b_profile = Brand(
            user_id=b_user.id,
            company_name=b_data["company_name"],
            gst_number=b_data["gst"],
            industry_category=b_data["category"],
            contact_phone=b_data["phone"]
        )
        db.add(b_profile)
        db.commit()

    # 4. Create support tickets
    tech_ticket = SupportTicket(
        user_id=db.query(User).filter(User.email == "rvce@adsverz.com").first().id,
        subject="Screen RVCE-01 flickering",
        category="screen",
        message="The TV display in the cafeteria is occasionally flickering during the afternoon hours. Please inspect.",
        status="open"
    )
    db.add(tech_ticket)
    db.commit()

    print("Seeding finished successfully.")

if __name__ == "__main__":
    # Create tables first if run standalone
    Base.metadata.create_all(bind=engine)
    db_session = SessionLocal()
    try:
        seed_db(db_session)
    finally:
        db_session.close()
