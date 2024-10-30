import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Home/Home';
import UserComponent from './components/UserComponent';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import Header from './components/Header/Header';
import NotFound from './components/NotFound';
import Modal from 'react-modal';
import { CategoryService } from './services/category.service';
import { BudgetService } from './services/budget.service';
import { TransactionService } from './services/transaction.service';

const App: React.FC = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchData = async () => {
      await CategoryService.getCategories();
      await BudgetService.getBudgets();
      await TransactionService.getTransactions();
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={<Home onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/user" element={<UserComponent />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
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
