# ODR AI Service

**Single-file AI service with Gemini API for legal dispute resolution.**

## 🚀 Quick Start

```bash
pip install -r requirements.txt
python ai_service.py
```

## 📡 API Endpoints

**Base URL:** `http://localhost:8000`

### Filing Suggestions
```bash
POST /api/filing/suggestions
```
```json
{
  "dispute_title": "Contract Dispute",
  "dispute_description": "Supplier delivered wrong goods",
  "preferred_provider": "gemini"
}
```

### Transcript Formatting
```bash
POST /api/transcript/format
```
```json
{
  "raw_text": "Judge: Please state your case. Lawyer: This is a contract dispute.",
  "format_type": "structured"
}
```

### Health Check
```bash
GET /health
```

## 🔧 Configuration

```env
GEMINI_API_KEY=AIzaSyCrvuz2DjR4bS-Uy14deDoXIuzSJMM1m1Q
HOST=0.0.0.0
PORT=8000
```

## 💻 Backend Integration

**Python:**
```python
import httpx
response = await client.post("http://localhost:8000/api/filing/suggestions", json=data)
```

**JavaScript:**
```javascript
const response = await fetch('http://localhost:8000/api/filing/suggestions', {
  method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
});
```

## 📁 Files

- `ai_service.py` - Main service (single file)
- `requirements.txt` - Dependencies  
- `.env` - Configuration
- `example_*.json` - Sample responses

**Ready to use!**
