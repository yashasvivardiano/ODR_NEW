"""
Configuration settings for ODR AI System
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    
    # AI Provider Configuration
    OPENAI_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    
    # Default AI Provider
    DEFAULT_AI_PROVIDER: str = "openai"
    DEFAULT_AI_MODEL: str = "gpt-4o-mini"
    
    # Database Configuration
    DATABASE_URL: str = "postgresql://user:password@localhost/odr_ai"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # File Processing
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    UPLOAD_DIR: str = "uploads"
    PROCESSED_DIR: str = "processed"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/odr_ai.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

def get_settings() -> Settings:
    """Get application settings"""
    return Settings()
