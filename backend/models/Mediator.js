const mongoose = require('mongoose');

const mediatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  specialization: [{
    type: String,
    enum: ['civil', 'criminal', 'family', 'commercial', 'labor', 'property', 'contract', 'other']
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  profile: {
    phone: String,
    address: String,
    bio: String,
    avatar: String,
    certifications: [String],
    languages: [String]
  },
  casesHandled: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mediator', mediatorSchema);

