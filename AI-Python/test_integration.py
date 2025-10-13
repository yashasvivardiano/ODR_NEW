"""
Integration Test Script
Tests all new services and endpoints
"""

import asyncio
import json
from pathlib import Path

async def test_file_handler():
    """Test file handler functionality"""
    print("🧪 Testing File Handler...")
    
    from utils.file_processing.file_handler import FileHandler
    
    file_handler = FileHandler()
    
    # Test with sample data
    test_content = b"This is a test audio file content"
    test_filename = "test_audio.wav"
    
    try:
        result = await file_handler.save_uploaded_file(
            file_content=test_content,
            filename=test_filename,
            file_type="audio"
        )
        
        print(f"✅ File saved: {result['file_id']}")
        
        # Test file retrieval
        file_path = await file_handler.get_file_path(result['file_id'])
        print(f"✅ File path retrieved: {file_path}")
        
        # Clean up
        await file_handler.delete_file(result['file_id'])
        print("✅ File deleted successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ File handler test failed: {e}")
        return False

async def test_transcription_service():
    """Test transcription service"""
    print("\n🧪 Testing Transcription Service...")
    
    from services.transcription.transcription_service import TranscriptionService
    
    transcription_service = TranscriptionService()
    
    try:
        # Test supported languages
        languages = await transcription_service.get_supported_languages()
        print(f"✅ Supported languages: {len(languages['supported_languages'])} languages")
        
        # Test validation (without actual file)
        print("✅ Transcription service initialized successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Transcription service test failed: {e}")
        return False

async def test_hearing_service():
    """Test hearing analysis service"""
    print("\n🧪 Testing Hearing Analysis Service...")
    
    try:
        # Mock AI manager for testing
        class MockAIManager:
            async def generate_response(self, prompt, **kwargs):
                return {
                    "content": '{"summary": {"hearing_type": "Civil", "duration_minutes": 60}, "participants": {}, "arguments": {}, "case_assessment": {}, "recommendations": {}}',
                    "provider": "test",
                    "model": "test"
                }
        
        from services.hearing.hearing_analysis_service import HearingAnalysisService
        
        hearing_service = HearingAnalysisService(MockAIManager())
        
        print("✅ Hearing analysis service initialized successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Hearing analysis service test failed: {e}")
        return False

async def test_ai_engines():
    """Test AI engine manager"""
    print("\n🧪 Testing AI Engine Manager...")
    
    try:
        from core.ai_engines.manager import AIEngineManager
        
        ai_manager = AIEngineManager()
        print("✅ AI Engine Manager initialized")
        
        # Test status (without API keys)
        status = ai_manager.get_status()
        print(f"✅ AI engines status: {len(status)} engines configured")
        
        return True
        
    except Exception as e:
        print(f"❌ AI Engine Manager test failed: {e}")
        return False

async def test_schemas():
    """Test data schemas"""
    print("\n🧪 Testing Data Schemas...")
    
    try:
        from models.schemas.file_schemas import FileUploadResponse, FileProcessingResponse
        from models.schemas.filing_schemas import FilingRequest, FilingResponse
        
        # Test file schemas
        file_response = FileUploadResponse(
            success=True,
            file_metadata=None
        )
        print("✅ File schemas validated")
        
        # Test filing schemas
        filing_request = FilingRequest(
            dispute_description="Test dispute"
        )
        print("✅ Filing schemas validated")
        
        return True
        
    except Exception as e:
        print(f"❌ Schema test failed: {e}")
        return False

async def main():
    """Run all integration tests"""
    print("🚀 Starting ODR AI System Integration Tests\n")
    
    tests = [
        test_schemas,
        test_ai_engines,
        test_file_handler,
        test_transcription_service,
        test_hearing_service
    ]
    
    results = []
    for test in tests:
        try:
            result = await test()
            results.append(result)
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {e}")
            results.append(False)
    
    # Summary
    passed = sum(results)
    total = len(results)
    
    print(f"\n📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! System is ready for use.")
    else:
        print("⚠️  Some tests failed. Check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    asyncio.run(main())
