import axios from 'axios';

const api = axios.create({
  baseURL: 'https://claims-site.onrender.com/api', 
  // For local version, you would use:
  // baseURL: 'http://localhost:5001/api',
  // For deployed version, you would use:
  // baseURL: 'https://claims-site.onrender.com/api',
});

// REQUEST INTERCEPTOR: Runs BEFORE every request is sent
api.interceptors.request.use(
  (config) => {
    // 1. Get the user object from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    
    // 2. If the user and token exist, add the Authorization header
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Runs AFTER every response is received
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // If the error is a 401 Unauthorized, the token is bad.
    // Automatically log the user out.
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;