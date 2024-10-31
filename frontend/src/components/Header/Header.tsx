import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  user: string | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Financial App</Link>
      </div>
      <nav>
        <ul>
          {user ? (
            <>
              <li>
                <span>Welcome, {user}!</span>
              </li>
              <li>
                <button onClick={onLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/">Login</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
