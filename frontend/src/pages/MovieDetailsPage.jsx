import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaStar, 
  FaClock, 
  FaCalendarAlt, 
  FaPlay, 
  FaTicketAlt,
  FaHeart,
  FaShare,
  FaImdb,
  FaLanguage,
  FaUserFriends,
  FaArrowLeft
} from 'react-icons/fa';
import { movieAPI, showAPI } from '../services/api';
import toast from 'react-hot-toast';
import ShowTimings from '../components/booking/ShowTimings';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [city, setCity] = useState('Chennai');
  const [selectedShow, setSelectedShow] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await movieAPI.getById(id);
      setMovie(response);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      toast.error('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookTickets = (show) => {
    setSelectedShow(show);
    navigate(`/booking/${show.id}`);
  };

  const handleAddToWishlist = () => {
    setIsInWishlist(!isInWishlist);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: `Check out ${movie.title} on ShowTime!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
        <button
          onClick={() => navigate('/')}
          className="text-red-400 hover:text-red-300"
        >
          Go back to home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-96 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${movie.bannerUrl || movie.posterUrl})`
          }}
        >
          <div className="container mx-auto px-4 h-full flex items-end pb-8">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <FaArrowLeft />
            </button>
            
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-8">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-48 h-64 object-cover rounded-lg shadow-2xl"
              />
              
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <FaImdb className="text-yellow-400 text-2xl mr-2" />
                    <span className="text-xl font-bold">{movie.rating}/10</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-gray-400 mr-2" />
                    <span>{movie.duration} mins</span>
                  </div>
                  <div className="flex items-center">
                    <FaLanguage className="text-gray-400 mr-2" />
                    <span>{movie.language}</span>
                  </div>
                  <div className="px-3 py-1 border border-gray-400 rounded-full text-sm">
                    {movie.certification}
                  </div>
                </div>
                
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => document.getElementById('trailer-modal').showModal()}
                    className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                  >
                    <FaPlay className="mr-2" />
                    Watch Trailer
                  </button>
                  <button
                    onClick={handleAddToWishlist}
                    className={`p-3 rounded-full border-2 ${isInWishlist ? 'border-red-500 text-red-500' : 'border-gray-400 text-gray-400 hover:border-red-500 hover:text-red-500'} transition-colors`}
                  >
                    <FaHeart />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-full border-2 border-gray-400 text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    <FaShare />
                  </button>
                </div>
                
                <div className="text-gray-300">
                  <span className="text-red-400 font-semibold">Now Showing</span> • In theaters
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="lg:w-2/3">
            {/* Tabs */}
            <div className="border-b border-gray-700 mb-6">
              <div className="flex space-x-8">
                {['about', 'cast', 'reviews'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-1 font-semibold capitalize border-b-2 transition-colors ${
                      activeTab === tab 
                        ? 'border-red-500 text-red-500' 
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Synopsis</h3>
                    <p className="text-gray-300 leading-relaxed">{movie.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-gray-400">Genre</div>
                        <div className="font-semibold">{movie.genre}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Release Date</div>
                        <div className="font-semibold">
                          {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">Director</div>
                        <div className="font-semibold">{movie.director}</div>
                      </div>
                    </div>
                  </div>
                  
                  {movie.cast && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Cast</h3>
                      <p className="text-gray-300">{movie.cast}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'cast' && (
                <div>
                  <p className="text-gray-300">{movie.cast || 'Cast information not available'}</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-3xl font-bold">{movie.rating}/10</div>
                      <div className="text-gray-400">Based on 1,234 reviews</div>
                    </div>
                    <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">
                      Write a Review
                    </button>
                  </div>
                  
                  {/* Sample Reviews */}
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold">John Doe</div>
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span>4.5</span>
                          </div>
                        </div>
                        <p className="text-gray-300">Great movie! Amazing cinematography and acting.</p>
                        <div className="text-sm text-gray-400 mt-2">2 days ago</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Show Timings */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Show Timings</h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
              </div>
              
              <ShowTimings 
                movieId={movie.id} 
                city={city}
                onSelectShow={handleBookTickets}
              />
            </div>
          </div>

          {/* Right Column - Quick Book */}
          <div className="lg:w-1/3">
            <div className="sticky top-4 bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Book Tickets</h3>
              
              {selectedShow ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="font-semibold mb-2">Selected Show</div>
                    <div className="flex items-center text-gray-300">
                      <FaCalendarAlt className="mr-3" />
                      <div>
                        <div>{new Date(selectedShow.showDate).toLocaleDateString()}</div>
                        <div className="text-sm">{selectedShow.showTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300 mt-2">
                      <FaUserFriends className="mr-3" />
                      <div>{selectedShow.theater.name}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleBookTickets(selectedShow)}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition-colors flex items-center justify-center"
                  >
                    <FaTicketAlt className="mr-3" />
                    Book Now
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaTicketAlt className="text-4xl text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Select a show timing to book tickets</p>
                  <p className="text-sm text-gray-500">
                    Choose from available show timings in the left panel
                  </p>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="font-semibold mb-3">Why Book With Us?</h4>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-400 mr-2" />
                    <span>100% Secure Booking</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-400 mr-2" />
                    <span>Best Price Guarantee</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-400 mr-2" />
                    <span>Instant Confirmation</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-400 mr-2" />
                    <span>24/7 Customer Support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <dialog id="trailer-modal" className="modal">
        <div className="modal-box max-w-4xl bg-gray-900">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          {movie.trailerUrl && (
            <div className="aspect-video">
              <iframe
                src={movie.trailerUrl.replace('watch?v=', 'embed/')}
                title={movie.title}
                className="w-full h-full rounded-lg"
                allowFullScreen
              />
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MovieDetailsPage;