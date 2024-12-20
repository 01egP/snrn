import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../interfaces/user';

const UserComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the users!', error);
      });
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} | ({user.email}) | ({user.role})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserComponent;
