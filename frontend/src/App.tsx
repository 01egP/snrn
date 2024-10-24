import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import UserComponent from './components/UserComponent';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import Modal from 'react-modal';

const App: React.FC = () => {
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
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserComponent />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/user" element={<UserComponent />} />
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>

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
    </Router>
  );
};

export default App;
