"""
Provider discovery and management endpoints.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel

from app.db.database import get_db
from app.models.provider import Provider

router = APIRouter(prefix="/providers", tags=["providers"])


class ProviderCreate(BaseModel):
    name: str
    provider_type: str
    address: str
    city: str
    state: str
    pincode: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    services: List[str] = []


@router.get("/")
def get_providers(
    query: Optional[str] = None,
    city: Optional[str] = None,
    provider_type: Optional[str] = None,
    pincode: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """Search and filter healthcare providers."""
    q = db.query(Provider)
    if query:
        search_fmt = f"%{query}%"
        q = q.filter(
            or_(
                Provider.name.ilike(search_fmt),
                Provider.address.ilike(search_fmt),
                Provider.services.cast(str).ilike(search_fmt),
            )
        )
    if city and city != "All":
        q = q.filter(Provider.city.ilike(f"%{city}%"))
    if provider_type and provider_type != "all":
        q = q.filter(Provider.provider_type.ilike(f"%{provider_type}%"))
    if pincode:
        q = q.filter(Provider.pincode == pincode)

    providers = q.order_by(Provider.created_at.desc()).limit(limit).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "provider_type": p.provider_type,
            "address": p.address,
            "city": p.city,
            "state": p.state,
            "pincode": p.pincode,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "phone": p.phone,
            "email": p.email,
            "website": p.website,
            "services": p.services if isinstance(p.services, list) else [],
            "source_url": p.source_url,
            "last_checked": p.last_checked.isoformat() if p.last_checked else None,
            "verification_status": p.verification_status,
            "discovered_by": p.discovered_by,
        }
        for p in providers
    ]


@router.get("/{provider_id}")
def get_provider_by_id(provider_id: str, db: Session = Depends(get_db)):
    p = db.query(Provider).filter(Provider.id == provider_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Provider not found")
    return {
        "id": p.id,
        "name": p.name,
        "provider_type": p.provider_type,
        "address": p.address,
        "city": p.city,
        "state": p.state,
        "pincode": p.pincode,
        "phone": p.phone,
        "email": p.email,
        "website": p.website,
        "services": p.services if isinstance(p.services, list) else [],
        "source_url": p.source_url,
        "verification_status": p.verification_status,
    }
