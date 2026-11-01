"""
Normalizes raw scraped/extracted text and HTML from TinyFish into structured Provider records.
"""
import re
from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class NormalizedProvider(BaseModel):
    name: str
    provider_type: str = "Hospital"
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    services: List[str] = []
    source_url: str
    verification_status: str = "pending"


def normalize_provider_data(
    title: str,
    text_content: str,
    source_url: str,
    location_hint: Optional[str] = None,
) -> NormalizedProvider:
    """
    Extract structured provider fields from webpage title, markdown/text content, and source URL.
    """
    clean_title = re.sub(r"[-|].*$", "", title).strip()
    name = clean_title if len(clean_title) > 3 else "Healthcare Provider"

    # Identify provider type
    lower_text = (title + " " + text_content[:2000]).lower()
    provider_type = "Hospital"
    if "primary health centre" in lower_text or "phc" in lower_text:
        provider_type = "PHC"
    elif "community health centre" in lower_text or "chc" in lower_text:
        provider_type = "CHC"
    elif "government hospital" in lower_text or "district hospital" in lower_text:
        provider_type = "Government Hospital"
    elif "paramedic" in lower_text or "ambulance" in lower_text:
        provider_type = "Ambulance"
    elif "clinic" in lower_text or "doctor" in lower_text:
        provider_type = "Clinic"

    # Extract Phone
    phone_match = re.search(r"(\+91[\-\s]?)?[6-9]\d{9}|(0\d{2,4}[\-\s]?\d{6,8})", text_content)
    phone = phone_match.group(0).strip() if phone_match else None

    # Extract PIN Code
    pin_match = re.search(r"\b[1-9][0-9]{5}\b", text_content)
    pincode = pin_match.group(0) if pin_match else None

    # Extract Email
    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text_content)
    email = email_match.group(0) if email_match else None

    # Detect common services
    services_keywords = [
        "Emergency", "ICU", "OPD", "General Medicine", "Pediatrics", "Gynecology",
        "Surgery", "Cardiology", "Orthopedics", "Radiology", "Pathology", "Maternity",
        "Trauma Care", "Dialysis", "Pharmacy", "Ambulance", "Vaccination"
    ]
    detected_services = [s for s in services_keywords if s.lower() in lower_text]
    if not detected_services:
        detected_services = ["General Medicine", "Outpatient Services"]

    # City & State hints
    city = location_hint or "Delhi NCR"
    state = "Delhi"
    if "uttar pradesh" in lower_text or "noida" in lower_text or "greater noida" in lower_text:
        state = "Uttar Pradesh"
    elif "haryana" in lower_text or "gurugram" in lower_text or "faridabad" in lower_text:
        state = "Haryana"

    return NormalizedProvider(
        name=name,
        provider_type=provider_type,
        address=f"{name}, {city}, {state}",
        city=city,
        state=state,
        pincode=pincode,
        phone=phone,
        email=email,
        website=source_url,
        services=detected_services,
        source_url=source_url,
        verification_status="pending",
    )
