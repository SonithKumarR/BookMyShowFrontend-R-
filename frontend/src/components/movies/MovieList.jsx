import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { movieAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MovieList = ({ filters = {}, limit = null }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieAPI.filter({
        ...filters,
        page,
        limit: limit || 12
      });
      
      if (limit) {
        setMovies(response);
      } else {
        setMovies(prev => page === 1 ? response : [...prev, ...response]);
        setHasMore(response.length > 0);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg animate-pulse h-80"></div>
        ))}
      </div>
    );
  }

  if (movies.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-xl mb-4">No movies found</div>
        <div className="text-gray-500">Try adjusting your filters</div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      
      {!limit && hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieList;