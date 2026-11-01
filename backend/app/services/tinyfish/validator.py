"""
Validates normalized provider records and avoids duplicates against database.
"""
from sqlalchemy.orm import Session
from app.models.provider import Provider
from app.services.tinyfish.normalizer import NormalizedProvider


def validate_and_deduplicate(db: Session, provider_data: NormalizedProvider) -> bool:
    """
    Check if a provider already exists based on source_url or exact name and city.
    Returns True if valid new provider, False if duplicate.
    """
    # Check by source URL
    existing_url = db.query(Provider).filter(Provider.source_url == provider_data.source_url).first()
    if existing_url:
        return False

    # Check by name and city
    existing_name = db.query(Provider).filter(
        Provider.name.ilike(f"%{provider_data.name}%"),
        Provider.city.ilike(f"%{provider_data.city}%") if provider_data.city else True,
    ).first()
    if existing_name:
        return False

    return True
