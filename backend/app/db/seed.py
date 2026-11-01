"""
Database seed script with authentic TinyFish research findings.
Strictly adheres to verified public district directory and institutional records.
Run: python app/db/seed.py
"""
import sys
import os
import json
from datetime import datetime, timezone

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.db.database import SessionLocal, create_tables
from app.models.user import User
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.hospital import Hospital
from app.models.paramedic import Paramedic
from app.models.provider import Provider
from app.core.security import hash_password


def seed():
    print("[Seed] Updating database tables and authentic TinyFish directory...")
    create_tables()
    db = SessionLocal()

    try:
        # Check and seed users if not already present
        if not db.query(User).first():
            print("[Seed] Inserting demo users...")

            admin_user = User(
                email="admin@jeevansetu.in",
                hashed_password=hash_password("Admin@1234"),
                full_name="Dr. Rajesh Verma (Administrator)",
                role="admin",
                phone="+919876543210",
                is_active=True,
                is_verified=True,
            )
            db.add(admin_user)

            patient_user = User(
                email="ravi.kumar@example.com",
                hashed_password=hash_password("Patient@1234"),
                full_name="Ravi Kumar",
                role="patient",
                phone="+919811122334",
                is_active=True,
                is_verified=True,
            )
            db.add(patient_user)
            db.flush()

            patient_profile = Patient(
                user_id=patient_user.id,
                city="Greater Noida",
                state="Uttar Pradesh",
                pincode="201310",
                blood_group="B+",
                allergies="Penicillin",
                medical_history="Mild Hypertension",
            )
            db.add(patient_profile)

            doctor_user = User(
                email="dr.priya@example.com",
                hashed_password=hash_password("Doctor@1234"),
                full_name="Dr. Priya Sharma",
                role="doctor",
                phone="+919822233445",
                is_active=True,
                is_verified=True,
            )
            db.add(doctor_user)
            db.flush()

            doctor_profile = Doctor(
                user_id=doctor_user.id,
                registration_number="DMC-2018-98432",
                specialization="General Medicine",
                qualification="MBBS, MD (Internal Medicine)",
                hospital_affiliation="Government District Hospital",
                experience_years=9,
                city="Noida",
                state="Uttar Pradesh",
                is_verified=True,
            )
            db.add(doctor_profile)

            hospital_user = User(
                email="gims.noida@example.com",
                hashed_password=hash_password("Hospital@1234"),
                full_name="Government Institute of Medical Sciences",
                role="hospital",
                phone="7303884229",
                is_active=True,
                is_verified=True,
            )
            db.add(hospital_user)
            db.flush()

            hospital_profile = Hospital(
                user_id=hospital_user.id,
                name="Government Institute of Medical Sciences (GIMS)",
                type="government",
                address="Kasna, Greater Noida, Gautam Buddha Nagar",
                city="Greater Noida",
                state="Uttar Pradesh",
                pincode="201310",
                phone="7303884229",
                is_verified=True,
            )
            db.add(hospital_profile)

            paramedic_user = User(
                email="paramedic.amit@example.com",
                hashed_password=hash_password("Paramedic@1234"),
                full_name="Amit Patel (EMT)",
                role="paramedic",
                phone="+919833344556",
                is_active=True,
                is_verified=True,
            )
            db.add(paramedic_user)
            db.flush()

            paramedic_profile = Paramedic(
                user_id=paramedic_user.id,
                registration_number="EMT-UP-4821",
                qualification="Diploma in Emergency Medical Services",
                service_area="Greater Noida & Yamuna Expressway",
                city="Greater Noida",
                state="Uttar Pradesh",
                is_verified=True,
            )
            db.add(paramedic_profile)
            db.commit()

        # Clean and recreate provider table with authentic schema
        print("[Seed] Refreshing Provider directory with authentic TinyFish findings...")
        from app.db.database import engine
        Provider.__table__.drop(bind=engine, checkfirst=True)
        Provider.__table__.create(bind=engine, checkfirst=True)

        now = datetime.now(timezone.utc)

        authentic_providers = [
            # A. Government District Hospital
            Provider(
                name="Govt. District Hospital",
                provider_type="Government Hospital",
                address="Sector-30, Noida, Gautam Buddha Nagar, Uttar Pradesh",
                city="Noida",
                state="Uttar Pradesh",
                pincode="201301",
                phone=None,  # Not available in extracted source; do not invent
                website="https://gbnagar.nic.in/public-utility-category/hospitals/",
                services=json.dumps(["OPD", "Inpatient Care", "General Medicine", "Emergency Services"]),
                department_contacts=json.dumps({}),
                capacity="District Hospital Facility",
                source_url="https://gbnagar.nic.in/public-utility-category/hospitals/",
                last_checked=now,
                verification_status="source_available",
                discovered_by="tinyfish",
            ),
            # B. Government Institute of Medical Sciences (GIMS)
            Provider(
                name="Government Institute of Medical Sciences (GIMS)",
                provider_type="Government Hospital",
                address="Kasna, Greater Noida, Gautam Buddha Nagar, Uttar Pradesh",
                city="Greater Noida",
                state="Uttar Pradesh",
                pincode="201310",
                phone="7303884229",  # Verified Emergency Contact
                website="https://www.gims.ac.in/hospital.html",
                capacity="500 beds",
                services=json.dumps([
                    "Emergency Care",
                    "Surgeries",
                    "Diagnostics",
                    "OPD",
                    "IPD",
                    "Dialysis",
                    "Blood Bank",
                    "Immunization",
                    "Trauma Care"
                ]),
                department_contacts=json.dumps({
                    "Emergency Contact": "7303884229",
                    "Ambulance Services": "9667993869",
                    "Diagnostic Services": "7428912056",
                    "Imaging Services": "7303884235",
                    "Dialysis Unit": "7303884231",
                    "Ayushman Bharat Inquiries": "9667993865",
                }),
                source_url="https://www.gims.ac.in/hospital.html",
                last_checked=now,
                verification_status="source_available",
                discovered_by="tinyfish",
            ),
            # C. Kailash Hospital (Sector-27 Noida)
            Provider(
                name="Kailash Hospital",
                provider_type="Hospital",
                address="H-33, New Okhla Industrial Development Area, Near D.M. Chowk, Sector-27, Noida",
                city="Noida",
                state="Uttar Pradesh",
                pincode="201301",
                phone=None,  # Not in district utility directory snippet; preserved as None
                website="https://gbnagar.nic.in/public-utility-category/hospitals/",
                services=json.dumps(["Multi-Specialty Care", "Emergency", "Inpatient Services"]),
                department_contacts=json.dumps({}),
                source_url="https://gbnagar.nic.in/public-utility-category/hospitals/",
                last_checked=now,
                verification_status="source_available",
                discovered_by="tinyfish",
            ),
            # D. Max Multi Speciality Hospital, Noida
            Provider(
                name="Max Multi Speciality Hospital, Noida",
                provider_type="Hospital",
                address="Sector 19, A Block, Pocket A, Noida, Uttar Pradesh 201301",
                city="Noida",
                state="Uttar Pradesh",
                pincode="201301",
                phone="01206629999",  # Verified extracted contact
                website="https://gbnagar.nic.in/public-utility-category/hospitals/",
                services=json.dumps(["Multi-Specialty Healthcare", "Surgery", "Emergency", "Diagnostics"]),
                department_contacts=json.dumps({"General / Appointment Inquiry": "01206629999"}),
                source_url="https://gbnagar.nic.in/public-utility-category/hospitals/",
                last_checked=now,
                verification_status="source_available",
                discovered_by="tinyfish",
            ),
            # E. Prakash Hospital
            Provider(
                name="Prakash Hospital",
                provider_type="Hospital",
                address="D-12A, 12B, Gautam Buddha Nagar, Near NTPC and ISKCON Temple, Sector-33, Noida",
                city="Noida",
                state="Uttar Pradesh",
                pincode="201301",
                phone=None,  # Not available in extracted source; do not invent
                website="https://gbnagar.nic.in/public-utility-category/hospitals/",
                services=json.dumps(["General Medicine", "Inpatient Care", "Trauma & Orthopedics"]),
                department_contacts=json.dumps({}),
                source_url="https://gbnagar.nic.in/public-utility-category/hospitals/",
                last_checked=now,
                verification_status="source_available",
                discovered_by="tinyfish",
            ),
        ]

        for p in authentic_providers:
            db.add(p)

        db.commit()
        print("[Seed] Successfully seeded 5 authentic TinyFish verified directory facilities.")

    except Exception as e:
        db.rollback()
        print(f"[Seed] Error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
