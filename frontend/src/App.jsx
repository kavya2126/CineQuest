
import { useEffect, useMemo, useState } from 'react';
import Login from './Login';
import { getMovies } from './services/movieService';
import './App.css';
import Admin from './Admin';

import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from './services/watchlistService';

import {
  addToWatchHistory,
  getWatchHistory,
} from './services/watchHistoryService';

const languages = [
  'All Languages',
  'English',
  'Tamil',
  'Malayalam',
  'Telugu',
  'Kannada',
  'Hindi',
];

function getGenres(movie) {
  return Array.isArray(movie.genre)
    ? movie.genre
    : [movie.genre || ''];
}

// Extract YouTube video ID from common YouTube URL formats
function getYouTubeVideoId(url) {
  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.hostname === 'youtu.be' ||
      parsedUrl.hostname.endsWith('.youtu.be')
    ) {
      return parsedUrl.pathname.slice(1).split('/')[0];
    }

    if (parsedUrl.pathname.includes('/embed/')) {
      return parsedUrl.pathname.split('/embed/')[1].split('/')[0];
    }

    if (parsedUrl.pathname.includes('/shorts/')) {
      return parsedUrl.pathname.split('/shorts/')[1].split('/')[0];
    }

    if (parsedUrl.pathname.includes('/live/')) {
      return parsedUrl.pathname.split('/live/')[1].split('/')[0];
    }

    return parsedUrl.searchParams.get('v');
  } catch {
    return null;
  }
}

function MovieRow({
  title,
  subtitle,
  movies,
  watchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onTrailerWatched,
}) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerStarted, setTrailerStarted] = useState(false);
  const [movieStarted, setMovieStarted] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const closeModal = () => {
    setSelectedMovie(null);
    setTrailerStarted(false);
    setMovieStarted(false);
    setHistoryLoading(false);
  };

  const openMovieDetails = (movie) => {
    setSelectedMovie(movie);
    setTrailerStarted(false);
    setMovieStarted(false);
  };

  // Save movie to Watch History and play the trailer
  const handlePlayTrailer = async () => {
    if (!selectedMovie || historyLoading) return;

    const videoId = getYouTubeVideoId(selectedMovie.trailerUrl);

    if (!videoId) {
      alert('Invalid YouTube trailer URL.');
      return;
    }

    setHistoryLoading(true);

    try {
      await addToWatchHistory(selectedMovie._id);

      if (onTrailerWatched) {
        onTrailerWatched(selectedMovie);
      }

      setTrailerStarted(true);
      setMovieStarted(false);
    } catch (error) {
      console.error('Could not save watch history:', error);
      alert('Could not save Watch History. Please try again.');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Save movie to Watch History and play the actual movie video
  const handlePlayMovie = async () => {
    if (!selectedMovie || historyLoading) return;

    const videoId = getYouTubeVideoId(selectedMovie.videoUrl);

    if (!videoId) {
      alert('Invalid YouTube movie URL. Please check the Video URL in Admin Panel.');
      return;
    }

    setHistoryLoading(true);

    try {
      await addToWatchHistory(selectedMovie._id);

      if (onTrailerWatched) {
        onTrailerWatched(selectedMovie);
      }

      setMovieStarted(true);
      setTrailerStarted(false);
    } catch (error) {
      console.error('Could not save Watch History:', error);
      alert('Could not save Watch History. Please try again.');
    } finally {
      setHistoryLoading(false);
    }
  };

  if (!movies.length) return null;

  return (
    <section className="movie-section">
      <div className="section-heading">
        <div>
          {subtitle && <p className="section-label">{subtitle}</p>}
          <h2>{title} <span className="heading-arrow">›</span></h2>
        </div>
        <span className="row-hint">Explore all <span>›</span></span>
      </div>

      <div className="movie-row">
        {movies.map((movie, index) => (
          <article className="movie-card" key={movie._id || movie.title}>
            <button
              className="poster-wrapper"
              onClick={() => openMovieDetails(movie)}
              aria-label={`View details for ${movie.title}`}
            >
              <div className="poster-placeholder">
                <span className="placeholder-logo">CQ</span>
                <span className="placeholder-title">{movie.title}</span>
              </div>

              {movie.posterUrl && (
                <img
                  className="movie-poster"
                  src={movie.posterUrl}
                  alt={`${movie.title} poster`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
              )}

              <span className="poster-rank">
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="poster-play">▶</span>
            </button>

            <button
              className="watchlist-button"
              onClick={() =>
                watchlist.some((item) => item._id === movie._id)
                  ? onRemoveFromWatchlist(movie._id)
                  : onAddToWatchlist(movie)
              }
            >
              {watchlist.some((item) => item._id === movie._id)
                ? '✓ Added to My List'
                : '+ Add to My List'}
            </button>

            <div className="movie-info">
              <h3>{movie.title}</h3>

              <div className="movie-meta">
                <span>{movie.releaseYear || 'New'}</span>
                <span className="meta-dot">•</span>
                <span>{movie.language || 'Movie'}</span>
              </div>

              <p className="movie-genres">
                {getGenres(movie).join(' · ')}
              </p>
            </div>
          </article>
        ))}
      </div>

      {selectedMovie && (
        <div
          className="modal-backdrop"
          onClick={closeModal}
          role="presentation"
        >
          <section
            className="movie-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedMovie.title} details`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close movie details"
            >
              ×
            </button>

            {selectedMovie.backdropUrl && (
              <img
                className="modal-backdrop-image"
                src={selectedMovie.backdropUrl}
                alt=""
              />
            )}

            <div className="modal-content">
              <p className="section-label">CINEQUIST MOVIE DETAILS</p>

              <h2>{selectedMovie.title}</h2>

              <p className="modal-meta">
                {selectedMovie.releaseYear} · {selectedMovie.language}
                {selectedMovie.rating
                  ? ` · ★ ${selectedMovie.rating}/10`
                  : ''}
              </p>

              <p>
                {selectedMovie.description ||
                  'Discover this movie on CineQuist.'}
              </p>

              <div className="modal-movie-details">
                {selectedMovie.duration > 0 && (
                  <p>
                    <strong>Duration:</strong> {selectedMovie.duration} minutes
                  </p>
                )}

                {selectedMovie.director && (
                  <p>
                    <strong>Director:</strong> {selectedMovie.director}
                  </p>
                )}

                {selectedMovie.cast?.length > 0 && (
                  <p>
                    <strong>Cast:</strong> {selectedMovie.cast.join(', ')}
                  </p>
                )}
              </div>

              <p className="movie-genres">
                {getGenres(selectedMovie).join(' · ')}
              </p>

              {/* WATCH TRAILER */}
              {selectedMovie.trailerUrl && (
                <div className="modal-trailer-section">
                  <h3>Watch Trailer</h3>

                  {!trailerStarted ? (
                    <button
                      className="button button-primary"
                      onClick={handlePlayTrailer}
                      disabled={historyLoading}
                    >
                      {historyLoading
                        ? 'Saving to Watch History...'
                        : '▶ Play Trailer'}
                    </button>
                  ) : (
                    <div className="trailer-player">
                      {getYouTubeVideoId(selectedMovie.trailerUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                            selectedMovie.trailerUrl
                          )}?autoplay=1`}
                          title={`${selectedMovie.title} trailer`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <p>Invalid YouTube trailer URL.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* WATCH MOVIE */}
              {selectedMovie.videoUrl && (
                <div className="modal-trailer-section">
                  <h3>Watch Movie</h3>

                  {!movieStarted ? (
                    <button
                      className="button button-primary"
                      onClick={handlePlayMovie}
                      disabled={historyLoading}
                    >
                      {historyLoading
                        ? 'Saving to Watch History...'
                        : '▶ Watch Movie'}
                    </button>
                  ) : (
                    <div className="trailer-player">
                      {getYouTubeVideoId(selectedMovie.videoUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                            selectedMovie.videoUrl
                          )}?autoplay=1`}
                          title={`${selectedMovie.title} movie`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <p>Invalid YouTube movie URL.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [watchlist, setWatchlist] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError('');

        const data = await getMovies();
        setMovies(data);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
        setError('Unable to load movies. Check that your backend is running.');
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const savedMovies = await getWatchlist();
        setWatchlist(savedMovies);
      } catch (error) {
        console.error('Error loading My List:', error);
      }
    };

    if (localStorage.getItem('cinequistToken')) {
      loadWatchlist();
    }
  }, []);

  // Load Watch History from MongoDB
  useEffect(() => {
    const loadWatchHistory = async () => {
      try {
        const history = await getWatchHistory();
        setWatchHistory(history);
      } catch (error) {
        console.error('Error loading Watch History:', error);
      }
    };

    if (localStorage.getItem('cinequistToken')) {
      loadWatchHistory();
    }
  }, []);

  // Update Watch History immediately after starting a video
  const handleTrailerWatched = (movie) => {
    setWatchHistory((previous) => [
      {
        movie,
        watchedAt: new Date().toISOString(),
      },
      ...previous.filter(
        (item) => item.movie?._id !== movie._id
      ),
    ]);
  };

  const handleAddToWatchlist = async (movie) => {
    try {
      await addToWatchlist(movie._id);

      setWatchlist((previous) => [...previous, movie]);
      alert('Movie added to My List!');
    } catch (error) {
      alert('Could not add movie to My List.');
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await removeFromWatchlist(movieId);

      setWatchlist((previous) =>
        previous.filter((movie) => movie._id !== movieId)
      );

      alert('Movie removed from My List!');
    } catch (error) {
      alert('Could not remove movie from My List.');
    }
  };

  const visibleMovies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return movies.filter((movie) => {
      const matchesLanguage =
        selectedLanguage === 'All Languages' ||
        (movie.language || '').toLowerCase() ===
          selectedLanguage.toLowerCase();

      const matchesSearch =
        !query ||
        (movie.title || '').toLowerCase().includes(query);

      const genres = getGenres(movie).map((genre) =>
        genre.toLowerCase()
      );

      const matchesGenre =
        selectedGenre === 'All Genres' ||
        genres.includes(selectedGenre.toLowerCase());

      return matchesLanguage && matchesSearch && matchesGenre;
    });
  }, [movies, selectedLanguage, searchQuery, selectedGenre]);

  const availableGenres = useMemo(() => {
    const genres = movies.flatMap((movie) => getGenres(movie));

    return [
      'All Genres',
      ...new Set(
        genres
          .filter(Boolean)
          .map((genre) => genre.trim())
          .filter(
            (genre) =>
              genre.toLowerCase() !== 'all genres'
          )
      ),
    ];
  }, [movies]);

  const featuredMovie = useMemo(
    () =>
      visibleMovies.find((movie) => movie.featured) ||
      visibleMovies[0],
    [visibleMovies]
  );

  const trendingMovies = visibleMovies;

  const romanticComedies = visibleMovies.filter((movie) => {
    const genres = getGenres(movie).join(' ').toLowerCase();

    return (
      genres.includes('romance') ||
      genres.includes('rom-com') ||
      genres.includes('romcom')
    );
  });

  const comedyMovies = visibleMovies.filter((movie) =>
    getGenres(movie).some((genre) =>
      /comedy/i.test(genre)
    )
  );

  const popularMovies = [...visibleMovies].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0)
  );

  const tamilMovies = visibleMovies.filter(
    (movie) => movie.language?.toLowerCase() === 'tamil'
  );

  const malayalamMovies = visibleMovies.filter(
    (movie) => movie.language?.toLowerCase() === 'malayalam'
  );

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const token = localStorage.getItem('cinequistToken');

  const savedUser = JSON.parse(
    localStorage.getItem('cinequistUser') || 'null'
  );

  if (!token && window.location.pathname !== '/login') {
    window.location.replace('/login');
    return null;
  }

  if (window.location.pathname === '/login') {
    return <Login />;
  }

  if (window.location.pathname === '/admin') {
    if (savedUser?.role !== 'admin') {
      window.location.replace('/');
      return null;
    }

    return <Admin />;
  }

  return (
    <div className="app" id="home">
      <header className="navbar">
        <a className="logo" href="#home">CINEQUIST</a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#my-list">My List</a>
          <a href="#watch-history">Watch History</a>
          <a href="#trending">Trending</a>
          <a href="#romcom">Rom-Coms</a>
          <a href="#language-rows">Languages</a>
          <a href="#popular">Popular</a>

          {savedUser?.role === 'admin' && (
            <a href="/admin">Admin</a>
          )}
        </nav>

        <div className={`catalog-search ${searchQuery ? 'search-active' : ''}`}>
          <button
            type="button"
            className="search-icon"
            aria-label="Open movie search"
            onClick={() =>
              document.getElementById('movie-search-input')?.focus()
            }
          >
            ⌕
          </button>

          <input
            id="movie-search-input"
            type="search"
            placeholder="Titles, people, genres"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Search movies by title"
          />

          {searchQuery && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="nav-right">
          <label className="nav-language" htmlFor="language-select">
            <span>Language</span>

            <select
              id="language-select"
              value={selectedLanguage}
              onChange={(event) =>
                setSelectedLanguage(event.target.value)
              }
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>

          <button className="profile-button" aria-label="Profile">
            K
          </button>

          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem('cinequistToken');
              localStorage.removeItem('cinequistUser');
              window.location.replace('/login');
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {loading ? (
        <main className="status-screen">
          <div className="loading-mark">CQ</div>
          <p>Finding your next favourite movie...</p>
        </main>
      ) : error ? (
        <main className="status-screen">
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button
            className="button button-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </main>
      ) : visibleMovies.length === 0 ? (
        <main className="status-screen">
          <h2>No movies found</h2>
          <p>
            There are no movies for {selectedLanguage} yet.
            Choose another language or add movies to your database.
          </p>
        </main>
      ) : (
        <main>
          <section
            className="hero"
            style={
              featuredMovie?.backdropUrl
                ? {
                    backgroundImage: `linear-gradient(90deg, #101010 0%, rgba(16,16,16,.82) 35%, rgba(16,16,16,.18) 100%), linear-gradient(0deg, #101010 0%, transparent 45%), url("${featuredMovie.backdropUrl}")`,
                  }
                : featuredMovie?.posterUrl
                  ? {
                      backgroundImage: `linear-gradient(90deg, #101010 0%, rgba(16,16,16,.82) 40%, rgba(16,16,16,.2) 100%), linear-gradient(0deg, #101010 0%, transparent 45%), url("${featuredMovie.posterUrl}")`,
                    }
                  : undefined
            }
          >
            <div className="hero-content">
              <p className="eyebrow">
                <span className="hero-brand-mark">CQ</span>
                CINEQUIST FEATURED
              </p>

              <h1>{featuredMovie?.title || 'YOUR NEXT STORY'}</h1>

              <div className="hero-meta">
                <span className="match-label">Recommended</span>
                <span>{featuredMovie?.releaseYear}</span>
                <span>{featuredMovie?.language}</span>

                {featuredMovie?.rating > 0 && (
                  <span>★ {featuredMovie.rating}/10</span>
                )}
              </div>

              <p className="hero-description">
                {featuredMovie?.description ||
                  'Discover extraordinary worlds and unforgettable stories.'}
              </p>

              <div className="hero-buttons">
                <button
                  className="button button-primary"
                  onClick={() => scrollTo('trending')}
                >
                  <span>▶</span> Explore Movies
                </button>

                <button
                  className="button button-secondary"
                  onClick={() => scrollTo('popular')}
                >
                  More Info
                </button>
              </div>
            </div>

            <div className="hero-bottom-fade" />
            <span className="hero-side-label">
              YOUR NEXT MOVIE NIGHT STARTS HERE
            </span>
          </section>

          <div className="catalog">
            <div className="catalog-intro">
              <div>
                <p className="section-label">MADE FOR MOVIE LOVERS</p>
                <h2>Explore your world of cinema<span>.</span></h2>
              </div>

              <p className="catalog-count">
                {visibleMovies.length}{' '}
                {visibleMovies.length === 1 ? 'TITLE' : 'TITLES'}
              </p>
            </div>

            <div
              className="genre-filter-bar"
              aria-label="Filter movies by genre"
            >
              {availableGenres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  className={`genre-filter-button ${
                    selectedGenre === genre ? 'active' : ''
                  }`}
                  onClick={() => setSelectedGenre(genre)}
                  aria-pressed={selectedGenre === genre}
                >
                  {genre}
                </button>
              ))}
            </div>

            <div id="my-list">
              <MovieRow
                title="My List"
                subtitle="YOUR SAVED MOVIES"
                movies={watchlist}
                watchlist={watchlist}
                onAddToWatchlist={handleAddToWatchlist}
                onRemoveFromWatchlist={handleRemoveFromWatchlist}
                onTrailerWatched={handleTrailerWatched}
              />
            </div>

            <div id="watch-history">
              <MovieRow
                title="Watch History"
                subtitle="VIDEOS YOU HAVE STARTED"
                movies={watchHistory
                  .map((item) => item.movie)
                  .filter(Boolean)}
                watchlist={watchlist}
                onAddToWatchlist={handleAddToWatchlist}
                onRemoveFromWatchlist={handleRemoveFromWatchlist}
                onTrailerWatched={handleTrailerWatched}
              />
            </div>

            <div id="trending">
              <MovieRow
                title="Trending Now"
                subtitle="WHAT EVERYONE IS WATCHING"
                movies={trendingMovies}
                watchlist={watchlist}
                onAddToWatchlist={handleAddToWatchlist}
                onRemoveFromWatchlist={handleRemoveFromWatchlist}
                onTrailerWatched={handleTrailerWatched}
              />
            </div>

            <div id="romcom">
              <MovieRow
                title="Romantic Comedies"
                subtitle="LOVE, LAUGHTER & HAPPY ACCIDENTS"
                movies={romanticComedies}
                watchlist={watchlist}
                onAddToWatchlist={handleAddToWatchlist}
                onRemoveFromWatchlist={handleRemoveFromWatchlist}
                onTrailerWatched={handleTrailerWatched}
              />
            </div>

            <div id="language-rows">
              {selectedLanguage === 'All Languages' && (
                <>
                  <MovieRow
                    title="Tamil Movies"
                    subtitle="FROM TAMIL CINEMA"
                    movies={tamilMovies}
                    watchlist={watchlist}
                    onAddToWatchlist={handleAddToWatchlist}
                    onRemoveFromWatchlist={handleRemoveFromWatchlist}
                    onTrailerWatched={handleTrailerWatched}
                  />

                  <MovieRow
                    title="Malayalam Movies"
                    subtitle="FROM MALAYALAM CINEMA"
                    movies={malayalamMovies}
                    watchlist={watchlist}
                    onAddToWatchlist={handleAddToWatchlist}
                    onRemoveFromWatchlist={handleRemoveFromWatchlist}
                    onTrailerWatched={handleTrailerWatched}
                  />
                </>
              )}
            </div>

            <MovieRow
              title="Comedy Collection"
              subtitle="LIGHTEN THE MOOD"
              movies={comedyMovies}
              watchlist={watchlist}
              onAddToWatchlist={handleAddToWatchlist}
              onRemoveFromWatchlist={handleRemoveFromWatchlist}
              onTrailerWatched={handleTrailerWatched}
            />

            <div id="popular">
              <MovieRow
                title="Popular on CineQuist"
                subtitle="YOUR COLLECTION, RANKED"
                movies={popularMovies}
                watchlist={watchlist}
                onAddToWatchlist={handleAddToWatchlist}
                onRemoveFromWatchlist={handleRemoveFromWatchlist}
                onTrailerWatched={handleTrailerWatched}
              />
            </div>

            <section className="membership-strip">
              <div className="membership-mark">CQ<span>✳</span></div>

              <div>
                <p className="section-label">THE CINEQUIST EXPERIENCE</p>
                <h2>Every story deserves a screen.</h2>
                <p>
                  Discover films across languages, genres, and worlds.
                </p>
              </div>

              <button
                className="button button-secondary"
                onClick={() => scrollTo('home')}
              >
                Back to top ↑
              </button>
            </section>
          </div>

          <footer className="footer">
            <a className="logo footer-logo" href="#home">CINEQUIST</a>
            <p>Your screen. Your stories. Your world.</p>
            <p className="copyright">
              © 2026 CineQuist · Student Project
            </p>
          </footer>
        </main>
      )}
    </div>
  );
}

export default App;