const express = require('express');
const Mediator = require('../models/Mediator');

const router = express.Router();

// Get all mediators
router.get('/', async (req, res) => {
  try {
    const mediators = await Mediator.find();
    res.json(mediators);
  } catch (error) {
    console.error('Get mediators error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get mediator by ID
router.get('/:id', async (req, res) => {
  try {
    const mediatorId = req.params.id;
    const mediator = await Mediator.findById(mediatorId);
    
    if (!mediator) {
      return res.status(404).json({ message: 'Mediator not found' });
    }

    res.json(mediator);
  } catch (error) {
    console.error('Get mediator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new mediator
router.post('/', async (req, res) => {
  try {
    const { name, email, specialization, experience, rating } = req.body;

    const newMediator = new Mediator({
      name,
      email,
      specialization,
      experience,
      rating: rating || 0,
      isAvailable: true,
      createdAt: new Date()
    });

    await newMediator.save();
    res.status(201).json(newMediator);
  } catch (error) {
    console.error('Create mediator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update mediator
router.put('/:id', async (req, res) => {
  try {
    const mediatorId = req.params.id;
    const updates = req.body;

    const updatedMediator = await Mediator.findByIdAndUpdate(
      mediatorId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedMediator) {
      return res.status(404).json({ message: 'Mediator not found' });
    }

    res.json(updatedMediator);
  } catch (error) {
    console.error('Update mediator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete mediator
router.delete('/:id', async (req, res) => {
  try {
    const mediatorId = req.params.id;
    const deletedMediator = await Mediator.findByIdAndDelete(mediatorId);

    if (!deletedMediator) {
      return res.status(404).json({ message: 'Mediator not found' });
    }

    res.json({ message: 'Mediator deleted successfully' });
  } catch (error) {
    console.error('Delete mediator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

