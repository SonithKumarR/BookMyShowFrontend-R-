import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import { movieAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    language: '',
    genre: '',
    releaseDate: '',
    posterUrl: ''
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieAPI.getAll();
      setMovies(response);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await movieAPI.create(formData);
      toast.success('Movie created successfully');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        duration: '',
        language: '',
        genre: '',
        releaseDate: '',
        posterUrl: ''
      });
      fetchMovies();
    } catch (error) {
      console.error('Error creating movie:', error);
      toast.error('Failed to create movie');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return;
    }
    try {
      await movieAPI.delete(id);
      toast.success('Movie deleted successfully');
      fetchMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast.error('Failed to delete movie');
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Movie Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Movie
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Movie Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Add New Movie</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Duration (mins)"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Language"
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Genre"
                  value={formData.genre}
                  onChange={(e) => setFormData({...formData, genre: e.target.value})}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                  required
                />
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Poster URL"
                value={formData.posterUrl}
                onChange={(e) => setFormData({...formData, posterUrl: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                required
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
                >
                  Create Movie
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movies Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4 text-left">Movie</th>
              <th className="p-4 text-left">Language</th>
              <th className="p-4 text-left">Genre</th>
              <th className="p-4 text-left">Duration</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredMovies.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  No movies found
                </td>
              </tr>
            ) : (
              filteredMovies.map(movie => (
                <tr key={movie.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div>
                        <div className="font-semibold">{movie.title}</div>
                        <div className="text-sm text-gray-400">
                          Rating: {movie.rating}/10
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{movie.language}</td>
                  <td className="p-4">{movie.genre}</td>
                  <td className="p-4">{movie.duration} mins</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovieManagement;