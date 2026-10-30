const API_URL = 'http://localhost:5000/api/watch-history';

const getToken = () => localStorage.getItem('cinequistToken');

// Get the user's watch history
export const getWatchHistory = async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Could not load watch history');
  }

  return response.json();
};

// Add a movie to watch history
export const addToWatchHistory = async (movieId) => {
  const response = await fetch(`${API_URL}/${movieId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Could not update watch history');
  }

  return response.json();
};