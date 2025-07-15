const express = require('express');
const Flashcard = require('../modals/Flashcard');
const isAuthenticated = require('../middlewares/isAuthenticated');

const router = express.Router();

// Create a flashcard
router.post('/', isAuthenticated, async (req, res) => {
  const { question, answer, tags } = req.body;
  try {
    const flashcard = new Flashcard({
      user: req.user._id,
      question,
      answer,
      tags,
    });
    await flashcard.save();
    res.status(201).json(flashcard);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all flashcards for the logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ user: req.user._id });
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single flashcard by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const flashcard = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
    if (!flashcard) return res.status(404).json({ message: 'Flashcard not found' });
    res.json(flashcard);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a flashcard
router.put('/:id', isAuthenticated, async (req, res) => {
  const { question, answer, tags } = req.body;
  try {
    const flashcard = await Flashcard.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { question, answer, tags },
      { new: true }
    );
    if (!flashcard) return res.status(404).json({ message: 'Flashcard not found' });
    res.json(flashcard);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a flashcard
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const flashcard = await Flashcard.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!flashcard) return res.status(404).json({ message: 'Flashcard not found' });
    res.json({ message: 'Flashcard deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 