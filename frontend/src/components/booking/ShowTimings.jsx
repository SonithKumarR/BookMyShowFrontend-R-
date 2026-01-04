import React, { useState, useEffect } from 'react';
import { FaClock, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';
import { format } from 'date-fns';
import { showAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ShowTimings = ({ movieId, city, onSelectShow }) => {
  const [theaters, setTheaters] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableDates();
  }, [movieId]);

  useEffect(() => {
    if (movieId && selectedDate) {
      fetchShows();
    }
  }, [movieId, selectedDate, city]);

  const fetchAvailableDates = async () => {
    try {
      const response = await showAPI.getAvailableDates(movieId);
      setAvailableDates(response.map(date => new Date(date)));
      if (response.length > 0) {
        setSelectedDate(new Date(response[0]));
      }
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };

  const fetchShows = async () => {
    try {
      setLoading(true);
      const response = await showAPI.getByMovie(movieId, city);
      // Group shows by theater
      const groupedTheaters = {};
      response.forEach(show => {
        const theaterId = show.theater.id;
        if (!groupedTheaters[theaterId]) {
          groupedTheaters[theaterId] = {
            ...show.theater,
            shows: []
          };
        }
        groupedTheaters[theaterId].shows.push(show);
      });
      setTheaters(Object.values(groupedTheaters));
    } catch (error) {
      console.error('Error fetching shows:', error);
      toast.error('Failed to load show timings');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`);
    return format(date, 'hh:mm a');
  };

  const handleShowSelect = (show) => {
    onSelectShow(show);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white rounded-lg">
      {/* Date Selector */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold mb-3">Select Date</h3>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {availableDates.map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg border transition-colors
                ${selectedDate.toDateString() === date.toDateString()
                  ? 'border-red-500 bg-red-500/10 text-red-500'
                  : 'border-gray-600 hover:border-gray-500'
                }
              `}
            >
              <div className="text-center">
                <div className="text-sm font-semibold">
                  {format(date, 'EEE')}
                </div>
                <div className="text-lg font-bold">
                  {format(date, 'dd')}
                </div>
                <div className="text-xs text-gray-400">
                  {format(date, 'MMM')}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Theaters and Shows */}
      <div className="divide-y divide-gray-700">
        {theaters.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">No shows available for selected date</div>
            <div className="text-sm text-gray-500">Try selecting a different date or city</div>
          </div>
        ) : (
          theaters.map(theater => (
            <div key={theater.id} className="p-4">
              <div className="mb-4">
                <h4 className="text-lg font-semibold">{theater.name}</h4>
                <div className="flex items-center text-gray-400 text-sm">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{theater.address}, {theater.city}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Facilities: {theater.facilities}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {theater.shows.map(show => (
                  <button
                    key={show.id}
                    onClick={() => handleShowSelect(show)}
                    className={`
                      p-3 rounded-lg border transition-all
                      ${show.availableSeats === 0
                        ? 'border-gray-600 bg-gray-800 cursor-not-allowed opacity-50'
                        : 'border-gray-600 hover:border-red-500 hover:bg-red-500/10'
                      }
                    `}
                    disabled={show.availableSeats === 0}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <FaClock className="mr-2 text-gray-400" />
                      <span className="font-semibold">{formatTime(show.showTime)}</span>
                    </div>
                    <div className="text-xs text-center space-y-1">
                      <div className="text-gray-400">
                        {show.availableSeats} seats left
                      </div>
                      <div className="flex items-center justify-center">
                        <FaRupeeSign className="text-xs" />
                        <span>{show.priceClassic}</span>
                        <span className="mx-1">-</span>
                        <FaRupeeSign className="text-xs" />
                        <span>{show.pricePremium}</span>
                      </div>
                      {show.availableSeats === 0 && (
                        <div className="text-red-400 font-semibold">FULL</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShowTimings;