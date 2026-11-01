"""
TinyFish task tracking, website monitors, monitoring changes, and audit logs.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Float, Boolean, DateTime, ForeignKey, Integer, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class TinyFishTask(Base):
    __tablename__ = "tinyfish_tasks"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    task_type: Mapped[str] = mapped_column(
        SAEnum("search", "fetch", "agent", "monitor", name="task_type"),
        nullable=False,
    )
    query: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        SAEnum("pending", "running", "completed", "failed", name="task_status"),
        default="pending",
    )
    result: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON stored as text
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_urls: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON list of URLs
    duration_seconds: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class WebsiteMonitor(Base):
    __tablename__ = "website_monitors"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    tinyfish_monitor_id: Mapped[str | None] = mapped_column(String(200), nullable=True)
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    monitor_type: Mapped[str] = mapped_column(
        SAEnum("fetch", "search", name="monitor_type"),
        nullable=False,
    )
    target_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    search_query: Mapped[str | None] = mapped_column(Text, nullable=True)
    schedule_cron: Mapped[str] = mapped_column(String(50), nullable=False)
    purpose: Mapped[str | None] = mapped_column(Text, nullable=True)
    webhook_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )

    changes = relationship("MonitoringChange", back_populates="monitor")


class MonitoringChange(Base):
    __tablename__ = "monitoring_changes"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    monitor_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("website_monitors.id", ondelete="CASCADE"), nullable=False
    )
    change_detected: Mapped[bool] = mapped_column(Boolean, default=False)
    change_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    raw_diff: Mapped[str | None] = mapped_column(Text, nullable=True)
    validation_status: Mapped[str] = mapped_column(
        SAEnum("pending", "validated", "rejected", name="validation_status"),
        default="pending",
    )
    validated_by: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    monitor = relationship("WebsiteMonitor", back_populates="changes")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    resource_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    resource_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON text
    ip_address: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    user = relationship("User", back_populates="audit_logs")
