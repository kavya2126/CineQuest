
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/movies';

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
      Authorization: `Bearer ${localStorage.getItem('cinequistToken')}`,
    },
  };

  const response = await axios.post(API_URL, movieData, config);
  return response.data;
};

export const updateMovie = async (movieId, movieData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('cinequistToken')}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/${movieId}`,
    movieData,
    config
  );
  return response.data;
};

export const deleteMovie = async (movieId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('cinequistToken')}`,
    },
  };

  const response = await axios.delete(`${API_URL}/${movieId}`, config);
  return response.data;
};