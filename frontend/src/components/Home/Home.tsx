import React, { useState } from 'react';
import Modal from 'react-modal';
import Login from '../Login/Login';
import Register from '../Register/Register';
import './Home.css';

Modal.setAppElement('#root');

const Home: React.FC = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const openLoginModal = () => {
    setLoginModalOpen(true);
    setRegisterModalOpen(false);
  };

  const openRegisterModal = () => {
    setRegisterModalOpen(true);
    setLoginModalOpen(false);
  };

  const closeModal = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(false);
  };

  return (
    <div className="home-container">
      <h1>Welcome to Our App</h1>
      <p>Please log in to access your profile and more features.</p>
      <button onClick={openLoginModal} className="login-link">
        Go to Login
      </button>

      <Modal
        isOpen={isLoginModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <Login onSwitchToRegister={openRegisterModal} onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={isRegisterModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <Register onSwitchToLogin={openLoginModal} onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default Home;
