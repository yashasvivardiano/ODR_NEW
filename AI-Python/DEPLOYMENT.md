# Deployment Guide - ODR AI System

## 🚀 Quick Deployment

### Prerequisites
- Python 3.8+
- API keys for AI providers
- PostgreSQL database (optional)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd AI-Python
pip install -r requirements.txt
```

### 2. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env with your actual values
nano .env
```

### 3. Run the Application
```bash
# Development
python main.py

# Production (with gunicorn)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create directories
RUN mkdir -p uploads processed logs

# Expose port
EXPOSE 8000

# Run application
CMD ["python", "main.py"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  odr-ai:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - PRODUCTION=true
    volumes:
      - ./uploads:/app/uploads
      - ./processed:/app/processed
      - ./logs:/app/logs
    restart: unless-stopped

  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=odr_ai
      - POSTGRES_USER=odr_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

## ☁️ Cloud Deployment

### AWS Deployment
```bash
# Using AWS CLI
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t3.medium \
  --key-name your-key \
  --security-groups your-sg \
  --user-data file://user-data.sh
```

### Heroku Deployment
```bash
# Create Heroku app
heroku create your-odr-ai-app

# Set environment variables
heroku config:set OPENAI_API_KEY=your-key
heroku config:set GROQ_API_KEY=your-key
heroku config:set GEMINI_API_KEY=your-key
heroku config:set PRODUCTION=true

# Deploy
git push heroku main
```

## 🔧 Production Configuration

### Environment Variables
```env
# Production settings
PRODUCTION=true
DEBUG=false
HOST=0.0.0.0
PORT=8000

# Security
SECRET_KEY=your-super-secure-secret-key
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# File processing
MAX_FILE_SIZE=104857600
FILE_RETENTION_DAYS=30
AUTO_CLEANUP=true

# Logging
LOG_LEVEL=INFO
LOG_ROTATION=10MB
LOG_RETENTION=7 days
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # File upload size
    client_max_body_size 100M;
}
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
```bash
# System health
curl http://localhost:8000/health

# Service-specific health
curl http://localhost:8000/api/v1/filing/health
curl http://localhost:8000/api/v1/hearing/health
curl http://localhost:8000/api/v1/transcription/health
```

### Monitoring Setup
```python
# Add to main.py for metrics
from prometheus_client import Counter, Histogram, generate_latest

REQUEST_COUNT = Counter('requests_total', 'Total requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('request_duration_seconds', 'Request duration')

@app.middleware("http")
async def monitor_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    REQUEST_DURATION.observe(time.time() - start_time)
    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
    return response
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy ODR AI System

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
          
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          
      - name: Run tests
        run: |
          python test_integration.py
          
      - name: Deploy to production
        run: |
          # Your deployment commands here
```

## 🚨 Troubleshooting

### Common Issues
1. **API Keys not working**: Check environment variables
2. **File upload fails**: Check file size limits and permissions
3. **CORS errors**: Verify ALLOWED_ORIGINS configuration
4. **Memory issues**: Increase server memory for large files

### Logs
```bash
# View logs
tail -f logs/odr_ai.log

# Check system logs
journalctl -u your-service-name -f
```

## 📈 Performance Optimization

### Production Optimizations
- Use multiple workers with gunicorn
- Enable file caching
- Implement database connection pooling
- Use CDN for static files
- Monitor memory usage

### Scaling
- Horizontal scaling with load balancer
- Database read replicas
- File storage with cloud services
- Caching layer (Redis)

---

For more detailed information, see the [Team Manual](TEAM_MANUAL.md) and [Security Guide](SECURITY.md).
