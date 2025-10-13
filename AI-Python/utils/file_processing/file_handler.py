"""
File Upload and Processing Handler
Handles file uploads, validation, and storage
"""

import os
import uuid
import aiofiles
from typing import Dict, Any, Optional, List
from pathlib import Path
from loguru import logger
import magic
from config.settings import get_settings

class FileHandler:
    """Handles file uploads and processing"""
    
    def __init__(self):
        self.settings = get_settings()
        self.allowed_extensions = {
            'audio': ['.mp3', '.wav', '.m4a', '.flac', '.ogg'],
            'video': ['.mp4', '.avi', '.mov', '.mkv', '.webm'],
            'document': ['.pdf', '.doc', '.docx', '.txt', '.rtf']
        }
        self.max_file_size = self.settings.MAX_FILE_SIZE
        
        # Create directories if they don't exist
        self.upload_dir = Path(self.settings.UPLOAD_DIR)
        self.processed_dir = Path(self.settings.PROCESSED_DIR)
        self.upload_dir.mkdir(exist_ok=True)
        self.processed_dir.mkdir(exist_ok=True)
    
    async def save_uploaded_file(
        self, 
        file_content: bytes, 
        filename: str,
        file_type: str = "document"
    ) -> Dict[str, Any]:
        """Save uploaded file and return metadata"""
        try:
            # Generate unique filename
            file_id = str(uuid.uuid4())
            file_extension = Path(filename).suffix.lower()
            unique_filename = f"{file_id}{file_extension}"
            
            # Validate file
            validation_result = self._validate_file(file_content, file_extension, file_type)
            if not validation_result["valid"]:
                raise ValueError(validation_result["error"])
            
            # Save file
            file_path = self.upload_dir / unique_filename
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(file_content)
            
            # Get file metadata
            file_size = len(file_content)
            mime_type = magic.from_buffer(file_content, mime=True)
            
            return {
                "file_id": file_id,
                "original_filename": filename,
                "stored_filename": unique_filename,
                "file_path": str(file_path),
                "file_size": file_size,
                "mime_type": mime_type,
                "file_type": file_type,
                "status": "uploaded"
            }
            
        except Exception as e:
            logger.error(f"Error saving file {filename}: {e}")
            raise
    
    def _validate_file(self, file_content: bytes, extension: str, file_type: str) -> Dict[str, Any]:
        """Validate uploaded file"""
        # Check file size
        if len(file_content) > self.max_file_size:
            return {
                "valid": False,
                "error": f"File too large. Maximum size: {self.max_file_size / (1024*1024):.1f}MB"
            }
        
        # Check file extension
        allowed_exts = self.allowed_extensions.get(file_type, [])
        if extension not in allowed_exts:
            return {
                "valid": False,
                "error": f"Invalid file type. Allowed extensions for {file_type}: {', '.join(allowed_exts)}"
            }
        
        # Check MIME type
        try:
            mime_type = magic.from_buffer(file_content, mime=True)
            expected_mimes = self._get_expected_mimes(file_type)
            
            if not any(mime_type.startswith(expected) for expected in expected_mimes):
                return {
                    "valid": False,
                    "error": f"Invalid MIME type: {mime_type}"
                }
        except Exception as e:
            logger.warning(f"Could not detect MIME type: {e}")
        
        return {"valid": True}
    
    def _get_expected_mimes(self, file_type: str) -> List[str]:
        """Get expected MIME types for file type"""
        mime_map = {
            'audio': ['audio/'],
            'video': ['video/'],
            'document': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats', 'text/']
        }
        return mime_map.get(file_type, [])
    
    async def get_file_path(self, file_id: str) -> Optional[str]:
        """Get file path by ID"""
        file_path = self.upload_dir / f"{file_id}*"
        matches = list(self.upload_dir.glob(f"{file_id}*"))
        return str(matches[0]) if matches else None
    
    async def move_to_processed(self, file_id: str) -> Optional[str]:
        """Move file to processed directory"""
        try:
            source_path = await self.get_file_path(file_id)
            if not source_path:
                return None
            
            source = Path(source_path)
            destination = self.processed_dir / source.name
            
            # Move file
            source.rename(destination)
            
            logger.info(f"Moved file {file_id} to processed directory")
            return str(destination)
            
        except Exception as e:
            logger.error(f"Error moving file {file_id}: {e}")
            return None
    
    async def delete_file(self, file_id: str) -> bool:
        """Delete file by ID"""
        try:
            file_path = await self.get_file_path(file_id)
            if file_path and os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Deleted file {file_id}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting file {file_id}: {e}")
            return False
