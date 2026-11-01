"""
Administrative dashboards: user/provider verifications and TinyFish monitoring stats.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.models.provider import Provider
from app.models.tinyfish_task import TinyFishTask, WebsiteMonitor, MonitoringChange, AuditLog
from app.api.deps import require_role

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users")
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).limit(100).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "is_active": u.is_active,
            "is_verified": u.is_verified,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        }
        for u in users
    ]


@router.put("/users/{user_id}/verify")
def verify_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_verified = True
    db.commit()
    return {"id": user.id, "is_verified": True}


@router.get("/providers")
def list_pending_providers(status_filter: str = "all", db: Session = Depends(get_db)):
    q = db.query(Provider)
    if status_filter != "all":
        q = q.filter(Provider.verification_status == status_filter)
    providers = q.order_by(Provider.created_at.desc()).limit(100).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "provider_type": p.provider_type,
            "city": p.city,
            "source_url": p.source_url,
            "verification_status": p.verification_status,
            "discovered_by": p.discovered_by,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        }
        for p in providers
    ]


@router.put("/providers/{provider_id}/verify")
def verify_provider(provider_id: str, approved: bool = True, db: Session = Depends(get_db)):
    prov = db.query(Provider).filter(Provider.id == provider_id).first()
    if not prov:
        raise HTTPException(status_code=404, detail="Provider not found")
    prov.verification_status = "verified" if approved else "rejected"
    db.commit()
    return {"id": prov.id, "verification_status": prov.verification_status}


@router.get("/tinyfish-activity")
def get_activity_stats(db: Session = Depends(get_db)):
    total_tasks = db.query(TinyFishTask).count()
    completed = db.query(TinyFishTask).filter(TinyFishTask.status == "completed").count()
    failed = db.query(TinyFishTask).filter(TinyFishTask.status == "failed").count()
    total_monitors = db.query(WebsiteMonitor).count()
    detected_changes = db.query(MonitoringChange).count()
    
    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed,
        "failed_tasks": failed,
        "active_monitors": total_monitors,
        "detected_changes": detected_changes,
    }
