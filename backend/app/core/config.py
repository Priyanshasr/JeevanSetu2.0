"""
Core application settings loaded from .env file.
"""
from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load .env from JeevanSetu2.0/.env
_base_dir = Path(__file__).resolve().parent.parent.parent
_env_path = _base_dir.parent / ".env"
if not _env_path.exists():
    _env_path = _base_dir / ".env"
load_dotenv(dotenv_path=_env_path)

_default_db_path = _base_dir / "jeevansetu.db"


class Settings(BaseSettings):
    SECRET_KEY: str = "fallback-dev-secret-key-change-in-production"
    DATABASE_URL: str = f"sqlite:///{_default_db_path.as_posix()}"
    TINYFISH_API_KEY: str = ""
    ENVIRONMENT: str = "development"

    # JWT settings
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Upload settings
    UPLOAD_DIR: str = str(_base_dir / "uploads")
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB

    # CORS
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

    class Config:
        env_file = str(_env_path)
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
