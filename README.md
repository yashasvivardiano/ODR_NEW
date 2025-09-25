# ODR - Online Dispute Resolution Platform

[![AI Features](https://img.shields.io/badge/AI-Powered-blue.svg)](https://github.com/Vardiano-Technologies/ODR)
[![React Native](https://img.shields.io/badge/React%20Native-0.72-61DAFB.svg)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg)](https://www.typescriptlang.org/)

## 🚀 Overview

ODR is a comprehensive **AI-powered Online Dispute Resolution platform** that enables individuals and organizations to initiate, manage, and resolve legal disputes entirely online. The platform combines traditional legal workflows with cutting-edge AI technology to provide intelligent case assistance, automated hearing processing, and real-time audio analysis.

## ✨ Key Features

### 🤖 AI-Powered Features
- **AI Filing Assistant** - Smart case suggestions using NLP and generative AI
- **Court Hearing AI** - Automated video/audio processing with judgment extraction
- **Real Audio Processing** - Speech-to-text transcription using OpenAI Whisper
- **ML-Based Classification** - Automatic dispute categorization and urgency tagging
- **PII Protection** - Automatic redaction of sensitive information

### 📱 Core Platform Features
- **Case Filing Workflow** - Guided, multi-step legal case submission
- **Virtual Hearings** - Zoom/Google Meet integration with recording
- **Document Management** - Secure upload and storage of legal documents
- **User Authentication** - Email/OTP-based secure access
- **History Tracking** - Complete activity and case history
- **Admin Panel** - Role-based case management and analytics

## 🏗️ Architecture

### Frontend (React Native/Expo)
- **Framework**: React Native with Expo
- **State Management**: Zustand
- **Language**: TypeScript
- **UI Components**: Custom components with modern design

### Backend (Node.js/Express)
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **AI Integration**: OpenAI, Groq, Google Gemini
- **Audio Processing**: FFmpeg with Whisper API
- **File Handling**: Multer for uploads

### AI Services
- **OpenAI GPT-4o-mini** - Smart filing suggestions
- **Groq Llama-3.1-8b-instant** - Fast AI responses
- **Google Gemini-1.5-flash** - Advanced text analysis
- **OpenAI Whisper** - Speech-to-text transcription

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Vardiano-Technologies/ODR.git
cd ODR
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Configuration

#### Backend Configuration
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your API keys:
```env
# AI Provider Configuration
AI_PROVIDER=groq  # Options: openai, groq, gemini
OPENAI_API_KEY=your_openai_key_here
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Configuration
```bash
cp ai-config.example.ts ai-config.ts
```

### 4. Start the Application

#### Start Backend Server
```bash
cd backend
npm start
```

#### Start Frontend (Choose one)
```bash
# For web development
npm run web

# For mobile development
npm run android  # or npm run ios
```

## 📱 Usage

### AI Filing Assistant
1. Navigate to "🤖 AI Filing Assistant"
2. Fill in case details
3. Click "Get AI Suggestions" for smart recommendations
4. Review and apply AI-generated suggestions
5. Submit your case

### Court Hearing AI
1. Go to "🎥 Court Hearing AI"
2. Upload hearing video/audio files
3. AI processes and extracts:
   - Complete transcription
   - Judge's statements and orders
   - Case probability analysis
4. View structured results and analysis

### Real Audio Processing
1. Select "🎤 Real Audio Processing"
2. Upload audio files
3. Get real-time transcription using Whisper
4. View processing status and results

## 🧪 Testing

### Run AI Tests
```bash
# Test AI Filing Assistant
npx tsx ai-phase1.test.ts

# Test Court Hearing AI
npx tsx hearing-ai-test.ts
```

### Test Backend Endpoints
```bash
# Health check
curl http://localhost:3001/health

# Test AI filing endpoint
curl -X POST http://localhost:3001/ai/file-assist \
  -H "Content-Type: application/json" \
  -d '{"caseDescription":"Contract dispute","caseType":"mediation"}'
```

## 📁 Project Structure

```
ODR/
├── 📱 Frontend (React Native)
│   ├── App.tsx                 # Main app component
│   ├── FilingFormExample.tsx   # AI filing form
│   ├── HearingAIDashboard.tsx  # Hearing AI interface
│   ├── RealAudioUpload.tsx     # Audio processing UI
│   ├── HistoryScreen.tsx       # Activity history
│   └── src/
│       ├── screens/            # Authentication screens
│       └── store/              # State management
│
├── 🤖 AI Services
│   ├── ai-service.ts           # Core AI client
│   ├── ai-types.ts             # TypeScript interfaces
│   ├── pii-redaction.ts        # Privacy protection
│   ├── useAISuggestions.ts     # React hooks
│   └── hearing-ai-service.ts   # Court hearing AI
│
├── 🔧 Backend
│   ├── server.js               # Express server
│   ├── audio-processor.js      # Audio/video processing
│   ├── package.json            # Dependencies
│   └── .env                    # Environment config
│
├── 📋 Tests
│   ├── ai-phase1.test.ts       # AI filing tests
│   └── hearing-ai-test.ts      # Hearing AI tests
│
└── 📚 Documentation
    ├── README.md               # This file
    ├── AI-README.md            # AI features guide
    └── integration-guide.md    # Integration docs
```

## 🔧 API Endpoints

### AI Services
- `POST /ai/file-assist` - Get AI filing suggestions
- `POST /ai/hearing/upload` - Upload hearing files
- `GET /ai/hearing/status/:id` - Check processing status
- `GET /ai/hearing/transcript/:id` - Get transcription
- `GET /ai/hearing/probability/:id` - Get case analysis

### System
- `GET /health` - Health check and AI provider status
- `GET /` - API documentation

## 🔐 Security Features

- **PII Redaction** - Automatic removal of sensitive information
- **Rate Limiting** - API protection against abuse
- **CORS Protection** - Secure cross-origin requests
- **Environment Variables** - Secure API key management
- **Input Validation** - Comprehensive request validation

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start production server
cd backend
NODE_ENV=production npm start
```

### Environment Variables (Production)
- Set `NODE_ENV=production`
- Configure production API keys
- Set appropriate rate limits
- Configure CORS for your domain

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: yashasvi@vardianotechnologies.com
- **GitHub Issues**: [Create an issue](https://github.com/Vardiano-Technologies/ODR/issues)

## 🙏 Acknowledgments

- **OpenAI** - GPT and Whisper API
- **Groq** - Fast AI inference
- **Google** - Gemini AI model
- **Expo** - React Native development platform
- **Vardiano Technologies** - Development team

---

**Built with ❤️ by Vardiano Technologies**

*Transforming legal dispute resolution through AI innovation*
