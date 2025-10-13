const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite database
const db = new Database(path.join(dbDir, 'odr.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const createTables = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK (role IN ('user', 'mediator', 'admin')),
      isActive BOOLEAN DEFAULT 1,
      phone TEXT,
      address TEXT,
      dateOfBirth DATE,
      avatar TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Mediators table
  db.exec(`
    CREATE TABLE IF NOT EXISTS mediators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      specialization TEXT, -- JSON array stored as text
      experience INTEGER NOT NULL DEFAULT 0,
      rating REAL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
      isAvailable BOOLEAN DEFAULT 1,
      phone TEXT,
      address TEXT,
      bio TEXT,
      avatar TEXT,
      certifications TEXT, -- JSON array stored as text
      languages TEXT, -- JSON array stored as text
      casesHandled INTEGER DEFAULT 0,
      successRate REAL DEFAULT 0 CHECK (successRate >= 0 AND successRate <= 100),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Cases table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL CHECK (category IN ('civil', 'criminal', 'family', 'commercial', 'labor', 'other')),
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved', 'closed')),
      priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
      assignedMediatorId INTEGER,
      documents TEXT, -- JSON array stored as text
      timeline TEXT, -- JSON array stored as text
      resolution TEXT,
      resolvedAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assignedMediatorId) REFERENCES mediators(id)
    )
    `);

  // Case parties junction table
  db.exec(`
    CREATE TABLE IF NOT EXISTS case_parties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      caseId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      role TEXT DEFAULT 'party' CHECK (role IN ('party', 'witness', 'observer')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (caseId) REFERENCES cases(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(caseId, userId)
    )
  `);

  // AI analysis results table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_analysis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      caseId INTEGER,
      analysisType TEXT NOT NULL CHECK (analysisType IN ('case', 'document', 'hearing', 'settlement')),
      data TEXT NOT NULL, -- JSON data stored as text
      confidence REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (caseId) REFERENCES cases(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_mediators_email ON mediators(email);
    CREATE INDEX IF NOT EXISTS idx_mediators_specialization ON mediators(specialization);
    CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
    CREATE INDEX IF NOT EXISTS idx_cases_category ON cases(category);
    CREATE INDEX IF NOT EXISTS idx_case_parties_caseId ON case_parties(caseId);
    CREATE INDEX IF NOT EXISTS idx_case_parties_userId ON case_parties(userId);
    CREATE INDEX IF NOT EXISTS idx_ai_analysis_caseId ON ai_analysis(caseId);
  `);
};

// Initialize database
createTables();

// Helper functions for JSON handling
const jsonHelper = {
  parse: (jsonString) => {
    try {
      return jsonString ? JSON.parse(jsonString) : null;
    } catch (error) {
      console.error('JSON parse error:', error);
      return null;
    }
  },
  stringify: (obj) => {
    try {
      return obj ? JSON.stringify(obj) : null;
    } catch (error) {
      console.error('JSON stringify error:', error);
      return null;
    }
  }
};

module.exports = {
  db,
  jsonHelper
};
