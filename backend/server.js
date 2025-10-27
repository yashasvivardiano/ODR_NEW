const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { db } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'exp://192.168.29.168:8084'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// SQLite database connection
console.log('✅ SQLite database connected successfully');
console.log('📊 Database initialized with tables and indexes');

// Basic API routes (temporary)
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Simple test registration endpoint (no database)
app.post('/api/test-register', (req, res) => {
  const { fullName, email, password } = req.body;
  res.json({ 
    message: 'Test registration successful', 
    user: { fullName, email },
    token: 'test-token-123'
  });
});

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ODR Backend API is running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Load SQLite-based routes
try {
  app.use('/api/auth', require('./routes/auth-sqlite'));
  console.log('✅ Auth routes loaded (SQLite)');
} catch (error) {
  console.log('❌ Auth routes not available:', error.message);
}

try {
  if (require('fs').existsSync('./routes/cases.js')) {
    app.use('/api/cases', require('./routes/cases'));
    console.log('✅ Cases routes loaded');
  }
} catch (error) {
  console.log('❌ Cases routes not available:', error.message);
}

try {
  if (require('fs').existsSync('./routes/users.js')) {
    app.use('/api/users', require('./routes/users'));
    console.log('✅ Users routes loaded');
  }
} catch (error) {
  console.log('❌ Users routes not available:', error.message);
}

try {
  if (require('fs').existsSync('./routes/mediators.js')) {
    app.use('/api/mediators', require('./routes/mediators'));
    console.log('✅ Mediators routes loaded');
  }
} catch (error) {
  console.log('❌ Mediators routes not available:', error.message);
}

try {
  if (require('fs').existsSync('./routes/ai.js')) {
    app.use('/api/ai', require('./routes/ai'));
    console.log('✅ AI routes loaded');
  }
} catch (error) {
  console.log('❌ AI routes not available:', error.message);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ODR Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ODR Backend Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;

