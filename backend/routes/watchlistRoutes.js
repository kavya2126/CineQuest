const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Movie = require('../models/Movie');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Get the logged-in user's watchlist
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('watchlist');
    res.json(user ? user.watchlist : []);
  } catch (error) {
    res.status(500).json({ message: 'Could not load watchlist' });
  }
});

// Add a movie to My List
router.post('/:movieId', verifyToken, async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.watchlist.some(id => id.equals(movie._id))) {
      user.watchlist.push(movie._id);
      await user.save();
    }

    res.json({ message: 'Movie added to My List' });
  } catch (error) {
    res.status(500).json({ message: 'Could not add movie' });
  }
});

// Remove a movie from My List
router.delete('/:movieId', verifyToken, async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.watchlist = user.watchlist.filter(
      id => !id.equals(movieId)
    );

    await user.save();
    res.json({ message: 'Movie removed from My List' });
  } catch (error) {
    res.status(500).json({ message: 'Could not remove movie' });
  }
});

module.exports = router;