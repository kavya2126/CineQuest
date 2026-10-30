const API_URL = 'http://localhost:5000/api/watchlist';

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('cinequistToken')}`,
  'Content-Type': 'application/json',
});

export const getWatchlist = async () => {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to load My List');
  return response.json();
};

export const addToWatchlist = async (movieId) => {
  const response = await fetch(`${API_URL}/${movieId}`, {
    method: 'POST',
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to add movie');
  return response.json();
};

export const removeFromWatchlist = async (movieId) => {
  const response = await fetch(`${API_URL}/${movieId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to remove movie');
  return response.json();
};