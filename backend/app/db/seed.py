"""
Database seed script with synthetic Indian demo records.
Run: python app/db/seed.py
"""
import sys
import os
import json

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
    print("[Seed] Creating database tables...")
    create_tables()
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).first():
            print("[Seed] Database already has records. Skipping initial seed.")
            return

        print("[Seed] Inserting demo users and providers...")

        # 1. Admin
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

        # 2. Patient
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

        # 3. Doctor
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
            city="Greater Noida",
            state="Uttar Pradesh",
            is_verified=True,
        )
        db.add(doctor_profile)

        # 4. Hospital
        hospital_user = User(
            email="aiims.delhi@example.com",
            hashed_password=hash_password("Hospital@1234"),
            full_name="All India Institute of Medical Sciences",
            role="hospital",
            phone="+911126588500",
            is_active=True,
            is_verified=True,
        )
        db.add(hospital_user)
        db.flush()

        hospital_profile = Hospital(
            user_id=hospital_user.id,
            name="AIIMS New Delhi",
            type="government",
            address="Sri Aurobindo Marg, Ansari Nagar",
            city="New Delhi",
            state="Delhi",
            pincode="110029",
            phone="+911126588500",
            is_verified=True,
        )
        db.add(hospital_profile)

        # 5. Paramedic
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

        # 6. Real Baseline Healthcare Providers
        demo_providers = [
            Provider(
                name="Government Institute of Medical Sciences (GIMS)",
                provider_type="Government Hospital",
                address="Kasna, Greater Noida, Gautam Buddha Nagar",
                city="Greater Noida",
                state="Uttar Pradesh",
                pincode="201310",
                phone="0120-2341738",
                website="https://gims.ac.in",
                services=json.dumps(["Emergency 24x7", "General Medicine", "Pediatrics", "Trauma Care", "ICU"]),
                source_url="https://gims.ac.in",
                verification_status="verified",
                discovered_by="manual",
            ),
            Provider(
                name="Community Health Centre (CHC) Dadri",
                provider_type="CHC",
                address="Railway Road, Dadri, Gautam Buddha Nagar",
                city="Dadri",
                state="Uttar Pradesh",
                pincode="203207",
                phone="0120-2672234",
                services=json.dumps(["OPD", "Maternity Care", "Immunization", "Essential Diagnostics"]),
                source_url="https://up-health.info/chc-dadri",
                verification_status="verified",
                discovered_by="manual",
            ),
            Provider(
                name="Primary Health Centre (PHC) Dankaur",
                provider_type="PHC",
                address="Near Bus Stand, Dankaur, Greater Noida",
                city="Dankaur",
                state="Uttar Pradesh",
                pincode="203201",
                phone="0120-2415122",
                services=json.dumps(["Primary Health Care", "Maternal Care", "Free Essential Medicines"]),
                source_url="https://up-health.info/phc-dankaur",
                verification_status="verified",
                discovered_by="manual",
            ),
            Provider(
                name="Kailash Hospital & Neuro Institute",
                provider_type="Hospital",
                address="Plot No. 23, Knowledge Park-I, Greater Noida",
                city="Greater Noida",
                state="Uttar Pradesh",
                pincode="201308",
                phone="0120-2327799",
                website="https://kailashhealthcare.com",
                services=json.dumps(["24x7 Emergency", "Cardiology", "Neurology", "Orthopedics", "Ambulance"]),
                source_url="https://kailashhealthcare.com",
                verification_status="verified",
                discovered_by="manual",
            ),
            Provider(
                name="108 National Ambulance Emergency Service - Gautam Buddha Nagar",
                provider_type="Ambulance",
                address="District Ambulance Dispatch, Sector 39, Noida",
                city="Greater Noida",
                state="Uttar Pradesh",
                pincode="201301",
                phone="108",
                services=json.dumps(["24x7 Basic Life Support (BLS)", "Advanced Life Support (ALS)", "Emergency Transit"]),
                source_url="https://up108ambulance.org",
                verification_status="verified",
                discovered_by="manual",
            ),
        ]
        for p in demo_providers:
            db.add(p)

        db.commit()
        print("[Seed] Successfully seeded 5 demo accounts and 5 baseline healthcare providers.")

    except Exception as e:
        db.rollback()
        print(f"[Seed] Error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
