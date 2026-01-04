import React, { useState, useEffect } from 'react';
import { FaHeart, FaTrash, FaTicketAlt, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getWishlist();
      setMovies(response);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (movieId) => {
    try {
      await userAPI.removeFromWishlist(movieId);
      setMovies(movies.filter(movie => movie.id !== movieId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg animate-pulse h-80"></div>
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <FaHeart className="text-4xl text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
        <p className="text-gray-400 mb-6">Add movies you want to watch later</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
        >
          Browse Movies
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Wishlist</h2>
        <div className="text-gray-400">
          {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map(movie => (
          <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden group">
            <div className="relative">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4">
                  <Link
                    to={`/movie/${movie.id}`}
                    className="block w-full py-2 bg-red-600 hover:bg-red-700 text-white text-center rounded font-semibold transition-colors mb-2"
                  >
                    <FaTicketAlt className="inline mr-2" />
                    Book Now
                  </Link>
                </div>
              </div>
              
              <button
                onClick={() => handleRemove(movie.id)}
                className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-red-600 transition-colors"
                title="Remove from wishlist"
              >
                <FaTrash className="text-white" />
              </button>
            </div>
            
            <div className="p-4">
              <Link to={`/movie/${movie.id}`}>
                <h3 className="font-bold text-lg mb-2 hover:text-red-400 transition-colors line-clamp-1">
                  {movie.title}
                </h3>
              </Link>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>{movie.rating}</span>
                </div>
                <div className="text-gray-400 text-sm">
                  {movie.duration} mins
                </div>
              </div>
              
              <div className="text-sm text-gray-400 line-clamp-2">
                {movie.genre}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;