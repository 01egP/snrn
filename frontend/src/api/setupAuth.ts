import axios from 'axios';

// Attach the JWT saved at login/registration to every API request.
// The backend protects all CRUD routes with a JWT guard.
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
