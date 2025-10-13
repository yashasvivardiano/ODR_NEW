const { db, jsonHelper } = require('../../config/database');

class Case {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.status = data.status || 'pending';
    this.priority = data.priority || 'medium';
    this.assignedMediatorId = data.assignedMediatorId;
    this.documents = jsonHelper.parse(data.documents) || [];
    this.timeline = jsonHelper.parse(data.timeline) || [];
    this.resolution = data.resolution;
    this.resolvedAt = data.resolvedAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create a new case
  static async create(caseData) {
    const stmt = db.prepare(`
      INSERT INTO cases (title, description, category, status, priority, assignedMediatorId, documents, timeline, resolution, resolvedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      caseData.title,
      caseData.description,
      caseData.category,
      caseData.status || 'pending',
      caseData.priority || 'medium',
      caseData.assignedMediatorId || null,
      jsonHelper.stringify(caseData.documents || []),
      jsonHelper.stringify(caseData.timeline || []),
      caseData.resolution || null,
      caseData.resolvedAt || null
    );
    
    return this.findById(result.lastInsertRowid);
  }

  // Find case by ID
  static async findById(id) {
    const stmt = db.prepare('SELECT * FROM cases WHERE id = ?');
    const caseData = stmt.get(id);
    return caseData ? new Case(caseData) : null;
  }

  // Find all cases with optional filters
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM cases WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.priority) {
      query += ' AND priority = ?';
      params.push(filters.priority);
    }

    if (filters.assignedMediatorId) {
      query += ' AND assignedMediatorId = ?';
      params.push(filters.assignedMediatorId);
    }

    query += ' ORDER BY createdAt DESC';

    const stmt = db.prepare(query);
    const cases = stmt.all(...params);
    return cases.map(caseData => new Case(caseData));
  }

  // Find cases by user ID (through case_parties table)
  static async findByUserId(userId) {
    const stmt = db.prepare(`
      SELECT c.*, cp.role as partyRole 
      FROM cases c 
      JOIN case_parties cp ON c.id = cp.caseId 
      WHERE cp.userId = ?
      ORDER BY c.createdAt DESC
    `);
    const cases = stmt.all(userId);
    return cases.map(caseData => new Case(caseData));
  }

  // Update case
  async update(updateData) {
    const allowedFields = ['title', 'description', 'category', 'status', 'priority', 'assignedMediatorId', 'documents', 'timeline', 'resolution', 'resolvedAt'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        if (['documents', 'timeline'].includes(key)) {
          updates.push(`${key} = ?`);
          values.push(jsonHelper.stringify(value));
        } else {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
    }

    if (updates.length === 0) return this;

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(this.id);

    const stmt = db.prepare(`UPDATE cases SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return Case.findById(this.id);
  }

  // Delete case
  async delete() {
    const stmt = db.prepare('DELETE FROM cases WHERE id = ?');
    stmt.run(this.id);
    return true;
  }

  // Add party to case
  async addParty(userId, role = 'party') {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO case_parties (caseId, userId, role)
      VALUES (?, ?, ?)
    `);
    stmt.run(this.id, userId, role);
    return true;
  }

  // Remove party from case
  async removeParty(userId) {
    const stmt = db.prepare('DELETE FROM case_parties WHERE caseId = ? AND userId = ?');
    stmt.run(this.id, userId);
    return true;
  }

  // Get case parties
  async getParties() {
    const stmt = db.prepare(`
      SELECT u.*, cp.role as partyRole
      FROM case_parties cp
      JOIN users u ON cp.userId = u.id
      WHERE cp.caseId = ?
    `);
    return stmt.all(this.id);
  }

  // Add timeline entry
  async addTimelineEntry(action, description, userId) {
    const timelineEntry = {
      action,
      description,
      timestamp: new Date().toISOString(),
      userId
    };
    
    const currentTimeline = this.timeline || [];
    currentTimeline.push(timelineEntry);
    
    await this.update({ timeline: currentTimeline });
    return timelineEntry;
  }

  // Add document
  async addDocument(name, url) {
    const document = {
      name,
      url,
      uploadedAt: new Date().toISOString()
    };
    
    const currentDocuments = this.documents || [];
    currentDocuments.push(document);
    
    await this.update({ documents: currentDocuments });
    return document;
  }

  // Get assigned mediator
  async getAssignedMediator() {
    if (!this.assignedMediatorId) return null;
    
    const Mediator = require('./Mediator');
    return await Mediator.findById(this.assignedMediatorId);
  }

  // Get case statistics
  static async getStatistics() {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as totalCases,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingCases,
        SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as inProgressCases,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolvedCases,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closedCases
      FROM cases
    `);
    return stmt.get();
  }
}

module.exports = Case;
