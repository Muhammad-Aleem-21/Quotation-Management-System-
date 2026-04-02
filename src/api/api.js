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
    // Skip token for password reset endpoints to avoid CORS/Auth issues on public routes
    const isPublicRoute = config.url.includes('/password/');
    
    const token = localStorage.getItem("token");
    if (token && !isPublicRoute) {
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
export const markQuotationAsSent = (id) => API.post(`/quotations/${id}/mark-sent`);

export const getPriceMatrix = (productId) => {
  return API.get(`/admin/products/${productId}/price-matrix`);
};

// ADD THIS:
export const getCatalogPriceMatrix = (productId) => {
  return API.get(`/products/${productId}/price-matrix`);
};

// Client Management
export const getClients = () => API.get('/clients');
export const createClient = (data) => API.post('/clients', data);

// Product & Category Management
export const getCategories = () => API.get('/admin/categories');
export const createCategory = (data) => API.post('/admin/categories', data);
export const getProducts = () => API.get('/products');
export const createProduct = (data) => API.post('/admin/products', data);
export const updateProduct = (id, data) => API.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/admin/products/${id}`);
export const getVariantTypes = () => API.get('/admin/variant-types');
export const getVariantOptions = () => API.get('/admin/variant-options');
export const getProductPriceMatrix = (productId) => API.get(`/admin/products/${productId}/price-matrix`);
export const setProductPriceMatrix = (productId, data) => API.post(`/admin/products/${productId}/price-matrix`, data);
export const bulkUpdateProductPrices = (data) => API.post('/admin/products/bulk-update', data);
//////
// export const createPriceMatrix = (productId, entries) =>
//   axios.post(`/api/admin/products/${productId}/price-matrix`, { prices: entries });
///////

// Core Types
export const getCoreTypes = () => API.get('/admin/core-types');
export const createCoreType = (data) => API.post('/admin/core-types', data);
// Use this endpoint for ALL roles
export const getAllCoreTypes = () => {
  return API.get(`/catalog/core-types`);
};

// Catalog APIs (for Salesperson/Manager)
export const getCatalogCategories = () => API.get('/catalog/categories');
export const getCatalogCoreTypes = () => API.get('/catalog/core-types');

// Notification APIs
export const getNotifications = () => API.get('/notifications');
export const getNotificationStats = () => API.get('/notifications/stats');
export const markNotificationRead = (id) => API.post(`/notifications/${id}/mark-read`, {});
export const markAllNotificationsRead = () => API.post('/notifications/mark-all-read', {});
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);
export const clearAllNotifications = () => API.delete('/notifications/clear-all');

// Duplicate Quotation Alerts
export const getDuplicateAlerts = (page = 1) => API.get('/notifications/duplicate-alerts', { params: { page } });
export const forceSubmitQuotation = (data) => API.post('/quotations', { ...data, force_submit: true });

// Password Reset APIs (Using clean axios with explicit Accept header to match Postman)
export const forgotPassword = (email) => 
    axios.post('/api/password/forgot', { email }, { headers: { 'Accept': 'application/json' } });

export const verifyResetToken = (data) => 
    axios.post('/api/password/verify-token', data, { headers: { 'Accept': 'application/json' } });

export const resetPassword = (data) => 
    axios.post('/api/password/reset', data, { headers: { 'Accept': 'application/json' } });

export default API;

