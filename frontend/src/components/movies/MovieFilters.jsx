import React, { useState } from 'react';
import { FaFilter, FaCalendarAlt, FaLanguage, FaTags } from 'react-icons/fa';

const MovieFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    genre: initialFilters.genre || '',
    language: initialFilters.language || '',
    date: initialFilters.date || '',
    sortBy: initialFilters.sortBy || 'releaseDate'
  });

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
    'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller',
    'Animation', 'Documentary', 'Musical'
  ];

  const languages = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam',
    'Kannada', 'Bengali', 'Marathi', 'Gujarati'
  ];

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      genre: '',
      language: '',
      date: '',
      sortBy: 'releaseDate'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <FaFilter className="text-red-400 mr-3" />
        <h3 className="text-lg font-bold">Filter Movies</h3>
        <button
          onClick={clearFilters}
          className="ml-auto text-sm text-gray-400 hover:text-white"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Genre Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <FaTags className="mr-2" />
            Genre
          </label>
          <select
            value={filters.genre}
            onChange={(e) => handleChange('genre', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <FaLanguage className="mr-2" />
            Language
          </label>
          <select
            value={filters.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <FaCalendarAlt className="mr-2" />
            Date
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="releaseDate">Release Date</option>
            <option value="rating">Rating</option>
            <option value="duration">Duration</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(filters.genre || filters.language || filters.date) && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {filters.genre && (
              <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">
                Genre: {filters.genre}
                <button
                  onClick={() => handleChange('genre', '')}
                  className="ml-2 hover:text-gray-300"
                >
                  ×
                </button>
              </span>
            )}
            {filters.language && (
              <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">
                Language: {filters.language}
                <button
                  onClick={() => handleChange('language', '')}
                  className="ml-2 hover:text-gray-300"
                >
                  ×
                </button>
              </span>
            )}
            {filters.date && (
              <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">
                Date: {new Date(filters.date).toLocaleDateString()}
                <button
                  onClick={() => handleChange('date', '')}
                  className="ml-2 hover:text-gray-300"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieFilters;