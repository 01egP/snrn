import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        &times; {/* Symbol for the close button */}
      </button>
      <nav>
        <ul>
          <li>
            <Link to="/main-menu" onClick={toggleSidebar}>
              Main Menu
            </Link>
          </li>
          <li>
            <Link to="/dashboard" onClick={toggleSidebar}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/transactions" onClick={toggleSidebar}>
              Transactions
            </Link>
          </li>
          <li>
            <Link to="/profile" onClick={toggleSidebar}>
              Profile
            </Link>
          </li>
          <li>
            <Link to="/settings" onClick={toggleSidebar}>
              Settings
            </Link>
          </li>
          <li>
            <Link to="/reports" onClick={toggleSidebar}>
              Reports
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
