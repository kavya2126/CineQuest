
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');

// GET: Retrieve all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Retrieve one movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ message: 'Invalid movie ID' });
  }
});

// POST: Add a new movie
router.post('/', verifyToken, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Update a movie by ID
router.put('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Remove a movie by ID
router.delete('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid movie ID' });
  }
});

module.exports = router;