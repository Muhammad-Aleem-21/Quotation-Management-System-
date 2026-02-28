import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
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

// Quotation Submission
export const submitQuotation = (data) => API.post('/quotations', data);
export const updateQuotation = (id, data) => API.put(`/quotations/${id}`, data);
export const resubmitQuotation = (id, data) => API.post(`/quotations/${id}/resubmit`, data);
export const submitDraftQuotation = (id, data) => API.post(`/quotations/${id}/submit`, data);
export const getQuotations = () => API.get('/quotations');
export const generateQuotationPdf = (id) => API.post(`/quotations/${id}/generate-pdf`, {}, { responseType: 'blob', headers: { 'Accept': 'application/pdf' } });

// Client Management
export const getClients = () => API.get('/clients');
export const createClient = (data) => API.post('/clients', data);

// Product & Category Management
export const getCategories = () => API.get('/admin/categories');
export const createCategory = (data) => API.post('/admin/categories', data);
export const getProducts = () => API.get('/products');
export const createProduct = (data) => API.post('/admin/products', data);
export const getVariantTypes = () => API.get('/admin/variant-types');
export const getVariantOptions = () => API.get('/admin/variant-options');
export const getProductPriceMatrix = (productId) => API.get(`/admin/products/${productId}/price-matrix`);
export const setProductPriceMatrix = (productId, data) => API.post(`/admin/products/${productId}/price-matrix`, data);

// Core Types
export const getCoreTypes = () => API.get('/admin/core-types');
export const createCoreType = (data) => API.post('/admin/core-types', data);

// Catalog APIs (for Salesperson/Manager)
export const getCatalogCategories = () => API.get('/catalog/categories');
export const getCatalogCoreTypes = () => API.get('/catalog/core-types');

export default API;
