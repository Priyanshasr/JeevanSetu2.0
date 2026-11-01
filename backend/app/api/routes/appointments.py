"""
Appointment booking and tracking endpoints.
"""
from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.models.medical_record import Appointment, DoctorObservation
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/appointments", tags=["appointments"])


class AppointmentCreate(BaseModel):
    doctor_id: Optional[str] = None
    hospital_id: Optional[str] = None
    appointment_type: str = "consultation"
    requested_date: Optional[str] = None
    notes: Optional[str] = None


class AppointmentStatusUpdate(BaseModel):
    status: str  # confirmed/completed/cancelled
    confirmed_date: Optional[str] = None


class ObservationCreate(BaseModel):
    observations: str
    diagnosis: Optional[str] = None
    prescription: Optional[str] = None
    follow_up_date: Optional[str] = None


@router.post("/")
def create_appointment(
    data: AppointmentCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    patient = db.query(Patient).filter(Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(status_code=400, detail="Only registered patients can request appointments")

    req_dt = None
    if data.requested_date:
        try:
            req_dt = datetime.fromisoformat(data.requested_date)
        except Exception:
            pass

    appt = Appointment(
        patient_id=patient.id,
        doctor_id=data.doctor_id,
        hospital_id=data.hospital_id,
        appointment_type=data.appointment_type,
        status="requested",
        requested_date=req_dt,
        notes=data.notes,
    )
    db.add(appt)
    db.commit()
    db.refresh(appt)

    return {"id": appt.id, "status": appt.status, "message": "Appointment requested successfully"}


@router.get("/")
def list_appointments(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == user.id).first()
        if not patient:
            return []
        appts = db.query(Appointment).filter(Appointment.patient_id == patient.id).all()
    elif user.role == "doctor":
        doctor = db.query(Doctor).filter(Doctor.user_id == user.id).first()
        if not doctor:
            return []
        appts = db.query(Appointment).filter(Appointment.doctor_id == doctor.id).all()
    else:
        appts = db.query(Appointment).limit(50).all()

    return [
        {
            "id": a.id,
            "patient_id": a.patient_id,
            "doctor_id": a.doctor_id,
            "hospital_id": a.hospital_id,
            "appointment_type": a.appointment_type,
            "status": a.status,
            "requested_date": a.requested_date.isoformat() if a.requested_date else None,
            "confirmed_date": a.confirmed_date.isoformat() if a.confirmed_date else None,
            "notes": a.notes,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        }
        for a in appts
    ]


@router.put("/{appointment_id}/status")
def update_status(
    appointment_id: str,
    data: AppointmentStatusUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appt.status = data.status
    if data.confirmed_date:
        try:
            appt.confirmed_date = datetime.fromisoformat(data.confirmed_date)
        except Exception:
            pass
    db.commit()
    return {"id": appt.id, "status": appt.status}
