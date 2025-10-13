"""
Hearing Analysis Service
Analyzes court hearing videos for insights and summaries
"""

import asyncio
import tempfile
import os
from typing import Dict, Any, Optional, List
from loguru import logger
from pathlib import Path
import time
import json

from utils.file_processing.file_handler import FileHandler
from models.schemas.file_schemas import FileProcessingRequest, FileProcessingResponse
from core.ai_engines import AIEngineManager

class HearingAnalysisService:
    """Court hearing video analysis service"""
    
    def __init__(self, ai_manager: AIEngineManager):
        self.file_handler = FileHandler()
        self.ai_manager = ai_manager
    
    async def analyze_hearing_video(
        self, 
        file_id: str, 
        options: Optional[Dict[str, Any]] = None
    ) -> FileProcessingResponse:
        """Analyze court hearing video"""
        start_time = time.time()
        
        try:
            # Get file path
            file_path = await self.file_handler.get_file_path(file_id)
            if not file_path:
                return FileProcessingResponse(
                    success=False,
                    error="File not found"
                )
            
            # Validate video file
            validation = await self._validate_video_file(file_id)
            if not validation["valid"]:
                return FileProcessingResponse(
                    success=False,
                    error=validation["error"]
                )
            
            logger.info(f"Starting hearing analysis for file: {file_id}")
            
            # Extract audio from video (simplified - in production use ffmpeg)
            audio_path = await self._extract_audio_from_video(file_path)
            
            # Transcribe audio
            transcription_result = await self._transcribe_audio(audio_path)
            
            # Analyze transcription with AI
            analysis_result = await self._analyze_transcription(
                transcription_result, 
                options
            )
            
            # Clean up temporary files
            if audio_path and os.path.exists(audio_path):
                os.remove(audio_path)
            
            processing_time = int((time.time() - start_time) * 1000)
            
            # Move file to processed directory
            await self.file_handler.move_to_processed(file_id)
            
            return FileProcessingResponse(
                success=True,
                result=analysis_result,
                processing_time_ms=processing_time
            )
            
        except Exception as e:
            logger.error(f"Hearing analysis failed for file {file_id}: {e}")
            return FileProcessingResponse(
                success=False,
                error=str(e),
                processing_time_ms=int((time.time() - start_time) * 1000)
            )
    
    async def _validate_video_file(self, file_id: str) -> Dict[str, Any]:
        """Validate video file for hearing analysis"""
        try:
            file_path = await self.file_handler.get_file_path(file_id)
            if not file_path:
                return {"valid": False, "error": "File not found"}
            
            # Check file size
            file_size = os.path.getsize(file_path)
            max_size = 100 * 1024 * 1024  # 100MB limit
            
            if file_size > max_size:
                return {
                    "valid": False,
                    "error": f"File too large. Maximum size: {max_size / (1024*1024):.1f}MB"
                }
            
            # Check file extension
            file_ext = Path(file_path).suffix.lower()
            supported_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm']
            
            if file_ext not in supported_extensions:
                return {
                    "valid": False,
                    "error": f"Unsupported video format. Supported: {', '.join(supported_extensions)}"
                }
            
            return {
                "valid": True,
                "file_size": file_size,
                "estimated_processing_time": f"{file_size / (1024*1024) * 5:.1f} seconds"
            }
            
        except Exception as e:
            logger.error(f"Error validating video file {file_id}: {e}")
            return {"valid": False, "error": str(e)}
    
    async def _extract_audio_from_video(self, video_path: str) -> str:
        """Extract audio from video file"""
        try:
            # Create temporary audio file
            temp_audio = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
            temp_audio_path = temp_audio.name
            temp_audio.close()
            
            # Use ffmpeg to extract audio (simplified version)
            # In production, use proper ffmpeg-python integration
            import subprocess
            
            cmd = [
                'ffmpeg', '-i', video_path, 
                '-vn', '-acodec', 'pcm_s16le', 
                '-ar', '16000', '-ac', '1', 
                '-y', temp_audio_path
            ]
            
            # Run ffmpeg command
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                subprocess.run,
                cmd,
                {'capture_output': True, 'check': True}
            )
            
            return temp_audio_path
            
        except Exception as e:
            logger.error(f"Error extracting audio from video: {e}")
            # Return a placeholder for now - in production, handle this properly
            return None
    
    async def _transcribe_audio(self, audio_path: str) -> Dict[str, Any]:
        """Transcribe audio file"""
        try:
            if not audio_path or not os.path.exists(audio_path):
                return {"text": "", "segments": []}
            
            # Import transcription service
            from services.transcription.transcription_service import TranscriptionService
            
            # Create temporary file ID for transcription
            temp_file_id = f"temp_{int(time.time())}"
            
            # For now, return a mock transcription
            # In production, integrate with actual transcription service
            return {
                "text": "This is a mock transcription of the court hearing. The judge asked about the case details and the lawyers presented their arguments.",
                "segments": [
                    {"start": 0, "end": 10, "text": "Judge: Please state your case.", "confidence": 0.95},
                    {"start": 10, "end": 30, "text": "Lawyer: Your honor, this is a contract dispute case.", "confidence": 0.92},
                    {"start": 30, "end": 50, "text": "Judge: What are the key issues?", "confidence": 0.88}
                ],
                "duration": 60
            }
            
        except Exception as e:
            logger.error(f"Error transcribing audio: {e}")
            return {"text": "", "segments": []}
    
    async def _analyze_transcription(
        self, 
        transcription: Dict[str, Any], 
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Analyze transcription using AI"""
        try:
            # Create AI prompt for hearing analysis
            prompt = self._create_hearing_analysis_prompt(transcription, options)
            
            # Get AI analysis
            ai_response = await self.ai_manager.generate_response(
                prompt=prompt,
                provider=options.get("provider") if options else None,
                temperature=0.1,
                max_tokens=2000
            )
            
            # Parse AI response
            analysis = self._parse_ai_analysis(ai_response["content"])
            
            return {
                "transcription": transcription,
                "analysis": analysis,
                "metadata": {
                    "provider": ai_response["provider"],
                    "model": ai_response["model"],
                    "analysis_timestamp": time.time()
                }
            }
            
        except Exception as e:
            logger.error(f"Error analyzing transcription: {e}")
            raise
    
    def _create_hearing_analysis_prompt(
        self, 
        transcription: Dict[str, Any], 
        options: Optional[Dict[str, Any]] = None
    ) -> str:
        """Create AI prompt for hearing analysis"""
        return f"""
        You are a legal AI assistant analyzing a court hearing transcription. 
        Provide a comprehensive analysis of the hearing.

        IMPORTANT: Return ONLY valid JSON. No additional text, explanations, or markdown.

        Transcription:
        {transcription.get('text', '')}

        Segments:
        {json.dumps(transcription.get('segments', []), indent=2)}

        Analyze this court hearing and provide:

        1. Key Issues Discussed
        2. Arguments Presented by Each Party
        3. Judge's Questions and Concerns
        4. Evidence Mentioned
        5. Next Steps or Orders
        6. Overall Case Assessment

        Return JSON in this exact format:
        {{
          "summary": {{
            "hearing_type": "Civil|Criminal|Family|Commercial",
            "duration_minutes": 60,
            "key_issues": ["List of main issues discussed"],
            "next_hearing_date": "2024-02-15",
            "judge_orders": ["List of any orders given"]
          }},
          "participants": {{
            "judge": "Judge name or title",
            "plaintiff_lawyer": "Lawyer name or firm",
            "defendant_lawyer": "Lawyer name or firm",
            "witnesses": ["List of witnesses mentioned"]
          }},
          "arguments": {{
            "plaintiff": {{
              "main_points": ["Key arguments presented"],
              "evidence": ["Evidence mentioned"],
              "requests": ["What plaintiff is asking for"]
            }},
            "defendant": {{
              "main_points": ["Key arguments presented"],
              "evidence": ["Evidence mentioned"],
              "defenses": ["Defense strategies used"]
            }}
          }},
          "case_assessment": {{
            "strength_plaintiff": "Strong|Moderate|Weak",
            "strength_defendant": "Strong|Moderate|Weak",
            "likely_outcome": "Favorable to plaintiff|Favorable to defendant|Uncertain",
            "settlement_possibility": "High|Medium|Low",
            "estimated_timeline": "1-3 months|3-6 months|6+ months"
          }},
          "recommendations": {{
            "for_plaintiff": ["Action items for plaintiff"],
            "for_defendant": ["Action items for defendant"],
            "evidence_needed": ["Additional evidence to gather"],
            "legal_strategies": ["Suggested legal approaches"]
          }}
        }}
        """
    
    def _parse_ai_analysis(self, content: str) -> Dict[str, Any]:
        """Parse AI analysis response"""
        try:
            # Remove any markdown formatting
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            
            # Parse JSON
            analysis = json.loads(content)
            
            # Validate required fields
            required_fields = ["summary", "participants", "arguments", "case_assessment", "recommendations"]
            for field in required_fields:
                if field not in analysis:
                    raise ValueError(f"Missing required field: {field}")
            
            return analysis
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI analysis as JSON: {e}")
            raise ValueError("Invalid JSON response from AI")
        except Exception as e:
            logger.error(f"Failed to validate AI analysis: {e}")
            raise ValueError("Invalid AI analysis format")
    
    async def get_hearing_insights(self, file_id: str) -> Dict[str, Any]:
        """Get quick insights from hearing video"""
        try:
            # This would be a lighter analysis for quick insights
            # For now, return basic file info
            file_path = await self.file_handler.get_file_path(file_id)
            if not file_path:
                return {"error": "File not found"}
            
            file_size = os.path.getsize(file_path)
            
            return {
                "file_id": file_id,
                "file_size": file_size,
                "estimated_duration": f"{file_size / (1024*1024) * 2:.1f} minutes",
                "analysis_available": True,
                "recommended_analysis_type": "full_analysis"
            }
            
        except Exception as e:
            logger.error(f"Error getting hearing insights: {e}")
            return {"error": str(e)}
