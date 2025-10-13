"""
ODR AI System - Main Application
Clean, production-ready AI system for Online Dispute Resolution
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from api.endpoints import filing, hearing, transcription
from core.ai_engines import AIEngineManager
from utils.logging import setup_logging
from config.settings import get_settings

# Global AI Engine Manager
ai_engine_manager = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    global ai_engine_manager
    
    # Startup
    setup_logging()
    ai_engine_manager = AIEngineManager()
    await ai_engine_manager.initialize()
    
    yield
    
    # Shutdown
    if ai_engine_manager:
        await ai_engine_manager.cleanup()

# Create FastAPI application
app = FastAPI(
    title="ODR AI System",
    description="AI-powered Online Dispute Resolution Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=settings.ALLOWED_CREDENTIALS,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(filing.router, prefix="/api/v1/filing", tags=["filing"])
app.include_router(hearing.router, prefix="/api/v1/hearing", tags=["hearing"])
app.include_router(transcription.router, prefix="/api/v1/transcription", tags=["transcription"])

# Inject AI manager into hearing service
@app.on_event("startup")
async def inject_ai_manager():
    """Inject AI manager into services that need it"""
    global ai_engine_manager
    if ai_engine_manager:
        # Inject into hearing service
        import api.endpoints.hearing as hearing_module
        hearing_module.ai_manager = ai_engine_manager

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "ODR AI System is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "ai_engines": ai_engine_manager.get_status() if ai_engine_manager else "not_initialized",
        "timestamp": "2024-01-01T00:00:00Z"
    }

if __name__ == "__main__":
    settings = get_settings()
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
