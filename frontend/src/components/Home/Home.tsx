import React, { useState } from 'react';
import Modal from 'react-modal';
import Login from '../Login/Login';
import Register from '../Register/Register';
import './Home.css';

Modal.setAppElement('#root');

interface HomeProps {
  onLoginSuccess: (userName: string) => void;
}

const Home: React.FC<HomeProps> = ({ onLoginSuccess }) => {
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
      <div className="home-content">
        <h1>Welcome to Our Financial App</h1>
        <p>Manage your finances smarter and easier.</p>

        <div className="features">
          <div className="feature-item">
            <span role="img" aria-label="money">
              💸
            </span>
            <h3>Track Expenses</h3>
            <p>Stay on top of your expenses and optimize your budget.</p>
          </div>
          <div className="feature-item">
            <span role="img" aria-label="chart">
              📊
            </span>
            <h3>Analyze Spending</h3>
            <p>Gain insights into where your money goes each month.</p>
          </div>
          <div className="feature-item">
            <span role="img" aria-label="goal">
              🎯
            </span>
            <h3>Set Financial Goals</h3>
            <p>Plan and achieve your financial objectives with ease.</p>
          </div>
        </div>

        <button onClick={openLoginModal} className="login-link">
          Log in
        </button>
        <button onClick={openRegisterModal} className="register-link">
          Sign up
        </button>
      </div>

      <Modal
        isOpen={isLoginModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <Login
          onSwitchToRegister={openRegisterModal}
          onClose={closeModal}
          onLoginSuccess={onLoginSuccess}
        />
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
