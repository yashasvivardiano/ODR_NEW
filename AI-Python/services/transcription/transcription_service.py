"""
Transcription Service
Handles audio-to-text conversion using OpenAI Whisper
"""

import whisper
import asyncio
import tempfile
import os
from typing import Dict, Any, Optional
from loguru import logger
from pathlib import Path
import time

from utils.file_processing.file_handler import FileHandler
from models.schemas.file_schemas import FileProcessingRequest, FileProcessingResponse

class TranscriptionService:
    """Audio transcription service using OpenAI Whisper"""
    
    def __init__(self):
        self.file_handler = FileHandler()
        self.model = None
        self._model_loaded = False
    
    async def _load_model(self, model_size: str = "base"):
        """Load Whisper model (lazy loading)"""
        if not self._model_loaded:
            try:
                logger.info(f"Loading Whisper model: {model_size}")
                # Run model loading in thread pool to avoid blocking
                loop = asyncio.get_event_loop()
                self.model = await loop.run_in_executor(
                    None, 
                    whisper.load_model, 
                    model_size
                )
                self._model_loaded = True
                logger.info("Whisper model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load Whisper model: {e}")
                raise
    
    async def transcribe_audio(
        self, 
        file_id: str, 
        options: Optional[Dict[str, Any]] = None
    ) -> FileProcessingResponse:
        """Transcribe audio file to text"""
        start_time = time.time()
        
        try:
            # Get file path
            file_path = await self.file_handler.get_file_path(file_id)
            if not file_path:
                return FileProcessingResponse(
                    success=False,
                    error="File not found"
                )
            
            # Load model if needed
            model_size = options.get("model_size", "base") if options else "base"
            await self._load_model(model_size)
            
            # Transcribe audio
            logger.info(f"Starting transcription for file: {file_id}")
            
            # Run transcription in thread pool
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                self._transcribe_file,
                file_path,
                options
            )
            
            processing_time = int((time.time() - start_time) * 1000)
            
            # Move file to processed directory
            await self.file_handler.move_to_processed(file_id)
            
            return FileProcessingResponse(
                success=True,
                result=result,
                processing_time_ms=processing_time
            )
            
        except Exception as e:
            logger.error(f"Transcription failed for file {file_id}: {e}")
            return FileProcessingResponse(
                success=False,
                error=str(e),
                processing_time_ms=int((time.time() - start_time) * 1000)
            )
    
    def _transcribe_file(self, file_path: str, options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Transcribe file using Whisper"""
        try:
            # Set transcription options
            transcribe_options = {
                "language": options.get("language", "en") if options else "en",
                "task": options.get("task", "transcribe") if options else "transcribe",
                "fp16": False,  # Use fp32 for better compatibility
            }
            
            # Transcribe
            result = self.model.transcribe(file_path, **transcribe_options)
            
            # Process result
            segments = []
            for segment in result.get("segments", []):
                segments.append({
                    "start": segment.get("start", 0),
                    "end": segment.get("end", 0),
                    "text": segment.get("text", "").strip(),
                    "confidence": segment.get("avg_logprob", 0)
                })
            
            return {
                "text": result.get("text", "").strip(),
                "language": result.get("language", "unknown"),
                "duration": result.get("duration", 0),
                "segments": segments,
                "full_result": result
            }
            
        except Exception as e:
            logger.error(f"Whisper transcription error: {e}")
            raise
    
    async def transcribe_with_timestamps(
        self, 
        file_id: str, 
        options: Optional[Dict[str, Any]] = None
    ) -> FileProcessingResponse:
        """Transcribe audio with detailed timestamps"""
        # Add timestamp option
        if options is None:
            options = {}
        options["include_timestamps"] = True
        
        return await self.transcribe_audio(file_id, options)
    
    async def get_supported_languages(self) -> Dict[str, Any]:
        """Get list of supported languages"""
        return {
            "supported_languages": [
                "en", "es", "fr", "de", "it", "pt", "ru", "ja", "ko", "zh",
                "hi", "ar", "tr", "pl", "nl", "sv", "da", "no", "fi", "el",
                "he", "th", "vi", "id", "ms", "tl", "sw", "af", "sq", "am",
                "az", "ba", "eu", "be", "bn", "bs", "br", "bg", "ca", "cs",
                "cy", "et", "fa", "gl", "gu", "ht", "ha", "haw", "iw", "is",
                "ga", "jv", "kn", "kk", "km", "rw", "ky", "lo", "la", "lv",
                "ln", "lt", "lb", "mk", "mg", "ml", "mt", "mi", "mr", "mn",
                "my", "ne", "nn", "oc", "ps", "pa", "ro", "sa", "sr", "sn",
                "sd", "si", "sk", "sl", "so", "su", "tg", "ta", "tt", "te",
                "uk", "ur", "uz", "yi", "yo", "zu"
            ],
            "default_language": "en",
            "auto_detect": True
        }
    
    async def validate_audio_file(self, file_id: str) -> Dict[str, Any]:
        """Validate if file is suitable for transcription"""
        try:
            file_path = await self.file_handler.get_file_path(file_id)
            if not file_path:
                return {"valid": False, "error": "File not found"}
            
            # Check file size (Whisper has practical limits)
            file_size = os.path.getsize(file_path)
            max_size = 25 * 1024 * 1024  # 25MB limit for Whisper
            
            if file_size > max_size:
                return {
                    "valid": False, 
                    "error": f"File too large. Maximum size: {max_size / (1024*1024):.1f}MB"
                }
            
            # Check file extension
            file_ext = Path(file_path).suffix.lower()
            supported_extensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.mp4', '.avi', '.mov']
            
            if file_ext not in supported_extensions:
                return {
                    "valid": False,
                    "error": f"Unsupported file format. Supported: {', '.join(supported_extensions)}"
                }
            
            return {
                "valid": True,
                "file_size": file_size,
                "estimated_processing_time": f"{file_size / (1024*1024) * 2:.1f} seconds"
            }
            
        except Exception as e:
            logger.error(f"Error validating audio file {file_id}: {e}")
            return {"valid": False, "error": str(e)}
