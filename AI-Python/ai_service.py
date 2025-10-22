#!/usr/bin/env python3
"""
ODR AI Service - Single File Implementation
Features:
1. Gemini API for inference
2. Transcript formatting
3. API endpoint for backend team
"""

import os
import json
import asyncio
import uvicorn
from datetime import datetime
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from loguru import logger

# =============================================================================
# CONFIGURATION
# =============================================================================

# Load environment variables
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyCrvuz2DjR4bS-Uy14deDoXIuzSJMM1m1Q')
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 8000))
DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

# =============================================================================
# DATA MODELS
# =============================================================================

class FilingRequest(BaseModel):
    """Request model for filing assistance"""
    dispute_title: str
    dispute_description: str
    case_type: Optional[str] = None
    parties: List[Dict[str, str]] = []
    estimated_amount: Optional[float] = None
    jurisdiction: Optional[str] = None
    preferred_provider: str = "gemini"

class TranscriptRequest(BaseModel):
    """Request model for transcript formatting"""
    raw_text: str
    format_type: str = "structured"  # structured, summary, key_points
    language: str = "en"

class FilingResponse(BaseModel):
    """Response model for filing suggestions"""
    request_id: str
    suggestions: Dict[str, Any]
    metadata: Dict[str, Any]

class TranscriptResponse(BaseModel):
    """Response model for transcript formatting"""
    request_id: str
    formatted_transcript: Dict[str, Any]
    metadata: Dict[str, Any]

# =============================================================================
# AI SERVICE CLASS
# =============================================================================

class ODRAIService:
    """Main AI service class"""
    
    def __init__(self):
        self.model = model
        logger.info("ODR AI Service initialized with Gemini")
    
    async def get_filing_suggestions(self, request: FilingRequest) -> FilingResponse:
        """Get AI-powered filing suggestions"""
        try:
            # Create prompt for Gemini
            prompt = self._create_filing_prompt(request)
            
            # Get AI response
            response = self.model.generate_content(prompt)
            
            # Parse and structure response
            suggestions = self._parse_filing_response(response.text)
            
            return FilingResponse(
                request_id=f"filing_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                suggestions=suggestions,
                metadata={
                    "provider": "gemini",
                    "model": "gemini-2.0-flash",
                    "timestamp": datetime.now().isoformat(),
                    "processing_time_ms": 0
                }
            )
            
        except Exception as e:
            logger.error(f"Filing suggestions error: {e}")
            raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
    
    async def format_transcript(self, request: TranscriptRequest) -> TranscriptResponse:
        """Format transcript using AI"""
        try:
            # Create prompt for transcript formatting
            prompt = self._create_transcript_prompt(request)
            
            # Get AI response
            response = self.model.generate_content(prompt)
            
            # Parse and structure response
            formatted_transcript = self._parse_transcript_response(response.text, request.format_type)
            
            return TranscriptResponse(
                request_id=f"transcript_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                formatted_transcript=formatted_transcript,
                metadata={
                    "provider": "gemini",
                    "model": "gemini-2.0-flash",
                    "format_type": request.format_type,
                    "language": request.language,
                    "timestamp": datetime.now().isoformat()
                }
            )
            
        except Exception as e:
            logger.error(f"Transcript formatting error: {e}")
            raise HTTPException(status_code=500, detail=f"Transcript processing failed: {str(e)}")
    
    def _create_filing_prompt(self, request: FilingRequest) -> str:
        """Create prompt for filing suggestions"""
        return f"""
You are a legal AI assistant for an Online Dispute Resolution platform in India.
Analyze this dispute and provide structured suggestions.

IMPORTANT: Return ONLY valid JSON. No additional text, explanations, or markdown.

Dispute Information:
- Title: {request.dispute_title}
- Description: {request.dispute_description}
- Case Type: {request.case_type or 'Not specified'}
- Parties: {json.dumps(request.parties)}
- Amount: {request.estimated_amount or 'Not specified'}
- Jurisdiction: {request.jurisdiction or 'Not specified'}

Provide suggestions in this exact JSON format:
{{
  "case_type": {{
    "recommended": "Mediation|Conciliation|Negotiation|Arbitration",
    "confidence": 0.85,
    "rationale": "Clear explanation for recommendation",
    "alternatives": [
      {{"type": "Arbitration", "confidence": 0.65, "reason": "Alternative reasoning"}}
    ]
  }},
  "required_documents": [
    {{
      "type": "Contract|Invoice|Email_Communication|Legal_Notice|Financial_Statement|Identity_Proof|Evidence_Photo|Other",
      "description": "Clear description of document needed",
      "priority": "Required|Recommended|Optional",
      "reason": "Why this document is important"
    }}
  ],
  "field_hints": {{
    "title": "Suggested improved title",
    "jurisdiction": "Suggested jurisdiction",
    "estimated_timeline": "Expected resolution timeframe",
    "suggested_amount": {request.estimated_amount or 0}
  }},
  "urgency": {{
    "level": "Low|Medium|High",
    "confidence": 0.75,
    "factors": ["List of factors determining urgency"]
  }}
}}
"""
    
    def _create_transcript_prompt(self, request: TranscriptRequest) -> str:
        """Create prompt for transcript formatting"""
        format_instructions = {
            "structured": "Format as structured transcript with timestamps, speakers, and content",
            "summary": "Create a concise summary of the key points",
            "key_points": "Extract and list the main key points"
        }
        
        return f"""
You are a legal AI assistant processing court hearing transcripts.
Format this transcript according to the requested format.

IMPORTANT: Return ONLY valid JSON. No additional text, explanations, or markdown.

Format Type: {request.format_type}
Language: {request.language}
Instructions: {format_instructions.get(request.format_type, 'Format as requested')}

Raw Transcript:
{request.raw_text}

Return JSON in this format:
{{
  "format_type": "{request.format_type}",
  "language": "{request.language}",
  "content": {{
    "structured": [
      {{"timestamp": "00:00:00", "speaker": "Judge", "content": "Please state your case"}},
      {{"timestamp": "00:00:05", "speaker": "Lawyer", "content": "Your honor, this is a contract dispute"}}
    ],
    "summary": "Brief summary of the hearing",
    "key_points": [
      "Key point 1",
      "Key point 2",
      "Key point 3"
    ]
  }},
  "metadata": {{
    "total_duration": "estimated duration",
    "speakers": ["List of identified speakers"],
    "word_count": 0,
    "confidence": 0.85
  }}
}}
"""
    
    def _parse_filing_response(self, content: str) -> Dict[str, Any]:
        """Parse AI response for filing suggestions"""
        try:
            # Clean the response
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            
            # Parse JSON
            return json.loads(content)
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse filing response: {e}")
            # Return default structure if parsing fails
            return {
                "case_type": {
                    "recommended": "Mediation",
                    "confidence": 0.5,
                    "rationale": "Default recommendation due to parsing error"
                },
                "required_documents": [],
                "field_hints": {},
                "urgency": {
                    "level": "Medium",
                    "confidence": 0.5,
                    "factors": ["Unable to analyze"]
                }
            }
    
    def _parse_transcript_response(self, content: str, format_type: str) -> Dict[str, Any]:
        """Parse AI response for transcript formatting"""
        try:
            # Clean the response
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            
            # Parse JSON
            parsed = json.loads(content)
            
            # Ensure the response has the expected structure
            if "content" not in parsed:
                parsed["content"] = {}
            
            return parsed
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse transcript response: {e}")
            # Return default structure if parsing fails
            return {
                "format_type": format_type,
                "language": "en",
                "content": {
                    "structured": [],
                    "summary": "Unable to process transcript",
                    "key_points": ["Processing error occurred"]
                },
                "metadata": {
                    "total_duration": "unknown",
                    "speakers": [],
                    "word_count": 0,
                    "confidence": 0.0
                }
            }

# =============================================================================
# FASTAPI APPLICATION
# =============================================================================

# Create FastAPI app
app = FastAPI(
    title="ODR AI Service",
    description="AI-powered Online Dispute Resolution Service",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI service
ai_service = ODRAIService()

# =============================================================================
# API ENDPOINTS
# =============================================================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "ODR AI Service is running",
        "version": "1.0.0",
        "provider": "Gemini",
        "endpoints": {
            "filing": "/api/filing/suggestions",
            "transcript": "/api/transcript/format",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Gemini connection
        test_response = model.generate_content("test")
        gemini_status = "healthy" if test_response else "unhealthy"
    except Exception as e:
        gemini_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "gemini": gemini_status,
            "api": "healthy"
        }
    }

@app.post("/api/filing/suggestions", response_model=FilingResponse)
async def get_filing_suggestions(request: FilingRequest):
    """Get AI-powered filing suggestions"""
    logger.info(f"Processing filing request: {request.dispute_title}")
    return await ai_service.get_filing_suggestions(request)

@app.post("/api/transcript/format", response_model=TranscriptResponse)
async def format_transcript(request: TranscriptRequest):
    """Format transcript using AI"""
    logger.info(f"Processing transcript request: {request.format_type}")
    return await ai_service.format_transcript(request)

@app.post("/api/transcript/upload")
async def upload_and_format_transcript(
    file: UploadFile = File(...),
    format_type: str = Form(default="structured")
):
    """Upload file and format transcript"""
    try:
        # Read file content
        content = await file.read()
        raw_text = content.decode('utf-8')
        
        # Create transcript request
        request = TranscriptRequest(
            raw_text=raw_text,
            format_type=format_type,
            language="en"
        )
        
        # Process transcript
        result = await ai_service.format_transcript(request)
        
        return {
            "success": True,
            "filename": file.filename,
            "result": result
        }
        
    except Exception as e:
        logger.error(f"File upload error: {e}")
        raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")

# =============================================================================
# MAIN FUNCTION
# =============================================================================

def main():
    """Main function to run the server"""
    logger.info(f"Starting ODR AI Service on {HOST}:{PORT}")
    logger.info(f"Gemini API Key: {GEMINI_API_KEY[:20]}...")
    logger.info("Available endpoints:")
    logger.info("  POST /api/filing/suggestions - Get filing suggestions")
    logger.info("  POST /api/transcript/format - Format transcript")
    logger.info("  POST /api/transcript/upload - Upload and format file")
    logger.info("  GET /health - Health check")
    
    uvicorn.run(
        "ai_service:app",
        host=HOST,
        port=PORT,
        reload=DEBUG,
        log_level="info"
    )

if __name__ == "__main__":
    main()
