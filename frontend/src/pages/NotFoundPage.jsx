import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaTicketAlt, FaFilm } from 'react-icons/fa';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center">
                {/* Animated 404 */}
                <div className="relative mb-8">
                    <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
                        404
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <FaFilm className="text-6xl text-gray-700 animate-pulse" />
                    </div>
                </div>
                
                <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                    Oops! The page you're looking for seems to have left the theater.
                    It might have been moved, deleted, or never existed.
                </p>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    <Link
                        to="/"
                        className="p-6 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all transform hover:scale-105"
                    >
                        <FaHome className="text-3xl text-red-400 mx-auto mb-4" />
                        <div className="font-semibold">Go Home</div>
                        <div className="text-sm text-gray-400">Back to homepage</div>
                    </Link>
                    
                    <Link
                        to="/movies"
                        className="p-6 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all transform hover:scale-105"
                    >
                        <FaFilm className="text-3xl text-blue-400 mx-auto mb-4" />
                        <div className="font-semibold">Browse Movies</div>
                        <div className="text-sm text-gray-400">Discover new films</div>
                    </Link>
                    
                    <Link
                        to="/my-tickets"
                        className="p-6 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all transform hover:scale-105"
                    >
                        <FaTicketAlt className="text-3xl text-green-400 mx-auto mb-4" />
                        <div className="font-semibold">My Tickets</div>
                        <div className="text-sm text-gray-400">View bookings</div>
                    </Link>
                    
                    <button
                        onClick={() => window.history.back()}
                        className="p-6 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all transform hover:scale-105"
                    >
                        <FaSearch className="text-3xl text-yellow-400 mx-auto mb-4" />
                        <div className="font-semibold">Go Back</div>
                        <div className="text-sm text-gray-400">Return to previous page</div>
                    </button>
                </div>
                
                {/* Search Box */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for movies, theaters, or shows..."
                            className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
                        />
                        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                            <FaSearch />
                        </button>
                    </div>
                </div>
                
                {/* Support Info */}
                <div className="text-gray-500 text-sm">
                    <p className="mb-2">Need help? Contact our support team:</p>
                    <div className="space-x-6">
                        <a href="mailto:support@showtime.com" className="hover:text-white">
                            support@showtime.com
                        </a>
                        <a href="tel:+919876543210" className="hover:text-white">
                            +91 9876543210
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;