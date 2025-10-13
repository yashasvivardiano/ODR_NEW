"""
Hearing API Endpoints
"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from typing import Dict, Any, Optional
from loguru import logger

from services.hearing.hearing_analysis_service import HearingAnalysisService
from models.schemas.file_schemas import FileUploadResponse, FileProcessingResponse
from utils.file_processing.file_handler import FileHandler
from core.ai_engines import AIEngineManager

router = APIRouter()

# Global services (would be injected in production)
file_handler = FileHandler()
ai_manager = None  # Will be injected from main.py

def get_hearing_service() -> HearingAnalysisService:
    """Get hearing analysis service with AI manager"""
    if ai_manager is None:
        raise HTTPException(status_code=500, detail="AI service not available")
    return HearingAnalysisService(ai_manager)

@router.post("/upload", response_model=FileUploadResponse)
async def upload_hearing_video(
    file: UploadFile = File(...),
    file_type: str = Form(default="video")
) -> FileUploadResponse:
    """
    Upload court hearing video for analysis
    """
    try:
        # Read file content
        file_content = await file.read()
        
        # Save file
        file_metadata = await file_handler.save_uploaded_file(
            file_content=file_content,
            filename=file.filename,
            file_type=file_type
        )
        
        logger.info(f"Hearing video uploaded: {file_metadata['file_id']}")
        
        return FileUploadResponse(
            success=True,
            file_metadata=file_metadata
        )
        
    except Exception as e:
        logger.error(f"Error uploading hearing video: {e}")
        return FileUploadResponse(
            success=False,
            error=str(e)
        )

@router.post("/analyze/{file_id}", response_model=FileProcessingResponse)
async def analyze_hearing_video(
    file_id: str,
    analysis_type: Optional[str] = Form(default="full"),
    provider: Optional[str] = Form(default=None)
) -> FileProcessingResponse:
    """
    Analyze court hearing video
    """
    try:
        hearing_service = get_hearing_service()
        
        # Set options
        options = {
            "analysis_type": analysis_type,
            "provider": provider
        }
        
        # Analyze video
        result = await hearing_service.analyze_hearing_video(file_id, options)
        
        logger.info(f"Hearing analysis completed for file: {file_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error analyzing hearing video {file_id}: {e}")
        return FileProcessingResponse(
            success=False,
            error=str(e)
        )

@router.get("/insights/{file_id}")
async def get_hearing_insights(file_id: str) -> Dict[str, Any]:
    """
    Get quick insights from hearing video
    """
    try:
        hearing_service = get_hearing_service()
        insights = await hearing_service.get_hearing_insights(file_id)
        return insights
    except Exception as e:
        logger.error(f"Error getting hearing insights for {file_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/validate/{file_id}")
async def validate_hearing_video(file_id: str) -> Dict[str, Any]:
    """
    Validate if video file is suitable for hearing analysis
    """
    try:
        hearing_service = get_hearing_service()
        validation = await hearing_service._validate_video_file(file_id)
        return validation
    except Exception as e:
        logger.error(f"Error validating hearing video {file_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/file/{file_id}")
async def delete_hearing_video(file_id: str) -> Dict[str, Any]:
    """
    Delete uploaded hearing video
    """
    try:
        success = await file_handler.delete_file(file_id)
        if success:
            return {"success": True, "message": "File deleted successfully"}
        else:
            return {"success": False, "message": "File not found or already deleted"}
    except Exception as e:
        logger.error(f"Error deleting hearing video {file_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def hearing_health_check() -> Dict[str, Any]:
    """
    Health check for hearing service
    """
    return {
        "service": "hearing",
        "status": "healthy",
        "features": {
            "video_analysis": "available",
            "audio_extraction": "available",
            "ai_analysis": "available",
            "supported_formats": ["mp4", "avi", "mov", "mkv", "webm"],
            "max_file_size": "100MB",
            "analysis_types": ["full", "quick", "summary"]
        },
        "timestamp": "2024-01-01T00:00:00Z"
    }
