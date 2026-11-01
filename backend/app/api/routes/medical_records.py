"""
Medical records and consent management endpoints.
Strictly role-protected and consent-gated.
"""
import os
import shutil
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.medical_record import MedicalRecord, PatientConsent
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/medical-records", tags=["medical-records"])
UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_record(
    title: str = Form(...),
    record_type: str = Form("prescription"),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Securely upload patient medical records."""
    patient = db.query(Patient).filter(Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(status_code=400, detail="Only registered patients can upload health records")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".png", ".jpg", ".jpeg"]:
        raise HTTPException(status_code=400, detail="Only PDF and standard image files are permitted")

    stored_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, stored_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    record = MedicalRecord(
        patient_id=patient.id,
        title=title,
        record_type=record_type,
        description=description,
        file_path=file_path,
        file_name=file.filename,
        file_size=os.path.getsize(file_path),
        mime_type=file.content_type,
        is_shared=False,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "title": record.title,
        "record_type": record.record_type,
        "file_name": record.file_name,
        "created_at": record.created_at.isoformat(),
    }


@router.get("/")
def list_records(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """List medical records with strict consent checks."""
    if user.role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == user.id).first()
        if not patient:
            return []
        records = db.query(MedicalRecord).filter(MedicalRecord.patient_id == patient.id).all()
    elif user.role == "doctor":
        doctor = db.query(Doctor).filter(Doctor.user_id == user.id).first()
        if not doctor:
            return []
        # Return only records that patient consented to share with this doctor
        consented_record_ids = [
            c.medical_record_id for c in db.query(PatientConsent).filter(
                PatientConsent.doctor_id == doctor.id,
                PatientConsent.is_granted == True,
            ).all() if c.medical_record_id
        ]
        records = db.query(MedicalRecord).filter(MedicalRecord.id.in_(consented_record_ids)).all()
    else:
        records = []

    return [
        {
            "id": r.id,
            "title": r.title,
            "record_type": r.record_type,
            "description": r.description,
            "file_name": r.file_name,
            "file_size": r.file_size,
            "is_shared": r.is_shared,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in records
    ]


@router.post("/{record_id}/share")
def share_record_with_doctor(
    record_id: str,
    doctor_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Grant explicit consent to a doctor to view a specific health record."""
    patient = db.query(Patient).filter(Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(status_code=403, detail="Only patients can manage consent")

    record = db.query(MedicalRecord).filter(
        MedicalRecord.id == record_id, MedicalRecord.patient_id == patient.id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Medical record not found")

    consent = PatientConsent(
        patient_id=patient.id,
        doctor_id=doctor_id,
        medical_record_id=record.id,
        consent_type="view_records",
        is_granted=True,
    )
    record.is_shared = True
    db.add(consent)
    db.commit()
    return {"shared": True, "record_id": record.id, "doctor_id": doctor_id}
