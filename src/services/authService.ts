import api from './api';

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
  password2: string;
}) => {
  try {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login/', { username, password });
    const { access, refresh } = response.data;
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    
    return true;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async (refreshToken: string) => {
  try {
    await api.post('/auth/logout/', { refresh_token: refreshToken });
    return true;
  } catch (error) {
    throw error;
  }
};