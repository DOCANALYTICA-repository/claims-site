import api from './api'; // Import our new api client

const API_URL = '/users/';

const login = async (userData) => {
  const response = await api.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const authService = {
  login,
};

export default authService;