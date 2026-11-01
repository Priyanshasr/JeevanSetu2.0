"""
Doctor model — linked 1:1 to User.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Doctor(Base):
    __tablename__ = "doctors"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    registration_number: Mapped[str | None] = mapped_column(String(100), nullable=True, unique=True)
    specialization: Mapped[str | None] = mapped_column(String(200), nullable=True)
    qualification: Mapped[str | None] = mapped_column(String(300), nullable=True)
    hospital_affiliation: Mapped[str | None] = mapped_column(String(300), nullable=True)
    experience_years: Mapped[int | None] = mapped_column(Integer, nullable=True)
    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    state: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )

    # Relationships
    user = relationship("User", back_populates="doctor_profile")
    medical_records = relationship("MedicalRecord", back_populates="doctor")
    consents_received = relationship("PatientConsent", back_populates="doctor", foreign_keys="PatientConsent.doctor_id")
    appointments = relationship("Appointment", back_populates="doctor")
    observations = relationship("DoctorObservation", back_populates="doctor", foreign_keys="DoctorObservation.doctor_id")
