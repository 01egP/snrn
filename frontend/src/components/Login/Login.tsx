import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Login.css';

// Set the main application element for the modal window
Modal.setAppElement('#root');

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}auth/login`,
        formData,
      );
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      console.log('Login successful');
      setModalIsOpen(false); // Close the modal window upon successful login
    } catch (error) {
      console.error('Error during login', error);
    }
  };

  return (
    <>
      <button className="open-modal-btn" onClick={() => setModalIsOpen(true)}>
        Login
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
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
              Login
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setModalIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Login;
