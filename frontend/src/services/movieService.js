import api from './api';

export const movieService = {
    // Get all movies
    getAllMovies: async (params = {}) => {
        try {
            const response = await api.get('/movies', { params });
            return {
                success: true,
                data: response,
                total: response.length
            };
        } catch (error) {
            console.error('Get movies error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch movies'
            };
        }
    },
    
    // Get movie by ID
    getMovieById: async (id) => {
        try {
            const response = await api.get(`/movies/${id}`);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Get movie error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch movie'
            };
        }
    },
    
    // Search movies
    searchMovies: async (query, params = {}) => {
        try {
            const response = await api.get('/movies/search', { 
                params: { query, ...params } 
            });
            return {
                success: true,
                data: response,
                total: response.length
            };
        } catch (error) {
            console.error('Search movies error:', error);
            return {
                success: false,
                message: error.message || 'Failed to search movies'
            };
        }
    },
    
    // Filter movies
    filterMovies: async (filters) => {
        try {
            const response = await api.post('/movies/filter', filters);
            return {
                success: true,
                data: response,
                total: response.length
            };
        } catch (error) {
            console.error('Filter movies error:', error);
            return {
                success: false,
                message: error.message || 'Failed to filter movies'
            };
        }
    },
    
    // Get upcoming movies
    getUpcomingMovies: async () => {
        try {
            const response = await api.get('/movies/upcoming');
            return {
                success: true,
                data: response,
                total: response.length
            };
        } catch (error) {
            console.error('Get upcoming movies error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch upcoming movies'
            };
        }
    },
    
    // Get movies by genre
    getMoviesByGenre: async (genre) => {
        try {
            const response = await api.get('/movies', { 
                params: { genre } 
            });
            return {
                success: true,
                data: response,
                total: response.length
            };
        } catch (error) {
            console.error('Get movies by genre error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch movies by genre'
            };
        }
    },
    
    // Get movies by language
    getMoviesByLanguage: async (language) => {
        try {
            const response = await api.get('/movies', { 
                params: { language } 
            });
            return {
                success: true,
                data: response,
                total: response.length
            };
        } catch (error) {
            console.error('Get movies by language error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch movies by language'
            };
        }
    },
    
    // Get now showing movies
    getNowShowing: async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await api.post('/movies/filter', {
                date: today,
                sortBy: 'releaseDate',
                sortOrder: 'desc'
            });
            return {
                success: true,
                data: response,
                total: response.length
            };
        } catch (error) {
            console.error('Get now showing error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch now showing movies'
            };
        }
    },
    
    // Get trending movies (based on bookings)
    getTrendingMovies: async () => {
        try {
            // This would typically come from a separate endpoint
            const response = await api.get('/movies', { 
                params: { sortBy: 'rating', sortOrder: 'desc', limit: 10 } 
            });
            return {
                success: true,
                data: response,
                total: response.length
            };
        } catch (error) {
            console.error('Get trending movies error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch trending movies'
            };
        }
    },
    
    // Get movie recommendations (for a user)
    getRecommendations: async (userId) => {
        try {
            // This would typically be a separate recommendation endpoint
            const response = await api.get(`/movies/recommendations/${userId}`);
            return {
                success: true,
                data: response,
                total: response.length
            };
        } catch (error) {
            console.error('Get recommendations error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch recommendations'
            };
        }
    },
    
    // Add movie to wishlist
    addToWishlist: async (movieId) => {
        try {
            await api.post(`/users/wishlist/${movieId}`);
            return { success: true };
        } catch (error) {
            console.error('Add to wishlist error:', error);
            return {
                success: false,
                message: error.message || 'Failed to add to wishlist'
            };
        }
    },
    
    // Remove movie from wishlist
    removeFromWishlist: async (movieId) => {
        try {
            await api.delete(`/users/wishlist/${movieId}`);
            return { success: true };
        } catch (error) {
            console.error('Remove from wishlist error:', error);
            return {
                success: false,
                message: error.message || 'Failed to remove from wishlist'
            };
        }
    },
    
    // Get user wishlist
    getWishlist: async () => {
        try {
            const response = await api.get('/users/wishlist');
            return {
                success: true,
                data: response,
                total: response.length
            };
        } catch (error) {
            console.error('Get wishlist error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch wishlist'
            };
        }
    },
    
    // Rate a movie
    rateMovie: async (movieId, rating, comment = '') => {
        try {
            await api.post(`/movies/${movieId}/rate`, { rating, comment });
            return { success: true };
        } catch (error) {
            console.error('Rate movie error:', error);
            return {
                success: false,
                message: error.message || 'Failed to rate movie'
            };
        }
    },
    
    // Get movie reviews
    getMovieReviews: async (movieId) => {
        try {
            const response = await api.get(`/movies/${movieId}/reviews`);
            return {
                success: true,
                data: response,
                total: response.length
            };
        } catch (error) {
            console.error('Get reviews error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch reviews'
            };
        }
    }
};

export default movieService;