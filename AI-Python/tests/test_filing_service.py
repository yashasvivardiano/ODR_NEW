"""
Tests for Filing Service
"""

import pytest
from unittest.mock import AsyncMock, MagicMock
from services.filing import FilingService
from models.schemas.filing_schemas import FilingRequest, Party, PartyRole, PartyType

@pytest.fixture
def mock_ai_manager():
    """Mock AI manager for testing"""
    manager = AsyncMock()
    manager.generate_response = AsyncMock(return_value={
        "content": '{"suggestions": {"caseType": {"recommended": "Mediation", "confidence": 0.85, "rationale": "Test rationale"}, "requiredDocuments": [], "fieldHints": {}, "urgency": {"level": "Medium", "confidence": 0.75, "factors": []}}}',
        "provider": "openai",
        "model": "gpt-4o-mini"
    })
    return manager

@pytest.fixture
def filing_service(mock_ai_manager):
    """Filing service instance for testing"""
    return FilingService(mock_ai_manager)

@pytest.fixture
def sample_request():
    """Sample filing request for testing"""
    return FilingRequest(
        dispute_title="Test Dispute",
        dispute_description="This is a test dispute description",
        parties=[
            Party(name="John Doe", role=PartyRole.COMPLAINANT, type=PartyType.INDIVIDUAL),
            Party(name="Jane Smith", role=PartyRole.RESPONDENT, type=PartyType.INDIVIDUAL)
        ],
        estimated_amount=50000.0,
        jurisdiction="Mumbai"
    )

@pytest.mark.asyncio
async def test_get_filing_suggestions(filing_service, sample_request):
    """Test getting filing suggestions"""
    response = await filing_service.get_filing_suggestions(sample_request)
    
    assert response.request_id is not None
    assert response.suggestions is not None
    assert response.suggestions.case_type.recommended == "Mediation"
    assert response.suggestions.case_type.confidence == 0.85

@pytest.mark.asyncio
async def test_pii_redaction(filing_service, sample_request):
    """Test PII redaction in input preparation"""
    safe_input = filing_service._prepare_safe_input(sample_request)
    
    # Check that party names are not included in safe input
    for party in safe_input["parties"]:
        assert "name" not in party
        assert "role" in party
        assert "type" in party

def test_create_filing_prompt(filing_service, sample_request):
    """Test prompt creation"""
    safe_input = filing_service._prepare_safe_input(sample_request)
    prompt = filing_service._create_filing_prompt(safe_input)
    
    assert "legal intake assistant" in prompt
    assert "ODR" in prompt
    assert "JSON" in prompt
    assert "Mediation" in prompt
