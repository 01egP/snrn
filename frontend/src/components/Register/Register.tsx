import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onClose }) => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [name, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    const userData = { name, email, password };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}auth/register`,
        userData,
      );
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', response.data.user.name);
      localStorage.setItem('role', response.data.user.role);
      localStorage.setItem('userID', response.data.user.id);
      setUser(response.data.user.name);
      onClose();
      navigate('/main-menu');
    } catch (error) {
      console.error('Error while registering:', error);
      setError('An error occurred while registering. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h2>Registration</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          {' '}
          <label htmlFor="name">User name</label>{' '}
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            required
          />{' '}
        </div>
        <div className="form-group">
          {' '}
          <label htmlFor="email">Email</label>{' '}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />{' '}
        </div>
        <div className="form-group">
          {' '}
          <label htmlFor="password">Password</label>{' '}
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message ">{error}</p>}
        <button type="submit">Register</button>
        <button type="button" onClick={onSwitchToLogin}>
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default Register;
