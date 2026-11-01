"""
Emergency assistance and nearby emergency provider routing.
Clearly distinguishes general public emergency numbers from hospital-specific lines.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.models.emergency import EmergencyRequest
from app.models.provider import Provider
from app.models.patient import Patient
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/emergency", tags=["emergency"])


class EmergencyCreate(BaseModel):
    request_type: str = "ambulance"  # ambulance/trauma/cardiac/maternity
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None


@router.post("/request")
def trigger_emergency(
    data: EmergencyCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    patient = db.query(Patient).filter(Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(status_code=400, detail="Only registered patients can trigger emergency notices")

    req = EmergencyRequest(
        patient_id=patient.id,
        request_type=data.request_type,
        address=data.address or patient.address,
        latitude=data.latitude,
        longitude=data.longitude,
        description=data.description,
        status="active",
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    return {
        "id": req.id,
        "status": "active",
        "emergency_helpline": "108",
        "ambulance_helpline": "102",
        "message": "Emergency contact notification logged. Please dial 108 or hospital emergency numbers directly.",
    }


@router.get("/requests")
def list_emergency_requests(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == user.id).first()
        reqs = db.query(EmergencyRequest).filter(EmergencyRequest.patient_id == patient.id).all() if patient else []
    else:
        reqs = db.query(EmergencyRequest).order_by(EmergencyRequest.created_at.desc()).limit(20).all()

    return [
        {
            "id": r.id,
            "request_type": r.request_type,
            "status": r.status,
            "address": r.address,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in reqs
    ]


@router.get("/nearby-providers")
def get_nearby_emergency_providers(city: str = "Greater Noida", db: Session = Depends(get_db)):
    """
    Directory of official emergency response helplines and hospital emergency lines.
    Clearly distinguishes general public emergency helplines from hospital-specific lines.
    """
    providers = db.query(Provider).filter(
        Provider.provider_type.in_(["Hospital", "Government Hospital", "Ambulance"])
    ).limit(10).all()

    # General Public Emergency Helplines
    general_helplines = [
        {"name": "National Ambulance Service", "phone": "108", "category": "General Emergency", "notes": "Toll-free 24x7 for all medical emergencies"},
        {"name": "Maternal & Infant Ambulance", "phone": "102", "category": "Maternal & Child", "notes": "Free transport for pregnant women & infants"},
        {"name": "National Emergency Integrated", "phone": "112", "category": "Integrated Services", "notes": "Single emergency response number"},
        {"name": "District Emergency Helpline", "phone": "18004192211", "category": "District Administration", "notes": "Gautam Buddha Nagar emergency helpline"},
        {"name": "NHM State Health Helpline", "phone": "1800-180-1104", "category": "Health Support", "notes": "National Health Mission Uttar Pradesh"},
        {"name": "Government Hospital Helpline", "phone": "1800-180-5145", "category": "Govt Hospital Support", "notes": "Subject to periodic verification with district portal"},
    ]

    # Hospital-Specific Emergency Contacts
    hospital_specific = [
        {
            "hospital": "Government Institute of Medical Sciences (GIMS), Kasna",
            "department": "Emergency Desk",
            "phone": "7303884229",
            "type": "Hospital Emergency",
        },
        {
            "hospital": "Government Institute of Medical Sciences (GIMS), Kasna",
            "department": "Hospital Ambulance",
            "phone": "9667993869",
            "type": "Hospital Ambulance",
        },
        {
            "hospital": "Max Multi Speciality Hospital, Noida",
            "department": "Hospital Helpline",
            "phone": "01206629999",
            "type": "Hospital Direct",
        },
    ]

    return {
        "general_helplines": general_helplines,
        "helplines": general_helplines,  # compatibility alias
        "hospital_specific": hospital_specific,
        "providers": [
            {
                "id": p.id,
                "name": p.name,
                "provider_type": p.provider_type,
                "address": p.address,
                "phone": p.phone,
                "city": p.city,
                "capacity": p.capacity,
                "source_url": p.source_url,
            }
            for p in providers
        ],
    }
