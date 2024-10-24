import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import './Register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [modalIsOpen, setModalIsOpen] = useState(true);
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
        `${process.env.REACT_APP_API_URL}auth/register`,
        formData,
      );
      const { access_token } = response.data;

      localStorage.setItem('token', access_token);

      navigate('/profile');
      setModalIsOpen(false);
    } catch (error) {
      setError('Error during registration. Please try again.');
      console.error('Error during registration', error);
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
            Register
          </button>
          <button
            type="button"
            className="reset-btn"
            onClick={() => setModalIsOpen(false)}
          >
            Close
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default Register;
