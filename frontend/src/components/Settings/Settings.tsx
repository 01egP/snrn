import React from 'react';
import './Settings.css';

const Settings: React.FC = () => {
  return (
    <div className="settings-container">
      <h1>Settings</h1>

      <div className="settings-section">
        <h2>User Profile</h2>
        <div className="settings-item">
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" />
        </div>
        <div className="settings-item">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <div className="settings-item">
          <label>Password</label>
          <input type="password" placeholder="Enter a new password" />
        </div>
      </div>

      <div className="settings-section">
        <h2>Privacy Settings</h2>
        <div className="settings-item">
          <label>Two-factor Authentication</label>
          <input type="checkbox" />
        </div>
        <div className="settings-item">
          <label>Make Profile Private</label>
          <input type="checkbox" />
        </div>
      </div>

      <div className="settings-section">
        <h2>Notifications</h2>
        <div className="settings-item">
          <label>Email Notifications</label>
          <input type="checkbox" />
        </div>
        <div className="settings-item">
          <label>Push Notifications</label>
          <input type="checkbox" />
        </div>
      </div>

      <div className="settings-section">
        <h2>App Preferences</h2>
        <div className="settings-item">
          <label>Language</label>
          <select>
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
        <div className="settings-item">
          <label>Theme</label>
          <select>
            <option>Light</option>
            <option>Dark</option>
            <option>System Default</option>
          </select>
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-button">Save Changes</button>
        <button className="reset-button">Reset to Default</button>
      </div>
    </div>
  );
};

export default Settings;
