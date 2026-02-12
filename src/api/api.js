import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the bearer token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Structured API Methods
export const getAdminProfile = () => API.get('/profile');
export const getManagerProfile = () => API.get('/profile');
export const getSalespersonProfile = () => API.get('/profile');
export const getAllUsers = () => API.get('/users');
export const getTeamStats = () => API.get('/dashboard/stats');

export const createAdmin = (data) => API.post('/users/create-admin', data);
export const createManager = (data) => API.post('/users/create-manager', data);
export const createSalesperson = (data) => API.post('/users/create-salesperson', data);
export const getMyTeam = (role) => API.get('/users/my-team', { params: { role } });

export const logoutUser = () => API.post('/logout');

export default API;
