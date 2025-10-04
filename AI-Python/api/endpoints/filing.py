"""
Filing API Endpoints
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from loguru import logger

from services.filing import FilingService
from models.schemas.filing_schemas import FilingRequest, FilingResponse
from core.ai_engines import AIEngineManager

router = APIRouter()

# Dependency to get AI manager (would be injected in main.py)
def get_ai_manager() -> AIEngineManager:
    # This would be injected from the main app
    # For now, we'll create a placeholder
    return None

def get_filing_service(ai_manager: AIEngineManager = Depends(get_ai_manager)) -> FilingService:
    if ai_manager is None:
        raise HTTPException(status_code=500, detail="AI service not available")
    return FilingService(ai_manager)

@router.post("/suggestions", response_model=FilingResponse)
async def get_filing_suggestions(
    request: FilingRequest,
    filing_service: FilingService = Depends(get_filing_service)
) -> FilingResponse:
    """
    Get AI-powered filing suggestions for a case
    """
    try:
        logger.info(f"Processing filing request: {request.dispute_title}")
        
        response = await filing_service.get_filing_suggestions(request)
        
        logger.info(f"Successfully generated suggestions for request: {response.request_id}")
        return response
        
    except Exception as e:
        logger.error(f"Error processing filing request: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process filing request: {str(e)}"
        )

@router.get("/health")
async def filing_health_check() -> Dict[str, Any]:
    """
    Health check for filing service
    """
    return {
        "service": "filing",
        "status": "healthy",
        "timestamp": "2024-01-01T00:00:00Z"
    }
