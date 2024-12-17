import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { AuthService } from '../../services/auth.service';

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

    try {
      const response = await AuthService.register(name, email, password);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', response.user.name);
      localStorage.setItem('role', response.user.role);
      localStorage.setItem('userID', response.user.id);
      setUser(response.user.name);
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
