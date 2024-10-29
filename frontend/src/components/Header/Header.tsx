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
          <li>
            <Link to="/">Home</Link>
          </li>
          {user ? (
            <>
              <li>
                <button onClick={onLogout}>Logout</button>
              </li>
              <li>
                <span>{user}</span>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
