const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'exp://192.168.29.168:8084'],
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

// MongoDB connection (optional for testing)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/odr-platform';

// Try to connect to MongoDB, but don't fail if it's not available
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.log('⚠️ MongoDB not available - running without database');
  console.log('   Some features may not work without MongoDB');
});

// Basic API routes (temporary)
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Basic working routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ODR Backend API is running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Try to load routes if they exist
try {
  if (require('fs').existsSync('./routes/auth.js')) {
    app.use('/api/auth', require('./routes/auth'));
    console.log('✅ Auth routes loaded');
  }
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

