"""
Provider model — discovered healthcare providers with official source citations.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Float, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Provider(Base):
    __tablename__ = "providers"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    provider_type: Mapped[str] = mapped_column(String(100), nullable=False)  # Government Hospital/Hospital/Doctor/Ambulance/Clinic
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    state: Mapped[str | None] = mapped_column(String(100), nullable=True)
    pincode: Mapped[str | None] = mapped_column(String(10), nullable=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    website: Mapped[str | None] = mapped_column(String(500), nullable=True)
    services: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON text
    department_contacts: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON text of departmental numbers
    capacity: Mapped[str | None] = mapped_column(String(100), nullable=True)  # e.g. "500 beds"
    source_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    last_checked: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=utcnow)
    verification_status: Mapped[str] = mapped_column(
        String(50),
        default="source_available",  # "pending", "source_available", "verified", "rejected"
    )
    discovered_by: Mapped[str] = mapped_column(
        String(50),
        default="tinyfish",
    )
    tinyfish_task_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )
