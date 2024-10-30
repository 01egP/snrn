import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Home/Home';
import UserComponent from './components/UserComponent';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import Header from './components/Header/Header';
import NotFound from './components/NotFound';
import MainMenu from './components/MainMenu/MainMenu';
import Modal from 'react-modal';
import Dashboard from './components/Dashboard/Dashboard';
import Transactions from './components/Transactions/Transactions';
import Settings from './components/Settings/Settings';
import Reports from './components/Reports/Reports';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';

const App: React.FC = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleLoginSuccess = (userName: string) => {
    setUser(userName);
    closeModal();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <button
        className={`burger-menu ${isSidebarOpen ? 'hidden' : ''}`}
        onClick={toggleSidebar}
      >
        &#9776; {/* Symbol for burger-menu */}
      </button>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Routes>
        <Route
          path="/"
          element={<Home onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/user" element={<UserComponent />} />
        <Route
          path="/main-menu"
          element={
            <ProtectedRoute>
              <MainMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Modal
        isOpen={isLoginModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <Login
          onSwitchToRegister={openRegisterModal}
          onClose={closeModal}
          onLoginSuccess={handleLoginSuccess}
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
    </>
  );
};

export default App;
