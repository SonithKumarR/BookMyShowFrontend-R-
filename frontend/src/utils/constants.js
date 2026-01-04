// API Constants
export const API_BASE_URL = 'http://localhost:8080/api';
export const WS_BASE_URL = 'http://localhost:8080/ws';

// Route Constants
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    MOVIE_DETAILS: '/movie/:id',
    BOOKING: '/booking/:showId',
    PAYMENT_SUCCESS: '/payment-success/:bookingId',
    PROFILE: '/profile',
    MY_TICKETS: '/my-tickets',
    ADMIN: '/admin',
    NOT_FOUND: '*'
};

// Payment Constants
export const PAYMENT_METHODS = {
    RAZORPAY: 'RAZORPAY',
    UPI: 'UPI',
    CARD: 'CARD',
    NETBANKING: 'NETBANKING',
    WALLET: 'WALLET'
};

export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED'
};

// Booking Constants
export const BOOKING_STATUS = {
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    EXPIRED: 'EXPIRED'
};

export const SEAT_TYPES = {
    CLASSIC: 'CLASSIC',
    PREMIUM: 'PREMIUM'
};

// User Roles
export const USER_ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    THEATER_OWNER: 'THEATER_OWNER'
};

// Movie Constants
export const MOVIE_CERTIFICATIONS = {
    U: 'U',
    UA: 'UA',
    A: 'A',
    S: 'S'
};

export const MOVIE_GENRES = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
    'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller',
    'Animation', 'Documentary', 'Musical', 'Historical',
    'Crime', 'Family', 'War', 'Western'
];

export const MOVIE_LANGUAGES = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam',
    'Kannada', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi'
];

// Theater Constants
export const CITIES = [
    'Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

// Time Constants
export const SHOW_TIMINGS = [
    '10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM', '10:00 PM'
];

// Local Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    REFRESH_TOKEN: 'refreshToken',
    THEME: 'theme',
    CART: 'bookingCart'
};

// Cache Keys
export const CACHE_KEYS = {
    MOVIES: 'movies',
    THEATERS: 'theaters',
    SHOWS: 'shows',
    USER_PROFILE: 'userProfile'
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'Please login to continue.',
    FORBIDDEN: 'You do not have permission to access this resource.',
    NOT_FOUND: 'Requested resource not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    PAYMENT_FAILED: 'Payment failed. Please try again.',
    SEAT_UNAVAILABLE: 'Selected seats are no longer available.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful!',
    SIGNUP_SUCCESS: 'Registration successful!',
    BOOKING_SUCCESS: 'Booking confirmed successfully!',
    PAYMENT_SUCCESS: 'Payment successful!',
    PROFILE_UPDATE: 'Profile updated successfully!',
    PASSWORD_CHANGE: 'Password changed successfully!'
};

// Validation Patterns
export const VALIDATION_PATTERNS = {
    EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    PHONE: /^[0-9]{10}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    NAME: /^[A-Za-z\s]{2,50}$/,
    PINCODE: /^[0-9]{6}$/
};

// Default Values
export const DEFAULTS = {
    MOVIE_POSTER: 'https://via.placeholder.com/300x450?text=No+Poster',
    THEATER_IMAGE: 'https://via.placeholder.com/400x300?text=Theater',
    USER_AVATAR: 'https://via.placeholder.com/150?text=User',
    CONVENIENCE_FEE: 30,
    TAX_RATE: 18,
    MAX_SEATS_PER_BOOKING: 10,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
};

// Feature Flags
export const FEATURES = {
    ENABLE_UPI: true,
    ENABLE_WALLET: true,
    ENABLE_REFUNDS: true,
    ENABLE_WISHLIST: true,
    ENABLE_REVIEWS: true,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_REAL_TIME_SEATS: true
};

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    
    // Movies
    GET_MOVIES: '/movies',
    GET_MOVIE: '/movies/{id}',
    SEARCH_MOVIES: '/movies/search',
    FILTER_MOVIES: '/movies/filter',
    
    // Theaters
    GET_THEATERS: '/theaters',
    GET_THEATER: '/theaters/{id}',
    GET_THEATERS_BY_CITY: '/theaters/city/{city}',
    
    // Shows
    GET_SHOWS_BY_MOVIE: '/shows/movie/{movieId}',
    GET_SHOWS_BY_THEATER: '/shows/theater/{theaterId}',
    GET_SEAT_LAYOUT: '/shows/{showId}/seats',
    
    // Bookings
    CREATE_BOOKING: '/bookings',
    GET_USER_BOOKINGS: '/bookings/my-bookings',
    GET_BOOKING: '/bookings/{id}',
    CANCEL_BOOKING: '/bookings/{id}/cancel',
    
    // Payments
    INITIATE_PAYMENT: '/payments/initiate',
    VERIFY_PAYMENT: '/payments/verify',
    GET_PAYMENT: '/payments/{id}',
    
    // User
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    GET_WISHLIST: '/users/wishlist',
    
    // Admin
    ADMIN_DASHBOARD: '/admin/dashboard/stats',
    ADMIN_USERS: '/admin/users',
    ADMIN_REPORTS: '/admin/reports',
    
    // Notifications
    NOTIFICATIONS_STREAM: '/notifications/stream',
    NOTIFICATIONS: '/notifications'
};

export default {
    API_BASE_URL,
    ROUTES,
    PAYMENT_METHODS,
    USER_ROLES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    VALIDATION_PATTERNS,
    DEFAULTS,
    API_ENDPOINTS
};