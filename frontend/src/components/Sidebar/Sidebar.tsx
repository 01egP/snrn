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
            <Link to="/budget" onClick={toggleSidebar}>
              Budget
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
