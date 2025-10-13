const { db, jsonHelper } = require('../../config/database');

class Mediator {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.specialization = jsonHelper.parse(data.specialization) || [];
    this.experience = data.experience || 0;
    this.rating = data.rating || 0;
    this.isAvailable = data.isAvailable !== undefined ? data.isAvailable : true;
    this.phone = data.phone;
    this.address = data.address;
    this.bio = data.bio;
    this.avatar = data.avatar;
    this.certifications = jsonHelper.parse(data.certifications) || [];
    this.languages = jsonHelper.parse(data.languages) || [];
    this.casesHandled = data.casesHandled || 0;
    this.successRate = data.successRate || 0;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create a new mediator
  static async create(mediatorData) {
    const stmt = db.prepare(`
      INSERT INTO mediators (name, email, specialization, experience, rating, isAvailable, phone, address, bio, avatar, certifications, languages, casesHandled, successRate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      mediatorData.name,
      mediatorData.email,
      jsonHelper.stringify(mediatorData.specialization || []),
      mediatorData.experience || 0,
      mediatorData.rating || 0,
      mediatorData.isAvailable !== undefined ? mediatorData.isAvailable : true,
      mediatorData.phone || null,
      mediatorData.address || null,
      mediatorData.bio || null,
      mediatorData.avatar || null,
      jsonHelper.stringify(mediatorData.certifications || []),
      jsonHelper.stringify(mediatorData.languages || []),
      mediatorData.casesHandled || 0,
      mediatorData.successRate || 0
    );
    
    return this.findById(result.lastInsertRowid);
  }

  // Find mediator by ID
  static async findById(id) {
    const stmt = db.prepare('SELECT * FROM mediators WHERE id = ?');
    const mediator = stmt.get(id);
    return mediator ? new Mediator(mediator) : null;
  }

  // Find mediator by email
  static async findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM mediators WHERE email = ?');
    const mediator = stmt.get(email);
    return mediator ? new Mediator(mediator) : null;
  }

  // Find all mediators with optional filters
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM mediators WHERE 1=1';
    const params = [];

    if (filters.specialization) {
      query += ' AND specialization LIKE ?';
      params.push(`%"${filters.specialization}"%`);
    }

    if (filters.isAvailable !== undefined) {
      query += ' AND isAvailable = ?';
      params.push(filters.isAvailable);
    }

    if (filters.minRating) {
      query += ' AND rating >= ?';
      params.push(filters.minRating);
    }

    if (filters.minExperience) {
      query += ' AND experience >= ?';
      params.push(filters.minExperience);
    }

    query += ' ORDER BY rating DESC, experience DESC';

    const stmt = db.prepare(query);
    const mediators = stmt.all(...params);
    return mediators.map(mediator => new Mediator(mediator));
  }

  // Find mediators by specialization
  static async findBySpecialization(specialization) {
    const stmt = db.prepare('SELECT * FROM mediators WHERE specialization LIKE ? AND isAvailable = 1');
    const mediators = stmt.all(`%"${specialization}"%`);
    return mediators.map(mediator => new Mediator(mediator));
  }

  // Update mediator
  async update(updateData) {
    const allowedFields = ['name', 'email', 'specialization', 'experience', 'rating', 'isAvailable', 'phone', 'address', 'bio', 'avatar', 'certifications', 'languages', 'casesHandled', 'successRate'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        if (['specialization', 'certifications', 'languages'].includes(key)) {
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

    const stmt = db.prepare(`UPDATE mediators SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return Mediator.findById(this.id);
  }

  // Delete mediator
  async delete() {
    const stmt = db.prepare('DELETE FROM mediators WHERE id = ?');
    stmt.run(this.id);
    return true;
  }

  // Get mediator's cases
  async getCases() {
    const stmt = db.prepare(`
      SELECT * FROM cases 
      WHERE assignedMediatorId = ?
      ORDER BY createdAt DESC
    `);
    return stmt.all(this.id);
  }

  // Calculate match score for a case
  calculateMatchScore(caseCategory, caseComplexity, location) {
    let score = 0;
    
    // Specialization match (40% weight)
    if (this.specialization.includes(caseCategory)) {
      score += 40;
    }
    
    // Experience match (30% weight)
    const experienceScore = Math.min(this.experience * 3, 30);
    score += experienceScore;
    
    // Rating match (20% weight)
    const ratingScore = this.rating * 4;
    score += ratingScore;
    
    // Success rate match (10% weight)
    const successScore = this.successRate * 0.1;
    score += successScore;
    
    return Math.min(Math.round(score), 100);
  }
}

module.exports = Mediator;
