import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import toast from 'react-hot-toast';

const RatingSystem = ({ movieId, initialRating = 0, readOnly = false, onRate }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = (value) => {
    if (readOnly) return;
    
    setRating(value);
    
    if (onRate) {
      onRate(value);
    }
    
    toast.success(`Rated ${value} stars!`);
  };

  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRate(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            disabled={readOnly}
            className="p-1 disabled:cursor-default"
          >
            {star <= (hoverRating || rating) ? (
              <FaStar className="text-yellow-400 text-xl" />
            ) : (
              <FaRegStar className="text-gray-400 text-xl hover:text-yellow-300" />
            )}
          </button>
        ))}
      </div>
      
      <div className="ml-3">
        <span className="text-2xl font-bold">{rating.toFixed(1)}</span>
        <span className="text-gray-400 text-sm ml-1">/5</span>
      </div>
      
      {!readOnly && (
        <div className="ml-4 text-sm text-gray-400">
          Click to rate
        </div>
      )}
    </div>
  );
};

export default RatingSystem;