// ODR AI Backend Server - Phase 1
// Real OpenAI integration for /ai/file-assist endpoint

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

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

// OpenAI integration
async function callOpenAI(prompt, model = 'gpt-4o-mini') {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a legal intake assistant for an Online Dispute Resolution platform in India. Return ONLY valid JSON responses.'
        },
        {
          role: 'user',
          content: prompt
        }
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

// Main AI endpoint
app.post('/ai/file-assist', async (req, res) => {
  const startTime = Date.now();
  const requestId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const { prompt, model = 'gpt-4o-mini', temperature = 0.1, max_tokens = 1500 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        error: 'Missing required field: prompt',
        requestId
      });
    }

    console.log(`[${requestId}] AI request started`);
    
    // Call OpenAI
    const aiResponse = await callOpenAI(prompt, model);
    
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
    if (error.message.includes('OPENAI_API_KEY')) {
      return res.status(500).json({
        error: 'AI service configuration error',
        requestId
      });
    }
    
    if (error.message.includes('OpenAI API error')) {
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
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      openai: !!process.env.OPENAI_API_KEY
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ODR AI Service - Phase 1',
    endpoints: [
      'POST /ai/file-assist - Get AI filing suggestions',
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
  console.log(`🤖 ODR AI Service running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 OpenAI configured: ${!!process.env.OPENAI_API_KEY}`);
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY not set - requests will fail');
  }
});

module.exports = app;
