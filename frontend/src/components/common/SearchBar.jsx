import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ placeholder = 'Search movies, theaters, or shows...' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  // Mock suggestions - in real app, fetch from API
  const fetchSuggestions = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    // Mock data
    const mockSuggestions = [
      'Avengers: Endgame',
      'Spider-Man: No Way Home',
      'Pushpa: The Rise',
      'PVR Cinemas',
      'INOX',
      'Action movies',
      'Today shows',
      'Chennai theaters'
    ].filter(item => 
      item.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);

    setSuggestions(mockSuggestions);
    setShowSuggestions(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-10 pr-3 flex items-center"
            >
              <FaTimes className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
          )}
          <button
            type="submit"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <div className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded-full text-sm font-semibold transition-colors">
              Search
            </div>
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-center"
            >
              <FaSearch className="text-gray-400 mr-3" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        {['Action', 'Comedy', 'Today', '3D', 'IMAX'].map((filter) => (
          <button
            key={filter}
            onClick={() => handleSuggestionClick(filter)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;