import axios from 'axios';

// TODO: Replace with your actual API URL from a configuration file
const API_URL = 'http://localhost:5000/api'; // Example API URL

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  role: 'member' | 'admin';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  // You might also get user data back, which you can add here
  user: { id: string; name: string; email: string; role: 'member' | 'admin' };
}

const register = async (userData: RegistrationData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // The backend should send a meaningful error message
      throw new Error(error.response.data.message || 'An error occurred during registration.');
    }
    // Handle other errors like network issues
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

const login = async (credentials: LoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Invalid email or password.');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

const authService = {
  register,
  login,
};

export default authService;
