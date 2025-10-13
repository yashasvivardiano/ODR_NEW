const { db, jsonHelper } = require('../../config/database');

class User {
  constructor(data) {
    this.id = data.id;
    this.fullName = data.fullName;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'user';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.phone = data.phone;
    this.address = data.address;
    this.dateOfBirth = data.dateOfBirth;
    this.avatar = data.avatar;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create a new user
  static async create(userData) {
    const stmt = db.prepare(`
      INSERT INTO users (fullName, email, password, role, isActive, phone, address, dateOfBirth, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      userData.fullName,
      userData.email,
      userData.password,
      userData.role || 'user',
      userData.isActive !== undefined ? (userData.isActive ? 1 : 0) : 1,
      userData.phone || null,
      userData.address || null,
      userData.dateOfBirth || null,
      userData.avatar || null
    );
    
    return this.findById(result.lastInsertRowid);
  }

  // Find user by ID
  static async findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id);
    return user ? new User(user) : null;
  }

  // Find user by email
  static async findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);
    return user ? new User(user) : null;
  }

  // Find all users with optional filters
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    if (filters.role) {
      query += ' AND role = ?';
      params.push(filters.role);
    }

    if (filters.isActive !== undefined) {
      query += ' AND isActive = ?';
      params.push(filters.isActive);
    }

    query += ' ORDER BY createdAt DESC';

    const stmt = db.prepare(query);
    const users = stmt.all(...params);
    return users.map(user => new User(user));
  }

  // Update user
  async update(updateData) {
    const allowedFields = ['fullName', 'email', 'password', 'role', 'isActive', 'phone', 'address', 'dateOfBirth', 'avatar'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) return this;

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(this.id);

    const stmt = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return User.findById(this.id);
  }

  // Delete user
  async delete() {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(this.id);
    return true;
  }

  // Convert to JSON (exclude password)
  toJSON() {
    const user = { ...this };
    delete user.password;
    return user;
  }

  // Get user's cases
  async getCases() {
    const stmt = db.prepare(`
      SELECT c.*, cp.role as partyRole 
      FROM cases c 
      JOIN case_parties cp ON c.id = cp.caseId 
      WHERE cp.userId = ?
      ORDER BY c.createdAt DESC
    `);
    return stmt.all(this.id);
  }
}

module.exports = User;
