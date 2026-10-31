
import axios from 'axios';

// Uses the deployed backend URL in production
// and localhost during local development.
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const API_URL = `${API_BASE_URL}/api/movies`;

// Get all movies
export const getMovies = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get movies by language
export const getMoviesByLanguage = async (language) => {
  const response = await axios.get(API_URL);

  if (language === 'All Languages') {
    return response.data;
  }

  return response.data.filter(
    (movie) => movie.language === language
  );
};

// Add a new movie
export const addMovie = async (movieData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('CineQuestToken')}`,
    },
  };

  const response = await axios.post(API_URL, movieData, config);
  return response.data;
};

// Update a movie
export const updateMovie = async (movieId, movieData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('CineQuestToken')}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/${movieId}`,
    movieData,
    config
  );

  return response.data;
};

// Delete a movie
export const deleteMovie = async (movieId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('CineQuestToken')}`,
    },
  };

  const response = await axios.delete(`${API_URL}/${movieId}`, config);
  return response.data;
};