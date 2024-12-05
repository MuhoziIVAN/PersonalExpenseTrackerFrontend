import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'https://personalexpensetrackerbackend-3htl.onrender.com';

const axiosInstance = axios.create({
  baseURL: 'https://personalexpensetrackerbackend-3htl.onrender.com',
  withCredentials: true,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }, // Set content type to JSON
});

const handleApiError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
  throw new Error(errorMessage);
};

const authService = {
  login: async (username, password) => {
    try {
      console.log('Login attempt:', { username, password });
      const response = await axiosInstance.post('/login', {
        username: username,
        password: password,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  signup: async (userData) => {
    try {
      const response = await axiosInstance.post('/signup', userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post('/logout');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  profile:async function getUserProfile() {
    const response = await fetch('https://personalexpensetrackerfrontend.onrender.com/profile', {
        credentials: 'include', // Include cookies for authentication
    });
    if (!response.ok) {
        throw new Error('Failed to fetch profile');
    }
    return await response.json();
}
};

export default authService;
