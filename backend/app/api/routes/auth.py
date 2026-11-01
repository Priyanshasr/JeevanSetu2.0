"""
Authentication endpoints: register, login, current user.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.db.database import get_db
from app.models.user import User
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.hospital import Hospital
from app.models.paramedic import Paramedic
from app.core.security import verify_password, hash_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "patient"
    phone: Optional[str] = None
    # Role specific
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    blood_group: Optional[str] = None
    registration_number: Optional[str] = None
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    hospital_name: Optional[str] = None
    hospital_type: Optional[str] = None
    service_area: Optional[str] = None


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(
        email=data.email.lower(),
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        role=data.role,
        phone=data.phone,
        is_active=True,
        is_verified=data.role == "patient",  # Auto-verify patients
    )
    db.add(user)
    db.flush()

    # Create role-specific profile
    if data.role == "patient":
        patient = Patient(
            user_id=user.id,
            city=data.city,
            state=data.state,
            pincode=data.pincode,
            blood_group=data.blood_group,
        )
        db.add(patient)
    elif data.role == "doctor":
        doctor = Doctor(
            user_id=user.id,
            registration_number=data.registration_number or "PENDING",
            specialization=data.specialization or "General Medicine",
            qualification=data.qualification or "MBBS",
            city=data.city,
            state=data.state,
            is_verified=False,
        )
        db.add(doctor)
    elif data.role == "hospital":
        hospital = Hospital(
            user_id=user.id,
            name=data.hospital_name or data.full_name,
            type=data.hospital_type or "private",
            city=data.city,
            state=data.state,
            pincode=data.pincode,
            phone=data.phone,
            is_verified=False,
        )
        db.add(hospital)
    elif data.role == "paramedic":
        paramedic = Paramedic(
            user_id=user.id,
            registration_number=data.registration_number or "PENDING",
            qualification=data.qualification or "EMT-Basic",
            service_area=data.service_area or data.city,
            city=data.city,
            state=data.state,
            is_verified=False,
        )
        db.add(paramedic)

    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "phone": user.phone,
            "is_verified": user.is_verified,
        },
    }


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is disabled",
        )

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "phone": user.phone,
            "is_verified": user.is_verified,
        },
    }


@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "phone": user.phone,
        "is_verified": user.is_verified,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }
