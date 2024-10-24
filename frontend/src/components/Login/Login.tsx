import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}auth/login`,
        formData,
      );
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      navigate('/profile');
      console.log('Login successful');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
      console.error('Error during login', error);
    }
  };

  const handleReset = () => {
    setFormData({ email: '', password: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-btn">
          Sign in
        </button>
        <button type="button" className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>
      <button
        type="button"
        className="signup-btn"
        onClick={() => navigate('/register')}
      >
        No accounts? Sign up
      </button>
    </form>
  );
};

export default Login;
