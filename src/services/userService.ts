import api from './api';

export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (profileData: FormData) => {
  try {
    const response = await api.put('/auth/profile/update/', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};