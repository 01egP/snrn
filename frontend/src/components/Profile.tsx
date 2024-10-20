import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserData } from '../interfaces/user';

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
    <div>
      <h1>Profile</h1>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
    </div>
  );
};

export default Profile;
