import React from 'react';
import { Link } from 'react-router-dom';
import './MainMenu.css';

const MainMenu: React.FC = () => {
  return (
    <div className="main-menu">
      <h2>Main Menu</h2>
      <div className="menu-items">
        <Link to="/dashboard" className="menu-item">
          <div className="icon">📊</div>
          <span>Dashboard</span>
        </Link>
        <Link to="/transactions" className="menu-item">
          <div className="icon">💸</div>
          <span>Transactions</span>
        </Link>
        <Link to="/profile" className="menu-item">
          <div className="icon">👤</div>
          <span>Profile</span>
        </Link>
        <Link to="/settings" className="menu-item">
          <div className="icon">⚙️</div>
          <span>Settings</span>
        </Link>
        <Link to="/reports" className="menu-item">
          <div className="icon">📈</div>
          <span>Reports</span>
        </Link>
      </div>
    </div>
  );
};

export default MainMenu;
