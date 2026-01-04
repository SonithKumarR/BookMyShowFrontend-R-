import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaHeart, FaEye } from 'react-icons/fa';

const MovieCard = ({ movie }) => {
  return (
    <div className="group relative bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
      {/* Poster */}
      <div className="relative overflow-hidden">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Link
              to={`/movie/${movie.id}`}
              className="block w-full py-2 bg-red-600 hover:bg-red-700 text-white text-center rounded font-semibold transition-colors"
            >
              Book Tickets
            </Link>
          </div>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-yellow-900/80 text-yellow-300 px-2 py-1 rounded-full text-sm font-bold flex items-center">
          <FaStar className="mr-1" />
          {movie.rating}
        </div>
        
        {/* Wishlist Button */}
        <button className="absolute top-3 left-3 p-2 bg-black/50 rounded-full hover:bg-red-600 transition-colors">
          <FaHeart className="text-white" />
        </button>
      </div>
      
      {/* Movie Info */}
      <div className="p-4">
        <Link to={`/movie/${movie.id}`}>
          <h3 className="font-bold text-lg text-white mb-2 hover:text-red-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>
        </Link>
        
        <div className="flex items-center text-gray-400 text-sm mb-3">
          <FaClock className="mr-2" />
          <span>{movie.duration} mins</span>
          <span className="mx-2">•</span>
          <span>{movie.language}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {movie.genre.split(',').map((genre, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
            >
              {genre.trim()}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-red-400 font-bold">
            Now Showing
          </div>
          <button className="flex items-center text-gray-400 hover:text-white text-sm">
            <FaEye className="mr-1" />
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;