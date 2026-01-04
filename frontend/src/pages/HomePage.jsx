import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaPlay, FaCalendarAlt } from 'react-icons/fa'
import { movieAPI } from '../services/api'
import toast from 'react-hot-toast'

const HomePage = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [featuredMovie, setFeaturedMovie] = useState(null)

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await movieAPI.getAll()
      setMovies(response.data)
      
      // Set first movie as featured
      if (response.data.length > 0) {
        setFeaturedMovie(response.data[0])
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      toast.error('Failed to load movies')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      {featuredMovie && (
        <div className="relative h-[70vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url(${featuredMovie.posterUrl})`
            }}
          />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                {featuredMovie.title}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-2" />
                  <span className="text-xl">{featuredMovie.rating}/10</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>{featuredMovie.duration} min</span>
                </div>
                <span>•</span>
                <span>{featuredMovie.genre}</span>
              </div>
              <p className="text-gray-300 mb-8 text-lg">
                {featuredMovie.description?.substring(0, 200)}...
              </p>
              <div className="flex space-x-4">
                <Link
                  to={`/movie/${featuredMovie.id}`}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors flex items-center"
                >
                  <FaPlay className="mr-2" />
                  Book Tickets
                </Link>
                <button className="border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Now Showing Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Now Showing</h2>
          <Link 
            to="/movies" 
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.slice(0, 8).map((movie) => (
            <div key={movie.id} className="group cursor-pointer">
              <Link to={`/movie/${movie.id}`}>
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg w-full">
                      Book Now
                    </button>
                  </div>
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded">
                    {movie.rating}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{movie.title}</h3>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>{movie.genre}</span>
                  <span>{movie.language}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ShowTime?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTicketAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-400">
                Book tickets in just a few clicks with our user-friendly interface
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMoneyBillAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-400">
                Get the best deals and discounts on movie tickets
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeadset className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-400">
                Our customer support team is always here to help you
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage