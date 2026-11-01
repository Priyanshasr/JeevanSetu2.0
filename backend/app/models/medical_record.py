"""
Medical records, patient consents, appointments, and doctor observations.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Integer, Boolean, Float, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    patient_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False
    )
    doctor_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("doctors.id", ondelete="SET NULL"), nullable=True
    )
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    record_type: Mapped[str] = mapped_column(String(100), nullable=False)  # prescription/lab/scan/discharge/other
    file_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    file_name: Mapped[str | None] = mapped_column(String(300), nullable=True)
    file_size: Mapped[int | None] = mapped_column(Integer, nullable=True)
    mime_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_shared: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )

    patient = relationship("Patient", back_populates="medical_records")
    doctor = relationship("Doctor", back_populates="medical_records")
    consents = relationship("PatientConsent", back_populates="medical_record")


class PatientConsent(Base):
    __tablename__ = "patient_consents"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    patient_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False
    )
    doctor_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False
    )
    medical_record_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("medical_records.id", ondelete="SET NULL"), nullable=True
    )
    consent_type: Mapped[str] = mapped_column(String(100), nullable=False)  # view_records/share_data/emergency_access
    is_granted: Mapped[bool] = mapped_column(Boolean, default=True)
    granted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    patient = relationship("Patient", back_populates="consents", foreign_keys=[patient_id])
    doctor = relationship("Doctor", back_populates="consents_received", foreign_keys=[doctor_id])
    medical_record = relationship("MedicalRecord", back_populates="consents")


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    patient_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False
    )
    doctor_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("doctors.id", ondelete="SET NULL"), nullable=True
    )
    hospital_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("hospitals.id", ondelete="SET NULL"), nullable=True
    )
    appointment_type: Mapped[str] = mapped_column(String(100), nullable=False)  # consultation/followup/emergency/teleconsult
    status: Mapped[str] = mapped_column(
        SAEnum("requested", "confirmed", "completed", "cancelled", name="appointment_status"),
        default="requested",
    )
    requested_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    confirmed_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    hospital = relationship("Hospital", back_populates="appointments")
    observations = relationship("DoctorObservation", back_populates="appointment")


class DoctorObservation(Base):
    __tablename__ = "doctor_observations"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    appointment_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("appointments.id", ondelete="CASCADE"), nullable=False
    )
    doctor_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False
    )
    patient_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False
    )
    medical_record_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("medical_records.id", ondelete="SET NULL"), nullable=True
    )
    observations: Mapped[str | None] = mapped_column(Text, nullable=True)
    diagnosis: Mapped[str | None] = mapped_column(Text, nullable=True)
    prescription: Mapped[str | None] = mapped_column(Text, nullable=True)
    follow_up_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )

    appointment = relationship("Appointment", back_populates="observations")
    doctor = relationship("Doctor", back_populates="observations", foreign_keys=[doctor_id])
