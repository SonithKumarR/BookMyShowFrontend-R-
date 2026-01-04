import api from './api';

export const authService = {
    // Login user
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            // Store token and user data
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response));
                
                // Set default axios header
                api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
            }
            
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.message || 'Login failed'
            };
        }
    },
    
    // Register new user
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.message || 'Registration failed'
            };
        }
    },
    
    // Logout user
    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('refreshToken');
            
            // Remove axios header
            delete api.defaults.headers.common['Authorization'];
        }
    },
    
    // Refresh access token
    refreshToken: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }
            
            const response = await api.post('/auth/refresh-token', { refreshToken });
            
            if (response.token) {
                localStorage.setItem('token', response.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
            }
            
            return {
                success: true,
                token: response.token
            };
        } catch (error) {
            console.error('Token refresh error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    },
    
    // Forgot password
    forgotPassword: async (email) => {
        try {
            await api.post('/auth/forgot-password', { email });
            return { success: true };
        } catch (error) {
            console.error('Forgot password error:', error);
            return {
                success: false,
                message: error.message || 'Failed to send reset email'
            };
        }
    },
    
    // Reset password
    resetPassword: async (token, newPassword) => {
        try {
            await api.post('/auth/reset-password', { token, password: newPassword });
            return { success: true };
        } catch (error) {
            console.error('Reset password error:', error);
            return {
                success: false,
                message: error.message || 'Failed to reset password'
            };
        }
    },
    
    // Get current user from localStorage
    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    },
    
    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },
    
    // Check if user is admin
    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user?.role === 'ADMIN';
    },
    
    // Update user profile
    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/users/profile', profileData);
            
            // Update local storage
            const currentUser = authService.getCurrentUser();
            const updatedUser = { ...currentUser, ...profileData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Update profile error:', error);
            return {
                success: false,
                message: error.message || 'Failed to update profile'
            };
        }
    },
    
    // Change password
    changePassword: async (currentPassword, newPassword) => {
        try {
            await api.post('/users/change-password', {
                currentPassword,
                newPassword
            });
            return { success: true };
        } catch (error) {
            console.error('Change password error:', error);
            return {
                success: false,
                message: error.message || 'Failed to change password'
            };
        }
    }
};

export default authService;