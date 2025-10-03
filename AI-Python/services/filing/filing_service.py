"""
Filing Service
Handles AI-powered case filing assistance
"""

from typing import Dict, Any, Optional
from loguru import logger
import json
import uuid
from datetime import datetime

from core.ai_engines import AIEngineManager
from models.schemas.filing_schemas import FilingRequest, FilingResponse
from utils.security.pii_redaction import PIIRedactor

class FilingService:
    """AI-powered filing assistance service"""
    
    def __init__(self, ai_manager: AIEngineManager):
        self.ai_manager = ai_manager
        self.pii_redactor = PIIRedactor()
    
    async def get_filing_suggestions(self, request: FilingRequest) -> FilingResponse:
        """Get AI suggestions for case filing"""
        try:
            # Redact PII from input
            safe_input = self._prepare_safe_input(request)
            
            # Create AI prompt
            prompt = self._create_filing_prompt(safe_input)
            
            # Get AI response
            ai_response = await self.ai_manager.generate_response(
                prompt=prompt,
                provider=request.preferred_provider,
                temperature=0.1,
                max_tokens=1500
            )
            
            # Parse and validate response
            suggestions = self._parse_ai_response(ai_response["content"])
            
            # Create response
            response = FilingResponse(
                request_id=str(uuid.uuid4()),
                suggestions=suggestions,
                metadata={
                    "provider": ai_response["provider"],
                    "model": ai_response["model"],
                    "timestamp": datetime.utcnow().isoformat(),
                    "processing_time_ms": 0  # Will be calculated
                }
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Filing service error: {e}")
            raise
    
    def _prepare_safe_input(self, request: FilingRequest) -> Dict[str, Any]:
        """Prepare safe input by redacting PII"""
        # Redact PII from description
        redacted_description = self.pii_redactor.redact_text(
            request.dispute_description,
            preserve_amounts=True
        )
        
        return {
            "title": request.dispute_title,
            "description": redacted_description,
            "case_type": request.case_type,
            "parties": [
                {
                    "role": party.role,
                    "type": party.type
                    # Names are redacted for privacy
                }
                for party in request.parties
            ],
            "estimated_amount": request.estimated_amount,
            "jurisdiction": request.jurisdiction,
            "uploaded_documents": [
                {
                    "filename": doc.filename,
                    "type": doc.type,
                    "size": doc.size
                }
                for doc in request.uploaded_documents
            ]
        }
    
    def _create_filing_prompt(self, safe_input: Dict[str, Any]) -> str:
        """Create AI prompt for filing assistance"""
        return f"""
        You are a legal intake assistant for an Online Dispute Resolution (ODR) platform in India.
        Your task is to analyze dispute information and provide structured suggestions for case filing.

        IMPORTANT: Return ONLY valid JSON. No additional text, explanations, or markdown.

        Given the dispute information, provide suggestions for:
        1. Most appropriate case type (Mediation, Conciliation, Negotiation, or Arbitration)
        2. Required and recommended documents
        3. Field hints and improvements
        4. Urgency assessment

        Input: {json.dumps(safe_input, indent=2)}

        Return JSON in this exact format:
        {{
          "suggestions": {{
            "caseType": {{
              "recommended": "Mediation|Conciliation|Negotiation|Arbitration",
              "confidence": 0.85,
              "rationale": "Clear explanation for recommendation",
              "alternatives": [
                {{"type": "Arbitration", "confidence": 0.65, "reason": "Alternative reasoning"}}
              ]
            }},
            "requiredDocuments": [
              {{
                "type": "Contract|Invoice|Email_Communication|Legal_Notice|Financial_Statement|Identity_Proof|Evidence_Photo|Other",
                "description": "Clear description of document needed",
                "priority": "Required|Recommended|Optional",
                "reason": "Why this document is important"
              }}
            ],
            "fieldHints": {{
              "title": "Suggested improved title",
              "jurisdiction": "Suggested jurisdiction",
              "estimatedTimeline": "Expected resolution timeframe",
              "suggestedAmount": 50000
            }},
            "urgency": {{
              "level": "Low|Medium|High",
              "confidence": 0.75,
              "factors": ["List of factors determining urgency"]
            }}
          }}
        }}
        """
    
    def _parse_ai_response(self, content: str) -> Dict[str, Any]:
        """Parse and validate AI response"""
        try:
            # Remove any markdown formatting
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            
            # Parse JSON
            response = json.loads(content)
            
            # Validate required fields
            if "suggestions" not in response:
                raise ValueError("Missing 'suggestions' field in AI response")
            
            suggestions = response["suggestions"]
            
            # Validate case type
            valid_case_types = ["Mediation", "Conciliation", "Negotiation", "Arbitration"]
            if suggestions.get("caseType", {}).get("recommended") not in valid_case_types:
                raise ValueError("Invalid case type in AI response")
            
            return suggestions
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {e}")
            raise ValueError("Invalid JSON response from AI")
        except Exception as e:
            logger.error(f"Failed to validate AI response: {e}")
            raise ValueError("Invalid AI response format")
