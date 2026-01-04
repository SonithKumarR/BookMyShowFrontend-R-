import React, { useState, useEffect } from 'react';
import { 
  FaTicketAlt, 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt,
  FaFilm,
  FaQrcode,
  FaDownload,
  FaTimesCircle,
  FaCheckCircle
} from 'react-icons/fa';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MyTicketsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getUserBookings();
      setBookings(response);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingAPI.cancel(bookingId, { reason: 'User cancelled' });
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh list
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const handleDownloadTicket = (booking) => {
    // In a real app, generate and download PDF ticket
    toast.success('Ticket download started');
  };

  const filteredBookings = bookings.filter(booking => {
    const showDate = new Date(booking.show.showDate);
    const today = new Date();
    
    switch (activeTab) {
      case 'upcoming':
        return showDate >= today && booking.bookingStatus === 'CONFIRMED';
      case 'past':
        return showDate < today && booking.bookingStatus === 'CONFIRMED';
      case 'cancelled':
        return booking.bookingStatus === 'CANCELLED';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Tickets</h1>
              <p className="text-gray-400">Manage your movie bookings</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaTicketAlt className="text-3xl text-red-500" />
              <span className="text-2xl font-bold">{bookings.length}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gray-800 rounded-lg p-1 mb-8">
            <div className="flex space-x-1">
              {['upcoming', 'past', 'cancelled'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 rounded-md font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <FaTicketAlt className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No {activeTab} bookings</h3>
              <p className="text-gray-400 mb-6">
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming movie bookings"
                  : activeTab === 'past'
                  ? "You haven't watched any movies yet"
                  : "You haven't cancelled any bookings"}
              </p>
              {activeTab === 'upcoming' && (
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                >
                  Book Now
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  {/* Booking Header */}
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`
                          px-4 py-2 rounded-full font-semibold
                          ${booking.bookingStatus === 'CONFIRMED' 
                            ? 'bg-green-900/30 text-green-400 border border-green-700'
                            : booking.bookingStatus === 'CANCELLED'
                            ? 'bg-red-900/30 text-red-400 border border-red-700'
                            : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                          }
                        `}>
                          {booking.bookingStatus}
                        </div>
                        <div className="text-gray-400">
                          Booking ID: <span className="font-mono">{booking.bookingReference}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-400">
                          ₹{booking.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {format(new Date(booking.bookedAt), 'dd MMM yyyy, hh:mm a')}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Movie Info */}
                      <div className="flex items-start space-x-4">
                        <img
                          src={booking.show.movie.posterUrl}
                          alt={booking.show.movie.title}
                          className="w-20 h-28 object-cover rounded"
                        />
                        <div>
                          <h3 className="text-xl font-semibold mb-1">
                            {booking.show.movie.title}
                          </h3>
                          <div className="flex items-center text-gray-400 text-sm mb-1">
                            <FaFilm className="mr-2" />
                            <span>{booking.show.movie.language} • {booking.show.movie.genre}</span>
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <FaClock className="mr-2" />
                            <span>{booking.show.movie.duration} mins</span>
                          </div>
                        </div>
                      </div>

                      {/* Show Info */}
                      <div>
                        <h4 className="font-semibold mb-2">Show Details</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-300">
                            <FaCalendarAlt className="mr-3 w-4" />
                            <span>{format(new Date(booking.show.showDate), 'EEEE, MMMM dd')}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <FaClock className="mr-3 w-4" />
                            <span>{booking.show.showTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Theater Info */}
                      <div>
                        <h4 className="font-semibold mb-2">Theater Details</h4>
                        <div className="flex items-start">
                          <FaMapMarkerAlt className="mr-3 mt-1 text-gray-400" />
                          <div>
                            <div className="font-semibold">{booking.show.theater.name}</div>
                            <div className="text-gray-400 text-sm">
                              {booking.show.theater.address}, {booking.show.theater.city}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Seat Details */}
                      <div>
                        <h4 className="font-semibold mb-3">Seat Details</h4>
                        <div className="flex flex-wrap gap-2">
                          {booking.seatNumbers.map((seat, index) => (
                            <div
                              key={index}
                              className="px-3 py-2 bg-gray-700 rounded-lg flex items-center"
                            >
                              <span>{seat}</span>
                              <span className="ml-2 text-sm text-gray-400">
                                ({booking.seatType})
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-sm text-gray-400">
                          Total {booking.totalSeats} seats • {booking.seatType}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-3">
                        {booking.bookingStatus === 'CONFIRMED' && (
                          <>
                            <button
                              onClick={() => handleDownloadTicket(booking)}
                              className="flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              <FaDownload className="mr-3" />
                              Download Ticket
                            </button>
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="flex items-center justify-center px-4 py-3 border border-red-600 text-red-400 rounded-lg hover:bg-red-600/10 transition-colors"
                            >
                              <FaTimesCircle className="mr-3" />
                              Cancel Booking
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => window.location.href = `/booking/${booking.show.id}`}
                          className="flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                        >
                          <FaQrcode className="mr-3" />
                          View QR Code
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTicketsPage;