import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Movie API
export const movieAPI = {
  getAll: () => api.get('/movies'),
  getById: (id) => api.get(`/movies/${id}`),
  getUpcoming: () => api.get('/movies/upcoming'),
  search: (query) => api.get(`/movies/search?query=${query}`),
  filter: (filters) => api.post('/movies/filter', filters),
  create: (data) => api.post('/movies', data),
  update: (id, data) => api.put(`/movies/${id}`, data),
  delete: (id) => api.delete(`/movies/${id}`),
};

// Theater API
export const theaterAPI = {
  getAll: () => api.get('/theaters'),
  getCities: () => api.get('/theaters/cities'),
  getByCity: (city) => api.get(`/theaters/city/${city}`),
  getById: (id) => api.get(`/theaters/${id}`),
  create: (data) => api.post('/theaters', data),
  update: (id, data) => api.put(`/theaters/${id}`, data),
  delete: (id) => api.delete(`/theaters/${id}`),
};

// Show API
export const showAPI = {
  getByMovie: (movieId, city) => api.get(`/shows/movie/${movieId}?city=${city}`),
  getAvailableDates: (movieId) => api.get(`/shows/movie/${movieId}/dates`),
  getByTheater: (theaterId, date) => api.get(`/shows/theater/${theaterId}?date=${date}`),
  getById: (id) => api.get(`/shows/${id}`),
  getSeatLayout: (showId) => api.get(`/shows/${showId}/seats`),
  create: (data) => api.post('/shows', data),
  bookSeats: (showId, data) => api.post(`/shows/${showId}/book-seats`, data),
};

// Booking API
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getUserBookings: () => api.get('/bookings/my-bookings'),
  getBookingHistory: () => api.get('/bookings/my-bookings/history'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, data) => api.post(`/bookings/${id}/cancel`, data),
  getTickets: (id) => api.get(`/bookings/${id}/tickets`),
};

// Payment API
export const paymentAPI = {
  initiate: (data) => api.post('/payments/initiate', data),
  verify: (data) => api.post('/payments/verify', data),
  getDetails: (id) => api.get(`/payments/${id}`),
  refund: (id, data) => api.post(`/payments/${id}/refund`, data),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.post('/users/change-password', data),
  getWishlist: () => api.get('/users/wishlist'),
  addToWishlist: (movieId) => api.post(`/users/wishlist/${movieId}`),
  removeFromWishlist: (movieId) => api.delete(`/users/wishlist/${movieId}`),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  getBookingReports: (params) => api.get('/admin/reports/bookings', { params }),
  getRevenueReports: (params) => api.get('/admin/reports/revenue', { params }),
};

// Seat API (alias for showAPI)
export const seatAPI = {
  getLayout: (showId) => showAPI.getSeatLayout(showId),
};

export default api;