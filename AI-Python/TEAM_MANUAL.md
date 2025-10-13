# ODR AI System - Team Manual

## 📋 Table of Contents
1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [API Documentation](#api-documentation)
4. [Integration Guide](#integration-guide)
5. [Configuration](#configuration)
6. [Troubleshooting](#troubleshooting)
7. [Development Guidelines](#development-guidelines)

---

## 🎯 Overview

The ODR AI System is a production-ready Python backend that provides AI-powered assistance for Online Dispute Resolution. It integrates with multiple AI providers (OpenAI, Gemini, Groq) and offers intelligent case filing suggestions.

### Key Features
- ✅ **Multi-AI Provider Support** with automatic failover
- ✅ **PII Redaction** for privacy protection
- ✅ **Legal Domain Expertise** for Indian ODR cases
- ✅ **RESTful API** with comprehensive documentation
- ✅ **Production Ready** with logging, error handling, and testing

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- API keys for AI providers (OpenAI, Gemini, Groq)

### Installation
```bash
cd AI-Python
pip install -r requirements.txt
```

### Environment Setup
1. Copy `env.example` to `.env`
2. Add your API keys:
```env
OPENAI_API_KEY=your_openai_key_here
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here
```

⚠️ **SECURITY WARNING**: Never commit `.env` files to version control!

### Running the Server
```bash
python main.py
```
Server will start at `http://localhost:8000`

### Health Check
```bash
curl http://localhost:8000/health
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
Currently no authentication required. Add JWT tokens in production.

---

### 1. Filing Suggestions API

**Endpoint:** `POST /filing/suggestions`

**Description:** Get AI-powered suggestions for case filing

#### Request Body
```json
{
  "dispute_title": "Payment Dispute with Contractor",
  "dispute_description": "The contractor failed to complete the work as agreed in the contract. He was supposed to finish by December 2023 but only completed 60% of the work. I paid ₹2,50,000 upfront but he's demanding more money without completing the remaining work.",
  "case_type": "Mediation",
  "parties": [
    {
      "name": "Rajesh Kumar",
      "role": "Complainant",
      "type": "Individual"
    },
    {
      "name": "ABC Construction",
      "role": "Respondent", 
      "type": "Organization"
    }
  ],
  "uploaded_documents": [
    {
      "filename": "contract.pdf",
      "type": "application/pdf",
      "size": 1024000
    }
  ],
  "estimated_amount": 250000.0,
  "jurisdiction": "Mumbai",
  "preferred_provider": "openai"
}
```

#### Response
```json
{
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "suggestions": {
    "case_type": {
      "recommended": "Mediation",
      "confidence": 0.85,
      "rationale": "Contract disputes are ideal for mediation as they involve clear terms and both parties can benefit from a negotiated settlement.",
      "alternatives": [
        {
          "type": "Arbitration",
          "confidence": 0.65,
          "reason": "If mediation fails, arbitration provides binding resolution"
        }
      ]
    },
    "required_documents": [
      {
        "type": "Contract",
        "description": "Original signed contract with terms and conditions",
        "priority": "Required",
        "reason": "Essential to establish the agreement terms"
      },
      {
        "type": "Invoice",
        "description": "Payment receipts and invoices",
        "priority": "Required", 
        "reason": "Proof of payments made"
      },
      {
        "type": "Evidence_Photo",
        "description": "Photos of incomplete work",
        "priority": "Recommended",
        "reason": "Visual evidence of work status"
      }
    ],
    "field_hints": {
      "title": "Construction Contract Dispute - Incomplete Work",
      "jurisdiction": "Mumbai District Court",
      "estimated_timeline": "3-6 months",
      "suggested_amount": 250000
    },
    "urgency": {
      "level": "Medium",
      "confidence": 0.75,
      "factors": [
        "Time-sensitive construction project",
        "Significant financial amount involved",
        "Clear breach of contract terms"
      ]
    }
  },
  "metadata": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "timestamp": "2024-01-15T10:30:00Z",
    "processing_time_ms": 1250
  }
}
```

#### cURL Example
```bash
curl -X POST "http://localhost:8000/api/v1/filing/suggestions" \
  -H "Content-Type: application/json" \
  -d '{
    "dispute_description": "Contractor failed to complete work as agreed",
    "parties": [
      {
        "name": "Rajesh Kumar",
        "role": "Complainant",
        "type": "Individual"
      }
    ],
    "estimated_amount": 250000.0
  }'
```

---

### 2. Audio Transcription API

**Endpoint:** `POST /transcription/upload`

**Description:** Upload audio file for transcription

#### Request (Multipart Form Data)
```
file: [audio file] (mp3, wav, m4a, flac, ogg)
file_type: "audio"
```

#### Response
```json
{
  "success": true,
  "file_metadata": {
    "file_id": "550e8400-e29b-41d4-a716-446655440000",
    "original_filename": "meeting_recording.mp3",
    "stored_filename": "550e8400-e29b-41d4-a716-446655440000.mp3",
    "file_path": "uploads/550e8400-e29b-41d4-a716-446655440000.mp3",
    "file_size": 2048000,
    "mime_type": "audio/mpeg",
    "file_type": "audio",
    "status": "uploaded",
    "uploaded_at": "2024-01-15T10:30:00Z"
  }
}
```

**Endpoint:** `POST /transcription/transcribe/{file_id}`

**Description:** Transcribe uploaded audio file

#### Request (Form Data)
```
language: "en" (optional, default: "en")
model_size: "base" (optional, default: "base")
include_timestamps: false (optional, default: false)
```

#### Response
```json
{
  "success": true,
  "result": {
    "text": "This is the transcribed text from the audio file. It contains all the spoken content with proper punctuation and formatting.",
    "language": "en",
    "duration": 120.5,
    "segments": [
      {
        "start": 0.0,
        "end": 5.2,
        "text": "Welcome to today's meeting.",
        "confidence": 0.95
      }
    ]
  },
  "processing_time_ms": 2500
}
```

### 3. Video Analysis API

**Endpoint:** `POST /hearing/upload`

**Description:** Upload court hearing video for analysis

#### Request (Multipart Form Data)
```
file: [video file] (mp4, avi, mov, mkv, webm)
file_type: "video"
```

**Endpoint:** `POST /hearing/analyze/{file_id}`

**Description:** Analyze court hearing video

#### Request (Form Data)
```
analysis_type: "full" (optional, default: "full")
provider: "openai" (optional, default: system default)
```

#### Response
```json
{
  "success": true,
  "result": {
    "transcription": {
      "text": "Judge: Please state your case. Lawyer: Your honor, this is a contract dispute...",
      "segments": [...]
    },
    "analysis": {
      "summary": {
        "hearing_type": "Civil",
        "duration_minutes": 60,
        "key_issues": ["Contract breach", "Payment dispute"],
        "next_hearing_date": "2024-02-15",
        "judge_orders": ["Submit evidence by next week"]
      },
      "participants": {
        "judge": "Hon. Justice Smith",
        "plaintiff_lawyer": "ABC Law Firm",
        "defendant_lawyer": "XYZ Associates"
      },
      "arguments": {
        "plaintiff": {
          "main_points": ["Contract was breached", "Payment not received"],
          "evidence": ["Signed contract", "Payment receipts"]
        },
        "defendant": {
          "main_points": ["Work not completed", "Quality issues"],
          "defenses": ["Force majeure", "Material breach"]
        }
      },
      "case_assessment": {
        "strength_plaintiff": "Strong",
        "strength_defendant": "Moderate",
        "likely_outcome": "Favorable to plaintiff",
        "settlement_possibility": "Medium"
      },
      "recommendations": {
        "for_plaintiff": ["Gather more evidence", "Prepare witness statements"],
        "for_defendant": ["Review contract terms", "Consider settlement"]
      }
    }
  },
  "processing_time_ms": 15000
}
```

---

### 4. Health Check APIs

#### System Health
```bash
curl http://localhost:8000/health
```

#### Filing Service Health
```bash
curl http://localhost:8000/api/v1/filing/health
```

#### Hearing Service Health
```bash
curl http://localhost:8000/api/v1/hearing/health
```

#### Transcription Service Health
```bash
curl http://localhost:8000/api/v1/transcription/health
```

---

## 🔗 Integration Guide

### Frontend Integration (React/Next.js)

#### 1. API Service Setup
```javascript
// services/aiService.js
const API_BASE_URL = 'http://localhost:8000/api/v1';

export const aiService = {
  async getFilingSuggestions(disputeData) {
    const response = await fetch(`${API_BASE_URL}/filing/suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(disputeData)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  },
  
  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  }
};
```

#### 2. React Component Example
```jsx
// components/FilingForm.jsx
import React, { useState } from 'react';
import { aiService } from '../services/aiService';

export const FilingForm = () => {
  const [formData, setFormData] = useState({
    dispute_description: '',
    estimated_amount: 0,
    parties: []
  });
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await aiService.getFilingSuggestions(formData);
      setSuggestions(response.suggestions);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      alert('Failed to get AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={formData.dispute_description}
          onChange={(e) => setFormData({
            ...formData,
            dispute_description: e.target.value
          })}
          placeholder="Describe your dispute..."
          required
        />
        
        <input
          type="number"
          value={formData.estimated_amount}
          onChange={(e) => setFormData({
            ...formData,
            estimated_amount: parseFloat(e.target.value)
          })}
          placeholder="Estimated amount"
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
        </button>
      </form>

      {suggestions && (
        <div className="suggestions">
          <h3>AI Suggestions</h3>
          <p><strong>Recommended Case Type:</strong> {suggestions.case_type.recommended}</p>
          <p><strong>Confidence:</strong> {(suggestions.case_type.confidence * 100).toFixed(1)}%</p>
          <p><strong>Rationale:</strong> {suggestions.case_type.rationale}</p>
          
          <h4>Required Documents:</h4>
          <ul>
            {suggestions.required_documents.map((doc, index) => (
              <li key={index}>
                <strong>{doc.type}</strong> ({doc.priority}): {doc.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

### Backend Integration (Node.js/Express)

#### 1. Express Route Example
```javascript
// routes/ai.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const AI_API_BASE = 'http://localhost:8000/api/v1';

router.post('/filing/suggestions', async (req, res) => {
  try {
    const response = await axios.post(
      `${AI_API_BASE}/filing/suggestions`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('AI Service Error:', error.message);
    res.status(500).json({
      error: 'Failed to get AI suggestions',
      details: error.message
    });
  }
});

module.exports = router;
```

#### 2. Middleware for Error Handling
```javascript
// middleware/aiErrorHandler.js
const aiErrorHandler = (error, req, res, next) => {
  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'AI Service Unavailable',
      message: 'The AI service is currently down. Please try again later.'
    });
  }
  
  if (error.response?.status === 500) {
    return res.status(500).json({
      error: 'AI Processing Error',
      message: 'Failed to process your request. Please try again.'
    });
  }
  
  next(error);
};

module.exports = aiErrorHandler;
```

---

## ⚙️ Configuration

### Environment Variables
```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=false

# AI Provider API Keys (Required)
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Default AI Configuration
DEFAULT_AI_PROVIDER=openai
DEFAULT_AI_MODEL=gpt-4o-mini

# Security (Change in production)
SECRET_KEY=your-secret-key-here

# File Processing
MAX_FILE_SIZE=104857600
UPLOAD_DIR=uploads
PROCESSED_DIR=processed

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/odr_ai.log
```

### AI Provider Configuration
- **OpenAI**: Uses GPT-4o-mini by default
- **Groq**: Uses Llama-3.1-8b-instant
- **Gemini**: Uses Gemini-2.0-flash
- **Failover**: Automatically switches if primary provider fails

---

## 🔧 Troubleshooting

### Common Issues

#### 1. AI Service Not Responding
**Error:** `Connection refused` or `503 Service Unavailable`

**Solutions:**
- Check if AI service is running: `curl http://localhost:8000/health`
- Verify API keys in `.env` file
- Check logs: `tail -f logs/odr_ai.log`

#### 2. Invalid API Response
**Error:** `Invalid JSON response from AI`

**Solutions:**
- Check AI provider API keys
- Verify internet connection
- Try different AI provider by setting `preferred_provider`

#### 3. PII Redaction Issues
**Error:** Sensitive data in AI requests

**Solutions:**
- Ensure PII redaction is working
- Check `utils/security/pii_redaction.py`
- Test with sample data

### Debug Mode
Enable debug mode for detailed logging:
```env
DEBUG=true
LOG_LEVEL=DEBUG
```

### Testing AI Providers
```bash
# Test OpenAI
curl -X POST "http://localhost:8000/api/v1/filing/suggestions" \
  -H "Content-Type: application/json" \
  -d '{"dispute_description": "test", "preferred_provider": "openai"}'

# Test Groq
curl -X POST "http://localhost:8000/api/v1/filing/suggestions" \
  -H "Content-Type: application/json" \
  -d '{"dispute_description": "test", "preferred_provider": "groq"}'

# Test Gemini
curl -X POST "http://localhost:8000/api/v1/filing/suggestions" \
  -H "Content-Type: application/json" \
  -d '{"dispute_description": "test", "preferred_provider": "gemini"}'
```

---

## 👥 Development Guidelines

### For Frontend Team
1. **Always handle loading states** - AI requests can take 1-3 seconds
2. **Implement error handling** - Show user-friendly error messages
3. **Validate input** - Check required fields before sending requests
4. **Use TypeScript** - Define interfaces for API responses
5. **Cache responses** - Store suggestions to avoid repeated requests

### For Backend Team
1. **Add authentication** - Implement JWT tokens for production
2. **Rate limiting** - Prevent API abuse
3. **Input validation** - Validate all incoming data
4. **Error logging** - Log all errors for debugging
5. **Monitoring** - Add health checks and metrics

### Code Standards
- Use async/await for all API calls
- Handle errors gracefully
- Log important events
- Follow RESTful conventions
- Write unit tests for critical functions

---

## 📞 Support

### Getting Help
1. Check the logs: `logs/odr_ai.log`
2. Test individual components
3. Verify API keys and configuration
4. Check network connectivity

### Contact
- **Technical Issues**: Check logs and error messages
- **Feature Requests**: Document requirements clearly
- **Integration Help**: Refer to examples in this manual

---

## 🔄 Updates

### Current Version: 1.0.0
- ✅ Filing suggestions API
- ✅ Multi-AI provider support
- ✅ PII redaction
- ✅ Health monitoring

### New Features (Just Implemented!)
- ✅ **Audio Transcription** - Upload and transcribe audio files using OpenAI Whisper
- ✅ **Video Analysis** - Analyze court hearing videos with AI insights
- ✅ **File Upload System** - Complete file handling with validation and storage
- ✅ **Multi-format Support** - Audio (mp3, wav, m4a) and Video (mp4, avi, mov)

### Planned Features
- 🚧 Database integration
- 🚧 User authentication
- 🚧 Real-time processing status

---

## 🔒 Security & Deployment

### Security
- See [SECURITY.md](SECURITY.md) for comprehensive security guidelines
- Never commit API keys or secrets to version control
- Use strong passwords and rotate keys regularly
- Configure proper CORS origins for production

### Deployment
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
- Use Docker for containerized deployment
- Configure monitoring and health checks
- Set up proper logging and error tracking

---

*Last Updated: January 2024*
*For questions or issues, refer to the troubleshooting section or check the logs.*
