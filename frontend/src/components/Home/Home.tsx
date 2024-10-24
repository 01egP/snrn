import React, { useState } from 'react';
import Modal from 'react-modal';
import Login from '../Login/Login';
import './Home.css';

Modal.setAppElement('#root');

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="home-container">
      <h1>Welcome to Our App</h1>
      <p>Please log in to access your profile and more features.</p>
      <button onClick={openModal} className="login-link">
        Go to Login
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <Login />
      </Modal>
    </div>
  );
};

export default Home;
