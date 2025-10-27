# ODR Platform - Quick Start Guide

## 🚀 How to Start All Services

### 1. Start Node.js Backend Server
Open a new terminal and run:
```bash
cd C:\Users\YASHASVI` BHARDWAJ\OneDrive\Desktop\ODR_FINAL\backend
npm start
```
This will start the backend on **http://localhost:3001**

### 2. Start Webapp (Next.js Frontend)  
Open another terminal and run:
```bash
cd C:\Users\YASHASVI` BHARDWAJ\OneDrive\Desktop\ODR_FINAL\webapp
npm run dev
```
This will start the frontend on **http://localhost:3000** (or 3001 if 3000 is busy)

### 3. Start Python AI Service (Optional)
Open another terminal and run:
```bash
cd C:\Users\YASHASVI` BHARDWAJ\OneDrive\Desktop\ODR_FINAL\AI-Python
python ai_service.py
```
This will start the AI service on **http://localhost:8000**

## 📱 Access Your Application

- **Webapp**: http://localhost:3000 (or 3001)
- **Backend API**: http://localhost:3001
- **Python AI Service**: http://localhost:8000

## ⚠️ Important Notes

1. The backend on port 3001 provides all the API endpoints the webapp needs
2. The Python AI service on port 8000 is a separate microservice
3. Port 3000-3001 conflicts are handled automatically by Next.js

## 🐛 Troubleshooting

If you get JSON errors:
- Make sure the backend server is running on port 3001
- Check that the webapp is calling the correct API endpoints
- Verify the backend routes are loaded in `backend/routes/ai.js`

