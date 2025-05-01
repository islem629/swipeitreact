import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const LoginForm = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8081/api/users/login', credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Validate response structure
      if (!response.data?.userId || !response.data?.email || !response.data?.name) {
        throw new Error('Invalid server response format');
      }

      // Update parent component state
      onLogin(response.data.userId, {
        email: response.data.email,
        name: response.data.name
      });

      // Redirect to profile page
      navigate('/profile');

    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        setError(error.response.data?.message || 'Login failed');
      } else {
        setError(error.message || 'An error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Login</h2>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder="Your email"
            value={credentials.email}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            placeholder="Your password"
            value={credentials.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>

        <button 
          type="submit" 
          className="primary-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;