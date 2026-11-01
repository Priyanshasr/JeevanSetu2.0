"""
Pydantic schemas for all API request/response models.
"""
from __future__ import annotations
from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, field_validator


# ─── Auth / User ────────────────────────────────────────────────────────────

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str  # patient/doctor/hospital/paramedic
    phone: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    full_name: str

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    phone: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Patient ────────────────────────────────────────────────────────────────

class PatientProfileUpdate(BaseModel):
    date_of_birth: Optional[str] = None
    blood_group: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None

class PatientOut(BaseModel):
    id: str
    user_id: str
    date_of_birth: Optional[str]
    blood_group: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    pincode: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    emergency_contact_name: Optional[str]
    emergency_contact_phone: Optional[str]
    medical_history: Optional[str]
    allergies: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Doctor ─────────────────────────────────────────────────────────────────

class DoctorProfileUpdate(BaseModel):
    registration_number: Optional[str] = None
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    hospital_affiliation: Optional[str] = None
    experience_years: Optional[int] = None
    city: Optional[str] = None
    state: Optional[str] = None
    bio: Optional[str] = None

class DoctorOut(BaseModel):
    id: str
    user_id: str
    registration_number: Optional[str]
    specialization: Optional[str]
    qualification: Optional[str]
    hospital_affiliation: Optional[str]
    experience_years: Optional[int]
    city: Optional[str]
    state: Optional[str]
    is_verified: bool
    bio: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Hospital ────────────────────────────────────────────────────────────────

class HospitalCreate(BaseModel):
    name: str
    type: str = "government"
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    services: Optional[str] = None
    departments: Optional[str] = None

class HospitalOut(BaseModel):
    id: str
    user_id: str
    name: str
    type: str
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    pincode: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    phone: Optional[str]
    email: Optional[str]
    website: Optional[str]
    services: Optional[str]
    departments: Optional[str]
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Provider ────────────────────────────────────────────────────────────────

class ProviderCreate(BaseModel):
    name: str
    provider_type: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    services: Optional[str] = None
    source_url: Optional[str] = None

class ProviderOut(BaseModel):
    id: str
    name: str
    provider_type: str
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    pincode: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    phone: Optional[str]
    email: Optional[str]
    website: Optional[str]
    services: Optional[str]
    source_url: Optional[str]
    verification_status: str
    discovered_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── TinyFish ────────────────────────────────────────────────────────────────

class DiscoverRequest(BaseModel):
    query: str
    location: Optional[str] = None
    provider_type: Optional[str] = None

class AgentRequest(BaseModel):
    url: str
    goal: str
    output_schema: Optional[dict] = None

class MonitorCreate(BaseModel):
    name: str
    monitor_type: str  # fetch/search
    target_url: Optional[str] = None
    search_query: Optional[str] = None
    schedule_cron: str = "0 9 * * *"
    purpose: Optional[str] = None
    webhook_url: Optional[str] = None

class TinyFishTaskOut(BaseModel):
    id: str
    task_type: str
    query: Optional[str]
    status: str
    result: Optional[str]
    error_message: Optional[str]
    source_urls: Optional[str]
    duration_seconds: Optional[float]
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True

class WebsiteMonitorOut(BaseModel):
    id: str
    tinyfish_monitor_id: Optional[str]
    name: str
    monitor_type: str
    target_url: Optional[str]
    search_query: Optional[str]
    schedule_cron: str
    purpose: Optional[str]
    webhook_url: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Medical Records ─────────────────────────────────────────────────────────

class MedicalRecordOut(BaseModel):
    id: str
    patient_id: str
    doctor_id: Optional[str]
    title: str
    description: Optional[str]
    record_type: str
    file_name: Optional[str]
    file_size: Optional[int]
    mime_type: Optional[str]
    is_shared: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Appointments ────────────────────────────────────────────────────────────

class AppointmentCreate(BaseModel):
    doctor_id: Optional[str] = None
    hospital_id: Optional[str] = None
    appointment_type: str
    requested_date: Optional[datetime] = None
    notes: Optional[str] = None

class AppointmentOut(BaseModel):
    id: str
    patient_id: str
    doctor_id: Optional[str]
    hospital_id: Optional[str]
    appointment_type: str
    status: str
    requested_date: Optional[datetime]
    confirmed_date: Optional[datetime]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Emergency ───────────────────────────────────────────────────────────────

class EmergencyRequestCreate(BaseModel):
    request_type: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    description: Optional[str] = None

class EmergencyRequestOut(BaseModel):
    id: str
    patient_id: str
    request_type: str
    latitude: Optional[float]
    longitude: Optional[float]
    address: Optional[str]
    description: Optional[str]
    status: str
    assigned_to: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Notifications ───────────────────────────────────────────────────────────

class NotificationOut(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str
    is_read: bool
    related_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Generic ─────────────────────────────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str
    success: bool = True

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int = 1
    page_size: int = 20
