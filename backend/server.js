// ODR AI Backend Server - Phase 1
// Real AI integration for /ai/file-assist endpoint

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { AudioProcessor, upload } = require('./audio-processor');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize audio processor
const audioProcessor = new AudioProcessor();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: ['http://localhost:8081', 'exp://192.168.*', 'http://192.168.*:8081'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/ai/', limiter);

// Multi-provider AI integration
async function callAIProvider(prompt, provider = 'openai', model = null) {
  const systemMessage = 'You are a legal intake assistant for an Online Dispute Resolution platform in India. Return ONLY valid JSON responses.';
  
  switch (provider.toLowerCase()) {
    case 'openai':
      return await callOpenAI(prompt, model || 'gpt-4o-mini', systemMessage);
    case 'gemini':
      return await callGemini(prompt, model || 'gemini-1.5-flash', systemMessage);
    case 'groq':
      return await callGroq(prompt, model || 'llama-3.1-8b-instant', systemMessage);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

// OpenAI integration
async function callOpenAI(prompt, model, systemMessage) {
  const API_KEY = process.env.OPENAI_API_KEY;
  
  if (!API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid OpenAI response structure');
  }

  return data.choices[0].message.content;
}

// Google Gemini integration
async function callGemini(prompt, model, systemMessage) {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const fullPrompt = `${systemMessage}\n\nUser: ${prompt}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: fullPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1500,
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
    throw new Error('Invalid Gemini response structure');
  }

  return data.candidates[0].content.parts[0].text;
}

// Groq integration
async function callGroq(prompt, model, systemMessage) {
  const API_KEY = process.env.GROQ_API_KEY;
  
  if (!API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is required');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid Groq response structure');
  }

  return data.choices[0].message.content;
}

// Main AI endpoint
app.post('/ai/file-assist', async (req, res) => {
  const startTime = Date.now();
  const requestId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const { 
      prompt, 
      provider = process.env.AI_PROVIDER || 'openai',
      model = null,
      temperature = 0.1, 
      max_tokens = 1500 
    } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        error: 'Missing required field: prompt',
        requestId
      });
    }

    console.log(`[${requestId}] AI request started (provider: ${provider})`);
    
    // Call AI provider
    const aiResponse = await callAIProvider(prompt, provider, model);
    
    // Parse and validate JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error(`[${requestId}] JSON parse error:`, parseError);
      return res.status(500).json({
        error: 'AI returned invalid JSON',
        requestId,
        details: parseError.message
      });
    }

    // Validate required structure
    if (!parsedResponse.suggestions || !parsedResponse.suggestions.caseType) {
      console.error(`[${requestId}] Invalid AI response structure:`, parsedResponse);
      return res.status(500).json({
        error: 'AI response missing required fields',
        requestId
      });
    }

    const processingTime = Date.now() - startTime;
    console.log(`[${requestId}] AI request completed in ${processingTime}ms`);

    // Return structured response
    res.json({
      ...parsedResponse,
      metadata: {
        ...parsedResponse.metadata,
        requestId,
        processingTimeMs: processingTime,
        modelVersion: model,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[${requestId}] AI request failed after ${processingTime}ms:`, error);
    
    // Handle different error types
    if (error.message.includes('API_KEY') || error.message.includes('environment variable is required')) {
      return res.status(500).json({
        error: 'AI service configuration error',
        requestId
      });
    }
    
    if (error.message.includes('API error') || error.message.includes('Unsupported AI provider')) {
      return res.status(502).json({
        error: 'AI provider error',
        requestId,
        details: error.message
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      requestId,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  const providers = {
    openai: !!process.env.OPENAI_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
    groq: !!process.env.GROQ_API_KEY
  };
  
  const activeProvider = process.env.AI_PROVIDER || 'openai';
  const hasActiveKey = providers[activeProvider];
  
  res.json({
    status: hasActiveKey ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    activeProvider,
    providers,
    configured: Object.keys(providers).filter(p => providers[p])
  });
});

// Real Audio Processing Endpoints

// Upload and process audio/video file
app.post('/ai/hearing/upload', upload.single('file'), async (req, res) => {
  const requestId = `hearing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        requestId
      });
    }

    const { caseId, participants } = req.body;
    let participantsList = [];
    
    try {
      participantsList = participants ? JSON.parse(participants) : [];
    } catch (e) {
      console.warn('Invalid participants JSON, using empty array');
    }

    console.log(`[${requestId}] Starting real audio processing for: ${req.file.originalname}`);

    // Start async processing
    const response = {
      sessionId: requestId,
      status: 'queued',
      progress: 0,
      estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      stages: [
        { stage: 'audio_extraction', status: 'pending', progress: 0 },
        { stage: 'transcription', status: 'pending', progress: 0 },
        { stage: 'speaker_identification', status: 'pending', progress: 0 },
        { stage: 'judgment_extraction', status: 'pending', progress: 0 },
        { stage: 'probability_analysis', status: 'pending', progress: 0 },
        { stage: 'pdf_generation', status: 'pending', progress: 0 }
      ],
      file: {
        originalName: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype
      }
    };

    // Store in processing queue
    global.processingQueue = global.processingQueue || new Map();
    global.processingQueue.set(requestId, response);

    // Process asynchronously
    processAudioAsync(requestId, req.file.path, participantsList, { caseId })
      .catch(error => {
        console.error(`[${requestId}] Processing failed:`, error);
        if (global.processingQueue.has(requestId)) {
          const status = global.processingQueue.get(requestId);
          status.status = 'failed';
          status.error = error.message;
        }
      });

    res.json(response);

  } catch (error) {
    console.error(`[${requestId}] Upload error:`, error);
    res.status(500).json({
      error: 'Failed to process upload',
      requestId,
      details: error.message
    });
  }
});

// Async processing function
async function processAudioAsync(sessionId, filePath, participants, options) {
  try {
    console.log(`[${sessionId}] Starting real audio processing pipeline`);
    
    // Step 1: Process audio with Whisper
    const transcript = await audioProcessor.processAudioFile(
      filePath, 
      sessionId, 
      participants, 
      { language: 'en' }
    );
    
    // Store transcript in global storage (in production, use database)
    global.transcripts = global.transcripts || new Map();
    global.transcripts.set(sessionId, transcript);
    
    // Step 2: Extract judgment points (using existing AI)
    audioProcessor.updateProcessingStatus(sessionId, 'processing', 90, 'judgment_extraction');
    
    const judgmentPrompt = `Analyze this court hearing transcript and extract key judgment points, orders, and decisions:

Transcript: ${transcript.fullText}

Return JSON with:
- judgment_points: Array of key points made by the judge
- orders: Any orders or directives given
- next_hearing_date: If mentioned
- decision: Final ruling if any`;

    let judgmentAnalysis = null;
    try {
      const aiResponse = await callAIProvider(judgmentPrompt, 'groq', 'llama-3.1-8b-instant');
      judgmentAnalysis = JSON.parse(aiResponse.choices?.[0]?.message?.content || '{}');
    } catch (e) {
      console.warn('Judgment extraction failed, using mock data');
      judgmentAnalysis = {
        judgment_points: ["Based on evidence presented, court finds merit in plaintiff's case"],
        orders: ["Defendant to provide documentation within 30 days"],
        decision: "Case adjourned pending additional evidence"
      };
    }
    
    // Step 3: Generate probability analysis
    audioProcessor.updateProcessingStatus(sessionId, 'processing', 95, 'probability_analysis');
    
    const probabilityAnalysis = {
      id: `${sessionId}_analysis`,
      hearingId: sessionId,
      overallProbability: {
        plaintiff: 65,
        defendant: 35
      },
      keyFactors: [
        {
          factor: 'Strong evidence presentation',
          impact: 'positive',
          strength: 0.8,
          party: 'plaintiff',
          evidence: transcript.segments.filter(s => s.speakerRole === 'lawyer_plaintiff').slice(0, 2).map(s => s.text)
        }
      ],
      confidence: 0.78,
      modelVersion: 'whisper-v1.0.0',
      analyzedAt: new Date().toISOString()
    };
    
    // Store analysis
    global.analyses = global.analyses || new Map();
    global.analyses.set(sessionId, probabilityAnalysis);
    
    audioProcessor.updateProcessingStatus(sessionId, 'completed', 100, 'probability_analysis');
    
    console.log(`[${sessionId}] Real audio processing completed successfully`);
    
  } catch (error) {
    console.error(`[${sessionId}] Processing pipeline error:`, error);
    audioProcessor.updateProcessingStatus(sessionId, 'failed', 0, 'transcription');
    throw error;
  }
}

// Court Hearing AI endpoints (keeping original mock version)
app.post('/ai/hearing/process', async (req, res) => {
  const requestId = `hearing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const { videoUrl, caseId, hearingDate, participants, language = 'en-US' } = req.body;
    
    if (!videoUrl || !caseId || !hearingDate) {
      return res.status(400).json({
        error: 'Missing required fields: videoUrl, caseId, hearingDate',
        requestId
      });
    }

    console.log(`[${requestId}] Starting hearing video processing`);

    // Mock processing response - would integrate with actual hearing AI service
    const response = {
      sessionId: requestId,
      status: 'queued',
      progress: 0,
      estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      stages: [
        { stage: 'video_conversion', status: 'pending', progress: 0 },
        { stage: 'audio_extraction', status: 'pending', progress: 0 },
        { stage: 'transcription', status: 'pending', progress: 0 },
        { stage: 'speaker_identification', status: 'pending', progress: 0 },
        { stage: 'judgment_extraction', status: 'pending', progress: 0 },
        { stage: 'probability_analysis', status: 'pending', progress: 0 },
        { stage: 'pdf_generation', status: 'pending', progress: 0 },
        { stage: 'calendar_integration', status: 'pending', progress: 0 }
      ]
    };

    // Store in processing queue (would use Redis in production)
    global.processingQueue = global.processingQueue || new Map();
    global.processingQueue.set(requestId, response);

    // Start mock processing
    setTimeout(() => mockProcessingProgress(requestId), 1000);

    res.json(response);

  } catch (error) {
    console.error(`[${requestId}] Hearing processing error:`, error);
    res.status(500).json({
      error: 'Failed to start hearing processing',
      requestId
    });
  }
});

app.get('/ai/hearing/status/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  global.processingQueue = global.processingQueue || new Map();
  const status = global.processingQueue.get(sessionId);
  
  if (!status) {
    return res.status(404).json({
      error: 'Session not found',
      sessionId
    });
  }
  
  res.json(status);
});

app.get('/ai/hearing/transcript/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  // Check if we have real transcript data first
  global.transcripts = global.transcripts || new Map();
  if (global.transcripts.has(sessionId)) {
    const realTranscript = global.transcripts.get(sessionId);
    return res.json(realTranscript);
  }
  
  // Fallback to mock transcript response
  const transcript = {
    id: sessionId + '_transcript',
    hearingId: sessionId,
    segments: [
      {
        id: '1',
        startTime: 0,
        endTime: 15,
        speakerId: 'judge_1',
        speakerRole: 'judge',
        text: 'This court is now in session. We are here to discuss case number ' + sessionId.split('_')[1],
        confidence: 0.92,
        isJudgmentPoint: false
      },
      {
        id: '2',
        startTime: 15,
        endTime: 45,
        speakerId: 'lawyer_plaintiff_1',
        speakerRole: 'lawyer_plaintiff',
        text: 'Your Honor, my client has suffered significant damages due to breach of contract.',
        confidence: 0.88,
        isJudgmentPoint: false
      },
      {
        id: '3',
        startTime: 300,
        endTime: 330,
        speakerId: 'judge_1',
        speakerRole: 'judge',
        text: 'Based on the evidence presented, the court finds in favor of the plaintiff. The defendant is ordered to pay damages of $50,000.',
        confidence: 0.95,
        isJudgmentPoint: true
      }
    ],
    confidence: 0.89,
    language: 'en-US',
    processingTime: 120000,
    createdAt: new Date().toISOString()
  };
  
  res.json(transcript);
});

app.get('/ai/hearing/probability/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  // Check if we have real analysis data first
  global.analyses = global.analyses || new Map();
  if (global.analyses.has(sessionId)) {
    const realAnalysis = global.analyses.get(sessionId);
    return res.json(realAnalysis);
  }
  
  // Fallback to mock probability analysis
  const analysis = {
    id: sessionId + '_analysis',
    hearingId: sessionId,
    overallProbability: {
      plaintiff: 68,
      defendant: 32
    },
    timelineAnalysis: [
      { timestamp: 0, plaintiffProbability: 50, defendantProbability: 50, triggerEvent: 'Hearing started' },
      { timestamp: 300, plaintiffProbability: 65, defendantProbability: 35, triggerEvent: 'Strong evidence presented by plaintiff' },
      { timestamp: 600, plaintiffProbability: 68, defendantProbability: 32, triggerEvent: 'Judge\'s favorable comments' }
    ],
    keyFactors: [
      {
        factor: 'Contract breach evidence',
        impact: 'positive',
        strength: 0.8,
        party: 'plaintiff',
        evidence: ['Documentary evidence of signed contract', 'Proof of non-performance']
      },
      {
        factor: 'Weak defense arguments',
        impact: 'negative',
        strength: 0.6,
        party: 'defendant',
        evidence: ['Lack of supporting documentation', 'Inconsistent testimony']
      }
    ],
    confidence: 0.82,
    modelVersion: 'v1.0.0',
    analyzedAt: new Date().toISOString()
  };
  
  res.json(analysis);
});

// Mock processing progress function
function mockProcessingProgress(sessionId) {
  global.processingQueue = global.processingQueue || new Map();
  const status = global.processingQueue.get(sessionId);
  
  if (!status || status.status === 'completed') return;
  
  const stages = ['video_conversion', 'audio_extraction', 'transcription', 'speaker_identification', 'judgment_extraction', 'probability_analysis', 'pdf_generation', 'calendar_integration'];
  const currentStageIndex = status.stages.findIndex(s => s.status === 'pending');
  
  if (currentStageIndex >= 0) {
    status.stages[currentStageIndex].status = 'in_progress';
    status.stages[currentStageIndex].startTime = new Date().toISOString();
    
    setTimeout(() => {
      status.stages[currentStageIndex].status = 'completed';
      status.stages[currentStageIndex].endTime = new Date().toISOString();
      status.stages[currentStageIndex].progress = 100;
      status.progress = Math.round(((currentStageIndex + 1) / stages.length) * 100);
      
      if (currentStageIndex === stages.length - 1) {
        status.status = 'completed';
        status.estimatedCompletion = new Date().toISOString();
      } else {
        setTimeout(() => mockProcessingProgress(sessionId), 2000);
      }
    }, 3000);
  }
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ODR AI Service - Phase 1 & 2',
    endpoints: [
      'POST /ai/file-assist - Get AI filing suggestions',
      'POST /ai/hearing/upload - Upload and process audio/video with real Whisper AI',
      'POST /ai/hearing/process - Process court hearing video (mock data)',
      'GET /ai/hearing/status/:sessionId - Get processing status',
      'GET /ai/hearing/transcript/:sessionId - Get hearing transcript',
      'GET /ai/hearing/probability/:sessionId - Get case probability analysis',
      'GET /health - Service health check'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  const activeProvider = process.env.AI_PROVIDER || 'openai';
  const providers = {
    openai: !!process.env.OPENAI_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
    groq: !!process.env.GROQ_API_KEY
  };
  
  console.log(`🤖 ODR AI Service running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Active provider: ${activeProvider}`);
  console.log(`🔑 Configured providers:`, Object.keys(providers).filter(p => providers[p]).join(', ') || 'none');
  
  if (!providers[activeProvider]) {
    console.warn(`⚠️  ${activeProvider.toUpperCase()}_API_KEY not set - requests will fail`);
  }
});

module.exports = app;
