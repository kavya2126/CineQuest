const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const API_URL = `${API_BASE_URL}/api/watchlist`;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('CineQuestToken')}`,
  'Content-Type': 'application/json',
});

// Get the user's My List
export const getWatchlist = async () => {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to load My List');
  }

  return response.json();
};

// Add a movie to My List
export const addToWatchlist = async (movieId) => {
  const response = await fetch(`${API_URL}/${movieId}`, {
    method: 'POST',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to add movie');
  }

  return response.json();
};

// Remove a movie from My List
export const removeFromWatchlist = async (movieId) => {
  const response = await fetch(`${API_URL}/${movieId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to remove movie');
  }

  return response.json();
};