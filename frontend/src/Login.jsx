
import { useState } from 'react';
import { loginUser, registerUser } from './services/authService';
import './Login.css';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      if (isRegister) {
        await registerUser({ name, email, password });
        setMessage('Account created! Please log in.');
        setIsRegister(false);
        setPassword('');
      } else {
        const data = await loginUser({ email, password });

        localStorage.setItem('CineQuestToken', data.token);
        localStorage.setItem('CineQuestUser', JSON.stringify(data.user));

        window.location.href = '/';
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <a className="login-logo" href="/">CineQuest</a>

      <section className="login-card">
        <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
        <p className="login-subtitle">
          {isRegister
            ? 'Join CineQuest and discover your next favourite movie.'
            : 'Sign in to continue your cinematic journey.'}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (minimum 6 characters)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />

          {message && <p className="login-message" role="status">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : isRegister
                ? 'Create Account'
                : 'Sign In'}
          </button>
        </form>

        <p className="login-switch">
          {isRegister ? 'Already have an account?' : 'New to CineQuest?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage('');
            }}
          >
            {isRegister ? 'Sign in' : 'Register now'}
          </button>
        </p>
      </section>
    </main>
  );
}

export default Login;
