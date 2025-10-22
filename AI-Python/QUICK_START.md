# ODR AI Service - Quick Start

## 🚀 Setup (2 minutes)

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Start server
python ai_service.py
```

## 📡 API Endpoints

**Base URL:** `http://localhost:8000`

### 1. Filing Suggestions
```bash
POST /api/filing/suggestions
```

**Request:**
```json
{
  "dispute_title": "Contract Dispute",
  "dispute_description": "Supplier delivered wrong goods",
  "parties": [{"name": "John", "role": "Complainant", "type": "Individual"}],
  "preferred_provider": "gemini"
}
```

**Response:**
```json
{
  "request_id": "filing_20251014_122243",
  "suggestions": {
    "case_type": {"recommended": "Mediation", "confidence": 0.85},
    "urgency": {"level": "Medium", "confidence": 0.75},
    "required_documents": [...]
  },
  "metadata": {"provider": "gemini", "model": "gemini-2.0-flash"}
}
```

### 2. Transcript Formatting
```bash
POST /api/transcript/format
```

**Request:**
```json
{
  "raw_text": "Judge: Please state your case. Lawyer: This is a contract dispute.",
  "format_type": "structured",
  "language": "en"
}
```

### 3. Health Check
```bash
GET /health
```

## 🔧 Configuration

**Environment Variables:**
```env
GEMINI_API_KEY=AIzaSyCrvuz2DjR4bS-Uy14deDoXIuzSJMM1m1Q
HOST=0.0.0.0
PORT=8000
```

## 💻 Backend Integration

**Python:**
```python
import httpx

async def get_filing_suggestions(data):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/filing/suggestions",
            json=data
        )
        return response.json()
```

**JavaScript:**
```javascript
const response = await fetch('http://localhost:8000/api/filing/suggestions', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(data)
});
const result = await response.json();
```

## 📁 Files

- `ai_service.py` - Main service (single file)
- `requirements.txt` - Dependencies
- `.env` - Configuration
- `example_*.json` - Sample responses

## ⚡ Quick Test

```bash
# Start server
python ai_service.py

# Test endpoint
curl -X POST http://localhost:8000/api/filing/suggestions \
  -H "Content-Type: application/json" \
  -d '{"dispute_title": "Test", "dispute_description": "Test dispute"}'
```

**That's it! Your AI service is ready to use.**
