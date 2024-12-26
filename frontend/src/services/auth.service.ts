import axios from 'axios';

interface LoginResponse {
  access_token: string;
  name: string;
}
interface User {
  name: string;
  role: string;
  id: string;
}
interface RegisterResponse {
  access_token: string;
  user: User;
}

const API_URL = `${process.env.REACT_APP_API_URL}auth/`;

export const AuthService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const login_URL = `${API_URL}login`;
    const response = await axios.post<LoginResponse>(login_URL, {
      email,
      password,
    });
    return response.data;
  },
  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<RegisterResponse> {
    const register_URL = `${API_URL}register`;
    const response = await axios.post<RegisterResponse>(register_URL, {
      name,
      email,
      password,
    });
    return response.data;
  },
};
