const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Movie = require('../models/Movie');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Get the logged-in user's watch history
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('watchHistory.movie');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.watchHistory);
  } catch (error) {
    res.status(500).json({ message: 'Could not load watch history' });
  }
});

// Add a watched movie to history
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

    // Remove the previous entry if the movie was already watched
    user.watchHistory = user.watchHistory.filter(
      item => !item.movie.equals(movie._id)
    );

    // Add the latest viewing at the beginning
    user.watchHistory.unshift({
      movie: movie._id,
      watchedAt: new Date(),
    });

    await user.save();

    res.json({ message: 'Watch history updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Could not update watch history' });
  }
});

module.exports = router;