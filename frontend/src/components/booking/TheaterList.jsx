import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaStar, FaCheck, FaInfoCircle } from 'react-icons/fa';
import { theaterAPI } from '../../services/api';
import toast from 'react-hot-toast';

const TheaterList = ({ city, onTheaterSelect }) => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheater, setSelectedTheater] = useState(null);

  useEffect(() => {
    if (city) {
      fetchTheaters();
    }
  }, [city]);

  const fetchTheaters = async () => {
    try {
      setLoading(true);
      const response = await theaterAPI.getByCity(city);
      setTheaters(response);
    } catch (error) {
      console.error('Error fetching theaters:', error);
      toast.error('Failed to load theaters');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTheater = (theater) => {
    setSelectedTheater(theater.id);
    if (onTheaterSelect) {
      onTheaterSelect(theater);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse h-32"></div>
        ))}
      </div>
    );
  }

  if (theaters.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg">
        <FaMapMarkerAlt className="text-4xl text-gray-600 mx-auto mb-4" />
        <div className="text-gray-400 text-xl mb-2">No theaters found</div>
        <div className="text-gray-500">Try selecting a different city</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {theaters.map(theater => (
        <div
          key={theater.id}
          className={`bg-gray-800 rounded-lg p-6 border-2 transition-all cursor-pointer hover:border-red-500 ${
            selectedTheater === theater.id ? 'border-red-500' : 'border-transparent'
          }`}
          onClick={() => handleSelectTheater(theater)}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">{theater.name}</h3>
              <div className="flex items-center text-gray-400">
                <FaMapMarkerAlt className="mr-2" />
                <span>{theater.address}, {theater.city}</span>
              </div>
            </div>
            
            <div className="flex items-center">
              {selectedTheater === theater.id && (
                <FaCheck className="text-green-400 mr-3" />
              )}
              <button className="text-red-400 hover:text-red-300">
                <FaInfoCircle />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <FaPhone className="text-gray-400 mr-2" />
              <span>{theater.phone}</span>
            </div>
            
            <div>
              <div className="text-gray-400">Screens</div>
              <div className="font-semibold">{theater.totalScreens}</div>
            </div>
            
            <div>
              <div className="text-gray-400">Facilities</div>
              <div className="font-semibold line-clamp-1">
                {theater.facilities?.split(',').slice(0, 2).join(', ')}
              </div>
            </div>
            
            <div>
              <div className="text-gray-400">Rating</div>
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span>4.5/5</span>
              </div>
            </div>
          </div>
          
          {theater.facilities && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400 mb-2">Facilities:</div>
              <div className="flex flex-wrap gap-2">
                {theater.facilities.split(',').map((facility, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs"
                  >
                    {facility.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TheaterList;