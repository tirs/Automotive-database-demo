"""Application configuration."""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Settings
    app_name: str = "Automotive AI Backend"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # Supabase Settings
    supabase_url: str = ""
    supabase_key: str = ""
    
    # CORS Settings
    allowed_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://automotive-supabase-schema.netlify.app"
    ]
    
    # AI Model Settings
    model_version: str = "v1.0.0"
    prediction_confidence_threshold: float = 0.7
    anomaly_detection_sensitivity: float = 0.1
    
    # Mock Mode (for demo without real APIs)
    use_mock_apis: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

