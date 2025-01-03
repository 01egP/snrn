import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { AuthService } from '../../services/auth.service';

interface LoginProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: (userData: any) => void;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({
  onSwitchToRegister,
  onLoginSuccess,
  onClose,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

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
      const response = await AuthService.login(
        formData.email,
        formData.password,
      );
      onLoginSuccess(response);
      navigate('/main-menu');
      onClose();
    } catch (error) {
      setError('Invalid email or password. Please try again.');
      console.error('Error during login', error);
    }
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
        <button
          type="button"
          className="switch-btn"
          onClick={onSwitchToRegister}
        >
          No account? Sign up
        </button>
      </div>
    </form>
  );
};

export default Login;
