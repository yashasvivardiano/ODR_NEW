"""
Pydantic schemas for filing service
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class CaseType(str, Enum):
    MEDIATION = "Mediation"
    CONCILIATION = "Conciliation"
    NEGOTIATION = "Negotiation"
    ARBITRATION = "Arbitration"

class UrgencyLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class DocumentType(str, Enum):
    CONTRACT = "Contract"
    INVOICE = "Invoice"
    EMAIL_COMMUNICATION = "Email_Communication"
    LEGAL_NOTICE = "Legal_Notice"
    FINANCIAL_STATEMENT = "Financial_Statement"
    IDENTITY_PROOF = "Identity_Proof"
    EVIDENCE_PHOTO = "Evidence_Photo"
    OTHER = "Other"

class DocumentPriority(str, Enum):
    REQUIRED = "Required"
    RECOMMENDED = "Recommended"
    OPTIONAL = "Optional"

class PartyRole(str, Enum):
    COMPLAINANT = "Complainant"
    RESPONDENT = "Respondent"

class PartyType(str, Enum):
    INDIVIDUAL = "Individual"
    ORGANIZATION = "Organization"

class Party(BaseModel):
    name: str = Field(..., description="Name of the party")
    role: PartyRole = Field(..., description="Role in the dispute")
    type: PartyType = Field(..., description="Type of party")

class UploadedDocument(BaseModel):
    filename: str = Field(..., description="Name of the uploaded file")
    type: str = Field(..., description="MIME type of the file")
    size: int = Field(..., description="Size of the file in bytes")

class FilingRequest(BaseModel):
    """Request for filing assistance"""
    dispute_title: Optional[str] = Field(None, description="Title of the dispute")
    dispute_description: str = Field(..., description="Detailed description of the dispute")
    case_type: Optional[CaseType] = Field(None, description="Preferred case type")
    parties: List[Party] = Field(default_factory=list, description="Parties involved")
    uploaded_documents: List[UploadedDocument] = Field(default_factory=list, description="Uploaded documents")
    estimated_amount: Optional[float] = Field(None, description="Estimated amount in dispute")
    jurisdiction: Optional[str] = Field(None, description="Jurisdiction for the case")
    preferred_provider: Optional[str] = Field(None, description="Preferred AI provider")

class CaseTypeSuggestion(BaseModel):
    recommended: CaseType = Field(..., description="Recommended case type")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score")
    rationale: str = Field(..., description="Explanation for recommendation")
    alternatives: Optional[List[Dict[str, Any]]] = Field(None, description="Alternative options")

class DocumentSuggestion(BaseModel):
    type: DocumentType = Field(..., description="Type of document")
    description: str = Field(..., description="Description of the document")
    priority: DocumentPriority = Field(..., description="Priority level")
    reason: str = Field(..., description="Reason why this document is needed")

class FieldHints(BaseModel):
    title: Optional[str] = Field(None, description="Suggested title")
    jurisdiction: Optional[str] = Field(None, description="Suggested jurisdiction")
    estimated_timeline: Optional[str] = Field(None, description="Estimated resolution timeline")
    suggested_amount: Optional[float] = Field(None, description="Suggested amount")

class UrgencyAssessment(BaseModel):
    level: UrgencyLevel = Field(..., description="Urgency level")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score")
    factors: List[str] = Field(..., description="Factors determining urgency")

class FilingSuggestions(BaseModel):
    case_type: CaseTypeSuggestion = Field(..., description="Case type suggestions")
    required_documents: List[DocumentSuggestion] = Field(..., description="Document suggestions")
    field_hints: FieldHints = Field(..., description="Field improvement hints")
    urgency: UrgencyAssessment = Field(..., description="Urgency assessment")

class FilingResponse(BaseModel):
    """Response from filing assistance"""
    request_id: str = Field(..., description="Unique request identifier")
    suggestions: FilingSuggestions = Field(..., description="AI-generated suggestions")
    metadata: Dict[str, Any] = Field(..., description="Response metadata")
