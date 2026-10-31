
import { useEffect, useState } from 'react';
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from './services/movieService';
import './Admin.css';

const emptyMovie = {
  title: '',
  description: '',
  genre: '',
  language: 'English',
  releaseYear: new Date().getFullYear(),
  posterUrl: '',
  backdropUrl: '',
  trailerUrl: '',
  videoUrl: '',
  duration: '',
  rating: 0,
  director: '',
  cast: '',
  featured: false,
};

function Admin() {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({ ...emptyMovie });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadMovies = async () => {
    try {
      setError('');
      const data = await getMovies();
      setMovies(data);
    } catch {
      setError('Could not load movies. Check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === 'checkbox'
          ? checked
          : ['releaseYear', 'duration', 'rating'].includes(name)
            ? value === '' ? '' : Number(value)
            : value,
    }));
  };

  const resetForm = () => {
    setFormData({ ...emptyMovie });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const movieData = {
      ...formData,
      genre: formData.genre
        .split(',')
        .map((genre) => genre.trim())
        .filter(Boolean),
      cast: formData.cast
        .split(',')
        .map((actor) => actor.trim())
        .filter(Boolean),
      releaseYear: Number(formData.releaseYear),
      duration: Number(formData.duration),
      rating: Number(formData.rating),
    };

    try {
      if (editingId) {
        await updateMovie(editingId, movieData);
        setMessage('Movie updated successfully!');
      } else {
        await addMovie(movieData);
        setMessage('Movie added successfully!');
      }

      resetForm();
      await loadMovies();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not save the movie. Check the required fields.'
      );
    }
  };

  const handleEdit = (movie) => {
    setEditingId(movie._id);
    setFormData({
      ...emptyMovie,
      ...movie,
      genre: Array.isArray(movie.genre)
        ? movie.genre.join(', ')
        : Array.isArray(movie.genres)
          ? movie.genres.join(', ')
          : movie.genre || '',
      cast: Array.isArray(movie.cast)
        ? movie.cast.join(', ')
        : movie.cast || '',
      director: movie.director || '',
    });
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (movie) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${movie.title}"?`
    );

    if (!confirmed) return;

    try {
      await deleteMovie(movie._id);
      setMessage(`"${movie.title}" deleted successfully!`);

      if (editingId === movie._id) {
        resetForm();
      }

      await loadMovies();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not delete this movie.'
      );
    }
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">CineQuest MANAGEMENT</p>
          <h1>Movie Admin Panel</h1>
          <p>Manage your cinema collection.</p>
        </div>

        <a href="/" className="admin-home-link">
          ← Back to Home
        </a>
      </header>

      {message && (
        <p className="admin-message" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      <section className="admin-form-section">
        <h2>{editingId ? 'Edit Movie' : 'Add New Movie'}</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Movie Title *
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Language *
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
            >
              {[
                'English',
                'Tamil',
                'Malayalam',
                'Telugu',
                'Kannada',
                'Hindi',
              ].map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>

          <label>
            Genres * (comma-separated)
            <input
              name="genre"
              placeholder="Action, Drama, Thriller"
              value={formData.genre}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Release Year *
            <input
              name="releaseYear"
              type="number"
              min="1888"
              max="2100"
              value={formData.releaseYear}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Rating (0–10)
            <input
              name="rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
            />
          </label>

          <label>
            Duration (minutes)
            <input
              name="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Director
            <input
              name="director"
              placeholder="Enter director name"
              value={formData.director}
              onChange={handleChange}
            />
          </label>

          <label>
            Cast (comma-separated)
            <input
              name="cast"
              placeholder="Actor 1, Actor 2, Actor 3"
              value={formData.cast}
              onChange={handleChange}
            />
          </label>

          <label className="admin-full-width">
            Description *
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <label className="admin-full-width">
            Poster Image URL *
            <input
              name="posterUrl"
              type="url"
              placeholder="https://..."
              value={formData.posterUrl}
              onChange={handleChange}
              required
            />
          </label>

          <label className="admin-full-width">
            Backdrop Image URL
            <input
              name="backdropUrl"
              type="url"
              placeholder="https://..."
              value={formData.backdropUrl}
              onChange={handleChange}
            />
          </label>

          <label className="admin-full-width">
            YouTube Trailer URL
            <input
              name="trailerUrl"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.trailerUrl}
              onChange={handleChange}
            />
          </label>

          <label className="admin-full-width">
            Video URL (optional)
            <input
              name="videoUrl"
              type="url"
              value={formData.videoUrl}
              onChange={handleChange}
            />
          </label>

          <label className="admin-checkbox">
            <input
              name="featured"
              type="checkbox"
              checked={Boolean(formData.featured)}
              onChange={handleChange}
            />
            Feature this movie on the homepage
          </label>

          <div className="admin-form-actions admin-full-width">
            <button type="submit" className="admin-primary-button">
              {editingId ? 'Save Changes' : 'Add Movie'}
            </button>

            {editingId && (
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-table-section">
        <h2>Movie Collection ({movies.length})</h2>

        {loading ? (
          <p>Loading movies...</p>
        ) : movies.length === 0 ? (
          <p>No movies found in your database.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Language</th>
                  <th>Year</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {movies.map((movie) => (
                  <tr key={movie._id}>
                    <td>
                      <div className="admin-movie-cell">
                        {movie.posterUrl && (
                          <img
                            src={movie.posterUrl}
                            alt=""
                          />
                        )}
                        <span>{movie.title}</span>
                      </div>
                    </td>
                    <td>{movie.language || '—'}</td>
                    <td>{movie.releaseYear || '—'}</td>
                    <td>{movie.rating ?? '—'}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          onClick={() => handleEdit(movie)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-delete-button"
                          onClick={() => handleDelete(movie)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Admin;