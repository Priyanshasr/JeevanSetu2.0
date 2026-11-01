"""
JeevanSetu 2.0 — FastAPI Application Entry Point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import create_tables

# Route imports
from app.api.routes import auth, providers, tinyfish, medical_records, appointments, emergency, admin, schemes

app = FastAPI(
    title="JeevanSetu 2.0 API",
    description="Healthcare Within Everyone's Reach — AI-Powered Healthcare Discovery & Coordination Platform",
    version="2.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    print("[Startup] Initializing database tables...")
    create_tables()
    print("[Startup] JeevanSetu 2.0 backend ready.")


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "JeevanSetu 2.0 Backend",
        "environment": settings.ENVIRONMENT,
        "tinyfish_configured": bool(settings.TINYFISH_API_KEY),
    }


# Include routers
app.include_router(auth.router)
app.include_router(providers.router)
app.include_router(tinyfish.router)
app.include_router(medical_records.router)
app.include_router(appointments.router)
app.include_router(emergency.router)
app.include_router(admin.router)
app.include_router(schemes.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
