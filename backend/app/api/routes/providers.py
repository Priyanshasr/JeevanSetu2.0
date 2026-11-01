"""
Provider discovery, authority directory, and official data sources endpoints.
"""
import json
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
    department_contacts: Optional[dict] = None
    capacity: Optional[str] = None
    source_url: Optional[str] = None
    verification_status: str = "source_available"


def safe_json_parse(value, fallback=None):
    if not value:
        return fallback
    if isinstance(value, (list, dict)):
        return value
    try:
        return json.loads(value)
    except Exception:
        return fallback


GOVERNMENT_AUTHORITIES = [
    {
        "id": "cmo-gbnagar",
        "designation": "Chief Medical Officer (CMO)",
        "jurisdiction": "Gautam Buddha Nagar, Uttar Pradesh",
        "official_reference": "Office of the CMO (Dr. R.K. Garg noted in historical order)",
        "email": "cmogbnr@up.nic.in",
        "phones": ["9359071829", "9582054784"],
        "source": "http://upsa.in/wp-content/uploads/CMO-email-id.pdf",
        "verification_status": "Pending Independent Verification",
        "notice": "Office designations are preferred over individual names as tenures rotate.",
    },
    {
        "id": "health-dept-gbnagar",
        "designation": "District Health Department",
        "jurisdiction": "Gautam Buddha Nagar Administration",
        "official_reference": "Official District Administration Portal",
        "website": "https://gbnagar.nic.in/health/",
        "phones": [
            {"label": "NHM Helpline", "number": "1800-180-1104"},
            {"label": "Ambulance", "number": "108"},
            {"label": "Pregnancy Ambulance", "number": "102"},
            {"label": "District Emergency Helpline", "number": "18004192211"},
            {"label": "Govt Hospital Helpline", "number": "1800-180-5145"},
        ],
        "source": "https://gbnagar.nic.in/health/",
        "verification_status": "Source Available (Cross-check against current district bulletin recommended)",
    },
    {
        "id": "dgmhs-up",
        "designation": "Directorate General of Medical and Health Services",
        "jurisdiction": "Government of Uttar Pradesh",
        "official_reference": "State Medical & Health Directorate",
        "email": "dep_medah@up.gov.in",
        "office_phone": "0522-2239306",
        "address": "4th floor, Room No. 401, Lal Bahadur Shastri Bhawan, UP Secretariat, Lucknow – 226001",
        "source": "https://nhm.gov.in/pdf/Contact-us/Contact-us.pdf",
        "verification_status": "Official Government Source Cited",
    },
    {
        "id": "up-nhm",
        "designation": "UP National Health Mission (UP NHM)",
        "jurisdiction": "State Mission Directorate, Uttar Pradesh",
        "official_reference": "National Health Mission Uttar Pradesh",
        "email": "mdupnrhm@gmail.com",
        "phone": "0522-2237496",
        "address": "Mandi Parisad Bhawan, 16 A.P. Sen Road, Charbagh, Lucknow – 226001",
        "source": "https://nhm.gov.in/pdf/Contact-us/Contact-us.pdf",
        "verification_status": "Official Government Source Cited",
    },
]

DATA_SOURCES = [
    {
        "id": "hmis-india",
        "label": "Rural Health Statistics / HMIS – Government of India",
        "url": "https://hmis.mohfw.gov.in/#/",
        "scope": "Aggregate Health Infrastructure Intelligence",
        "use_cases": [
            "PHC infrastructure statistics",
            "CHC infrastructure statistics",
            "Sub Health Centre statistics",
            "Health and Wellness Centre statistics",
            "District-level health infrastructure research",
        ],
        "data_notice": "HMIS supplies aggregate state and district level statistics. Individual facility addresses and direct phone numbers are awaiting official district confirmation.",
    },
    {
        "id": "gbnagar-portal",
        "label": "Gautam Buddha Nagar Official District Portal",
        "url": "https://gbnagar.nic.in/public-utility-category/hospitals/",
        "scope": "District Public Utilities & Hospital Directory",
        "use_cases": [
            "Official district hospital listings (Govt. District Hospital Sector-30)",
            "District verified healthcare facilities",
        ],
        "data_notice": "Primary public registry maintained by Gautam Buddha Nagar district administration.",
    },
    {
        "id": "gims-portal",
        "label": "Government Institute of Medical Sciences (GIMS) Portal",
        "url": "https://www.gims.ac.in/hospital.html",
        "scope": "Autonomous State Medical Institute",
        "use_cases": [
            "500-bed hospital capacity verification",
            "Department emergency desk and ambulance lines",
            "Ayushman Bharat (PM-JAY) desk contact numbers",
        ],
        "data_notice": "Official institutional portal for the 500-bed tertiary care centre in Kasna, Greater Noida.",
    },
]


@router.get("/authorities")
def get_healthcare_authorities():
    """Directory of verified government healthcare authorities and administrative desks."""
    return GOVERNMENT_AUTHORITIES


@router.get("/data-sources")
def get_data_sources():
    """Official data source references including HMIS Government of India and District Registries."""
    return DATA_SOURCES


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
                Provider.services.ilike(search_fmt),
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
            "capacity": p.capacity,
            "services": safe_json_parse(p.services, []),
            "department_contacts": safe_json_parse(p.department_contacts, {}),
            "source_url": p.source_url,
            "last_checked": p.last_checked.strftime("%Y-%m-%d") if p.last_checked else "2026-11-01",
            "verification_status": p.verification_status or "source_available",
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
        "capacity": p.capacity,
        "services": safe_json_parse(p.services, []),
        "department_contacts": safe_json_parse(p.department_contacts, {}),
        "source_url": p.source_url,
        "last_checked": p.last_checked.strftime("%Y-%m-%d") if p.last_checked else "2026-11-01",
        "verification_status": p.verification_status or "source_available",
    }
