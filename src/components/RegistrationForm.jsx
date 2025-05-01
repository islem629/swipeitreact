import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const RegistrationForm = ({ onUserRegistered }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8081/api/users', userData);
      onUserRegistered(response.data.idUser, {
        name: userData.name,
        email: userData.email
      });
      navigate('/skills');
    } catch (error) {
      if (error.response?.status === 409) {
        setError('Email already registered');
        setUserData(prev => ({ ...prev, email: '' }));
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Create Account</h2>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="Enter your name"
            value={userData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Create password"
            value={userData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>
        
        <button 
          type="submit" 
          className="primary-btn"
          disabled={!userData.name || !userData.email || !userData.password}
        >
          Register
        </button>

        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;