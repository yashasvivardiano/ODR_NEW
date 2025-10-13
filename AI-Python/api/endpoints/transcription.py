"""
Transcription API Endpoints
"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from typing import Dict, Any, Optional
from loguru import logger
import time

from services.transcription.transcription_service import TranscriptionService
from models.schemas.file_schemas import FileUploadResponse, FileProcessingResponse
from utils.file_processing.file_handler import FileHandler

router = APIRouter()

# Global services (would be injected in production)
transcription_service = TranscriptionService()
file_handler = FileHandler()

@router.post("/upload", response_model=FileUploadResponse)
async def upload_audio_file(
    file: UploadFile = File(...),
    file_type: str = Form(default="audio")
) -> FileUploadResponse:
    """
    Upload audio file for transcription
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
        
        logger.info(f"Audio file uploaded: {file_metadata['file_id']}")
        
        return FileUploadResponse(
            success=True,
            file_metadata=file_metadata
        )
        
    except Exception as e:
        logger.error(f"Error uploading audio file: {e}")
        return FileUploadResponse(
            success=False,
            error=str(e)
        )

@router.post("/transcribe/{file_id}", response_model=FileProcessingResponse)
async def transcribe_audio_file(
    file_id: str,
    language: Optional[str] = Form(default="en"),
    model_size: Optional[str] = Form(default="base"),
    include_timestamps: Optional[bool] = Form(default=False)
) -> FileProcessingResponse:
    """
    Transcribe uploaded audio file
    """
    try:
        # Validate file first
        validation = await transcription_service.validate_audio_file(file_id)
        if not validation["valid"]:
            return FileProcessingResponse(
                success=False,
                error=validation["error"]
            )
        
        # Set options
        options = {
            "language": language,
            "model_size": model_size,
            "include_timestamps": include_timestamps
        }
        
        # Transcribe audio
        if include_timestamps:
            result = await transcription_service.transcribe_with_timestamps(file_id, options)
        else:
            result = await transcription_service.transcribe_audio(file_id, options)
        
        logger.info(f"Transcription completed for file: {file_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error transcribing audio file {file_id}: {e}")
        return FileProcessingResponse(
            success=False,
            error=str(e)
        )

@router.get("/languages")
async def get_supported_languages() -> Dict[str, Any]:
    """
    Get list of supported languages for transcription
    """
    try:
        languages = await transcription_service.get_supported_languages()
        return languages
    except Exception as e:
        logger.error(f"Error getting supported languages: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/validate/{file_id}")
async def validate_audio_file(file_id: str) -> Dict[str, Any]:
    """
    Validate if audio file is suitable for transcription
    """
    try:
        validation = await transcription_service.validate_audio_file(file_id)
        return validation
    except Exception as e:
        logger.error(f"Error validating audio file {file_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/file/{file_id}")
async def delete_audio_file(file_id: str) -> Dict[str, Any]:
    """
    Delete uploaded audio file
    """
    try:
        success = await file_handler.delete_file(file_id)
        if success:
            return {"success": True, "message": "File deleted successfully"}
        else:
            return {"success": False, "message": "File not found or already deleted"}
    except Exception as e:
        logger.error(f"Error deleting audio file {file_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def transcription_health_check() -> Dict[str, Any]:
    """
    Health check for transcription service
    """
    return {
        "service": "transcription",
        "status": "healthy",
        "features": {
            "whisper_model": "loaded",
            "supported_formats": ["mp3", "wav", "m4a", "flac", "ogg"],
            "max_file_size": "25MB",
            "languages": "100+ supported"
        },
        "timestamp": "2024-01-01T00:00:00Z"
    }
