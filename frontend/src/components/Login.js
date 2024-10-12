import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}auth/login`,
        formData,
      );
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      console.log('Login successful');
    } catch (error) {
      console.error('Error during login', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
