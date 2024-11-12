import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './components/Home/Home';
import UserComponent from './components/UserComponent';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile/Profile';
import Header from './components/Header/Header';
import NotFound from './components/NotFound';
import MainMenu from './components/MainMenu/MainMenu';
import Modal from 'react-modal';
import Dashboard from './components/Dashboard/Dashboard';
import Transactions from './components/Transactions/Transactions';
import Settings from './components/Settings/Settings';
import Reports from './components/Reports/Reports';
import Sidebar from './components/Sidebar/Sidebar';
import { useUser } from './contexts/UserContext';
import './App.css';

const App: React.FC = () => {
  const { user, setUser } = useUser();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleLoginSuccess = (userData: any) => {
    const { name, access_token } = userData;
    setUser(name);
    localStorage.setItem('user', JSON.stringify(name));
    localStorage.setItem('token', access_token);
    closeModal();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(storedUser);
    }
  }, [setUser]);

  return (
    <>
      <Header
        user={user}
        onLogout={handleLogout}
        onLoginClick={openLoginModal}
      />
      {location.pathname !== '/' && (
        <button
          className={`burger-menu ${isSidebarOpen ? 'hidden' : ''}`}
          onClick={toggleSidebar}
        >
          &#9776;
        </button>
      )}
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
