import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './MainMenu.css';

const MainMenu: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="main-menu">
      <header className="main-header"></header>
      <button className="burger-menu" onClick={toggleSidebar}>
        &#9776; {/* Symbol for burger-menu */}
      </button>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="content">
        <h2>Main Content</h2>
        <p>Here you can manage your finances, view reports, and much more!</p>
      </main>
    </div>
  );
};

export default MainMenu;
