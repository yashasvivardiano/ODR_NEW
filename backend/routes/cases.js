const express = require('express');
const { body, validationResult } = require('express-validator');
const Case = require('../models/Case');

const router = express.Router();

// Get all cases
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find().populate('parties', 'fullName email');
    res.json(cases);
  } catch (error) {
    console.error('Get cases error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get case by ID
router.get('/:id', async (req, res) => {
  try {
    const caseId = req.params.id;
    const caseData = await Case.findById(caseId).populate('parties', 'fullName email');
    
    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(caseData);
  } catch (error) {
    console.error('Get case error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new case
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, parties } = req.body;

    const newCase = new Case({
      title,
      description,
      category,
      parties: parties || [],
      status: 'pending',
      createdAt: new Date()
    });

    await newCase.save();
    res.status(201).json(newCase);
  } catch (error) {
    console.error('Create case error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update case
router.put('/:id', async (req, res) => {
  try {
    const caseId = req.params.id;
    const updates = req.body;

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(updatedCase);
  } catch (error) {
    console.error('Update case error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete case
router.delete('/:id', async (req, res) => {
  try {
    const caseId = req.params.id;
    const deletedCase = await Case.findByIdAndDelete(caseId);

    if (!deletedCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    console.error('Delete case error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

