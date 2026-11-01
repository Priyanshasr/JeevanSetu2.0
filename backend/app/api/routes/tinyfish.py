"""
TinyFish Web-Intelligence endpoints:
- AI-driven live healthcare provider discovery via Search + Fetch
- Autonomous multi-step Agent execution
- Website monitoring tracking and webhooks
- Discovery task history and live status
"""
import json
import time
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.models.provider import Provider
from app.models.tinyfish_task import TinyFishTask, WebsiteMonitor, MonitoringChange
from app.services.tinyfish import search as tf_search
from app.services.tinyfish import fetch as tf_fetch
from app.services.tinyfish import agent as tf_agent
from app.services.tinyfish import monitor as tf_monitor
from app.services.tinyfish.normalizer import normalize_provider_data
from app.services.tinyfish.validator import validate_and_deduplicate

router = APIRouter(prefix="/tinyfish", tags=["tinyfish"])


class DiscoverRequest(BaseModel):
    query: str
    location: Optional[str] = "Greater Noida"
    provider_type: Optional[str] = "all"


class AgentRequest(BaseModel):
    url: str
    goal: str
    output_schema: Optional[dict] = None


class MonitorCreateRequest(BaseModel):
    name: str
    type: str = "fetch"  # "fetch" or "search"
    target_url: Optional[str] = None
    search_query: Optional[str] = None
    schedule_cron: str = "0 9 * * *"
    purpose: str = "Healthcare facility contact or service changes"
    webhook_url: Optional[str] = None


@router.post("/discover")
async def run_discovery(payload: DiscoverRequest, db: Session = Depends(get_db)):
    """
    Execute end-to-end TinyFish AI discovery:
    1. TinyFish Search for live healthcare sources
    2. TinyFish Fetch for content extraction
    3. Normalization into structured JSON schema
    4. Validation and database storage
    """
    start_time = time.time()
    search_query = f"{payload.query} {payload.location}".strip()
    
    task = TinyFishTask(
        task_type="search",
        query=search_query,
        status="running",
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    try:
        # Step 1: Live search via TinyFish Search API
        search_res = await tf_search.search(
            query=search_query,
            location=payload.location,
            recency_minutes=1440 * 30,  # last 30 days
        )
        found_urls = search_res.get_urls()[:5]  # Top 5 target URLs

        extracted_providers = []
        if found_urls:
            # Step 2: Content fetch and clean markdown rendering via TinyFish Fetch API
            fetch_res = await tf_fetch.fetch(found_urls)
            for page in fetch_res.results:
                if page.text:
                    norm = normalize_provider_data(
                        title=page.title or search_query,
                        text_content=page.text,
                        source_url=page.final_url or page.url,
                        location_hint=payload.location,
                    )
                    # Step 3: Validate and save to DB
                    if validate_and_deduplicate(db, norm):
                        prov = Provider(
                            name=norm.name,
                            provider_type=norm.provider_type,
                            address=norm.address,
                            city=norm.city,
                            state=norm.state,
                            pincode=norm.pincode,
                            phone=norm.phone,
                            email=norm.email,
                            website=norm.website,
                            services=json.dumps(norm.services),
                            source_url=norm.source_url,
                            verification_status="pending",
                            discovered_by="tinyfish",
                            tinyfish_task_id=task.id,
                        )
                        db.add(prov)
                        extracted_providers.append(norm.model_dump())

            db.commit()

        duration = round(time.time() - start_time, 2)
        task.status = "completed"
        task.source_urls = json.dumps(found_urls)
        task.result = json.dumps(extracted_providers)
        task.duration_seconds = duration
        task.completed_at = datetime.now(timezone.utc)
        db.commit()

        return {
            "task_id": task.id,
            "status": "completed",
            "query": search_query,
            "urls_searched": len(found_urls),
            "providers_extracted": len(extracted_providers),
            "results": extracted_providers,
            "duration_seconds": duration,
        }

    except Exception as e:
        db.rollback()
        duration = round(time.time() - start_time, 2)
        task.status = "failed"
        task.error_message = str(e)
        task.duration_seconds = duration
        task.completed_at = datetime.now(timezone.utc)
        db.commit()
        raise HTTPException(
            status_code=500,
            detail=f"TinyFish discovery failed: {str(e)}",
        )


@router.post("/agent")
async def run_agent_workflow(payload: AgentRequest, db: Session = Depends(get_db)):
    """Run TinyFish autonomous agent on a target URL."""
    task = TinyFishTask(
        task_type="agent",
        query=f"Goal: {payload.goal} on {payload.url}",
        status="running",
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    start_time = time.time()
    try:
        result = await tf_agent.run_agent(
            url=payload.url,
            goal=payload.goal,
            output_schema=payload.output_schema,
        )
        duration = round(time.time() - start_time, 2)
        task.status = "completed"
        task.result = json.dumps(result)
        task.duration_seconds = duration
        task.completed_at = datetime.now(timezone.utc)
        db.commit()
        return {"task_id": task.id, "status": "completed", "result": result}
    except Exception as e:
        task.status = "failed"
        task.error_message = str(e)
        task.duration_seconds = round(time.time() - start_time, 2)
        task.completed_at = datetime.now(timezone.utc)
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tasks")
def list_tasks(limit: int = 20, db: Session = Depends(get_db)):
    """List recent TinyFish tasks and live activity."""
    tasks = db.query(TinyFishTask).order_by(TinyFishTask.created_at.desc()).limit(limit).all()
    return [
        {
            "id": t.id,
            "task_type": t.task_type,
            "query": t.query,
            "status": t.status,
            "error_message": t.error_message,
            "source_urls": json.loads(t.source_urls) if t.source_urls else [],
            "duration_seconds": t.duration_seconds,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "completed_at": t.completed_at.isoformat() if t.completed_at else None,
        }
        for t in tasks
    ]


@router.get("/tasks/{task_id}")
def get_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(TinyFishTask).filter(TinyFishTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {
        "id": task.id,
        "task_type": task.task_type,
        "query": task.query,
        "status": task.status,
        "result": json.loads(task.result) if task.result else None,
        "error_message": task.error_message,
        "source_urls": json.loads(task.source_urls) if task.source_urls else [],
        "duration_seconds": task.duration_seconds,
        "created_at": task.created_at.isoformat() if task.created_at else None,
        "completed_at": task.completed_at.isoformat() if task.completed_at else None,
    }


@router.post("/monitors")
async def create_monitor(payload: MonitorCreateRequest, db: Session = Depends(get_db)):
    """Create a website monitor in TinyFish."""
    try:
        if payload.type == "fetch" and payload.target_url:
            tf_res = await tf_monitor.create_fetch_monitor(
                name=payload.name,
                url=payload.target_url,
                schedule_cron=payload.schedule_cron,
                purpose=payload.purpose,
                webhook_url=payload.webhook_url,
            )
        elif payload.type == "search" and payload.search_query:
            tf_res = await tf_monitor.create_search_monitor(
                name=payload.name,
                query=payload.search_query,
                schedule_cron=payload.schedule_cron,
                purpose=payload.purpose,
                webhook_url=payload.webhook_url,
            )
        else:
            tf_res = {"monitor": {"id": "local-fallback"}}

        monitor_id = tf_res.get("monitor", {}).get("id") if isinstance(tf_res, dict) else None

        mon = WebsiteMonitor(
            tinyfish_monitor_id=monitor_id,
            name=payload.name,
            monitor_type=payload.type,
            target_url=payload.target_url,
            search_query=payload.search_query,
            schedule_cron=payload.schedule_cron,
            purpose=payload.purpose,
            webhook_url=payload.webhook_url,
            status="active",
        )
        db.add(mon)
        db.commit()
        db.refresh(mon)
        return {"id": mon.id, "status": "active", "tinyfish_monitor": tf_res}
    except Exception as e:
        # Fallback local monitor save if external API restricts monitor creation
        mon = WebsiteMonitor(
            name=payload.name,
            monitor_type=payload.type,
            target_url=payload.target_url,
            search_query=payload.search_query,
            schedule_cron=payload.schedule_cron,
            purpose=payload.purpose,
            webhook_url=payload.webhook_url,
            status="active",
        )
        db.add(mon)
        db.commit()
        db.refresh(mon)
        return {"id": mon.id, "status": "active_local", "message": str(e)}


@router.get("/monitors")
def list_active_monitors(db: Session = Depends(get_db)):
    monitors = db.query(WebsiteMonitor).all()
    return [
        {
            "id": m.id,
            "name": m.name,
            "type": m.monitor_type,
            "target_url": m.target_url,
            "search_query": m.search_query,
            "schedule_cron": m.schedule_cron,
            "purpose": m.purpose,
            "status": m.status,
            "created_at": m.created_at.isoformat() if m.created_at else None,
        }
        for m in monitors
    ]


@router.delete("/monitors/{monitor_id}")
async def delete_active_monitor(monitor_id: str, db: Session = Depends(get_db)):
    mon = db.query(WebsiteMonitor).filter(WebsiteMonitor.id == monitor_id).first()
    if not mon:
        raise HTTPException(status_code=404, detail="Monitor not found")
    if mon.tinyfish_monitor_id:
        try:
            await tf_monitor.delete_monitor(mon.tinyfish_monitor_id)
        except Exception:
            pass
    db.delete(mon)
    db.commit()
    return {"deleted": True, "id": monitor_id}


@router.post("/webhook")
async def monitor_webhook(payload: dict, db: Session = Depends(get_db)):
    """Receives webhook notifications from TinyFish Monitor when changes occur."""
    monitor_id = payload.get("monitor_id")
    summary = payload.get("summary", "Website content change detected")
    diff = payload.get("diff", "")
    
    mon = db.query(WebsiteMonitor).filter(WebsiteMonitor.tinyfish_monitor_id == monitor_id).first()
    if mon:
        change = MonitoringChange(
            monitor_id=mon.id,
            change_detected=True,
            change_summary=summary,
            raw_diff=str(diff),
            validation_status="pending",
        )
        db.add(change)
        db.commit()
    return {"received": True}
