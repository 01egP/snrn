import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserData } from '../../interfaces/user';
import './Profile.css';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching profile data', error);
      }
    };

    fetchData();
  }, []);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Welcome, {userData.name}!</h1>
        <p>Manage your profile and account settings here.</p>

        <div className="profile-info">
          <div className="info-item">
            <span role="img" aria-label="user">
              👤
            </span>
            <h3>Name</h3>
            <p>{userData.name}</p>
          </div>
          <div className="info-item">
            <span role="img" aria-label="email">
              📧
            </span>
            <h3>Email</h3>
            <p>{userData.email}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="edit-button">Edit Profile</button>
          <button className="settings-button">Account Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
