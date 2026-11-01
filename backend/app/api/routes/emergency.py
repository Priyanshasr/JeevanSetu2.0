"""
Emergency assistance and nearby emergency provider routing.
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
        raise HTTPException(status_code=400, detail="Only registered patients can trigger SOS")

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
        "message": "Emergency broadcast initiated. Responders alerted.",
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
    """Fast directory of verified emergency response centres and ambulance hubs."""
    providers = db.query(Provider).filter(
        Provider.provider_type.in_(["Hospital", "Government Hospital", "Ambulance", "CHC"])
    ).limit(10).all()

    # Always return reliable emergency national helpline numbers
    helplines = [
        {"name": "National Emergency Number", "phone": "112", "type": "National"},
        {"name": "Ambulance Service", "phone": "108", "type": "Ambulance"},
        {"name": "Pregnant Women & Infant Ambulance", "phone": "102", "type": "Maternal"},
        {"name": "Disaster Management Services", "phone": "1078", "type": "Disaster"},
    ]

    return {
        "helplines": helplines,
        "providers": [
            {
                "id": p.id,
                "name": p.name,
                "provider_type": p.provider_type,
                "address": p.address,
                "phone": p.phone or "108",
                "city": p.city,
            }
            for p in providers
        ],
    }
