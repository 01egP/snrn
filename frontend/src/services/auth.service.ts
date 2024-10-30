import axios from 'axios';

interface LoginResponse {
  access_token: string;
  name: string;
}

const API_URL = `${process.env.REACT_APP_API_URL}auth/login`;

export const AuthService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(API_URL, {
      email,
      password,
    });
    return response.data;
  },
};
