import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserComponent = () => {
  const [users, setUsers] = useState([]); // Initial state as an empty array

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}users`)
      .then(response => {
        // Ensure data is an array before setting state
        setUsers(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      });
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
}

export default UserComponent;
