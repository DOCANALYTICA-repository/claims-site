import axios from 'axios';

// The base URL of our backend API
const API_URL = `${import.meta.env.VITE_API_URL}/api/users/`;

// Login user function
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    // Axios puts the response from the server in a 'data' object.
    // If there's data, we save the user object (including the token) to localStorage.
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const authService = {
  login,
};

export default authService;