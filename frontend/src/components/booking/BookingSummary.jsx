import React from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaFilm, 
  FaChair,
  FaRupeeSign,
  FaTicketAlt 
} from 'react-icons/fa';
import { format } from 'date-fns';

const BookingSummary = ({ bookingDetails, onConfirm }) => {
  const { show, seats, seatType, totalSeats, totalAmount, convenienceFee, taxAmount } = bookingDetails;

  const calculateSubtotal = () => {
    return totalAmount - convenienceFee - taxAmount;
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>

      <div className="space-y-6">
        {/* Movie Details */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="flex items-start space-x-4">
            <img
              src={show.movie.posterUrl}
              alt={show.movie.title}
              className="w-20 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{show.movie.title}</h3>
              <div className="flex items-center text-gray-400 text-sm mb-1">
                <FaFilm className="mr-2" />
                <span>{show.movie.language} • {show.movie.genre}</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <FaClock className="mr-2" />
                <span>{show.movie.duration} mins • {show.movie.certification}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Show Details */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <h4 className="text-lg font-semibold mb-3">Show Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-400">Date</div>
                <div className="font-semibold">
                  {format(new Date(show.showDate), 'EEEE, MMMM dd, yyyy')}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <FaClock className="text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-400">Time</div>
                <div className="font-semibold">
                  {format(new Date(`1970-01-01T${show.showTime}`), 'hh:mm a')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theater Details */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="flex items-start">
            <FaMapMarkerAlt className="text-gray-400 mr-3 mt-1" />
            <div className="flex-1">
              <h4 className="text-lg font-semibold mb-2">{show.theater.name}</h4>
              <div className="text-gray-400">
                {show.theater.address}, {show.theater.city}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Screen: {show.screen.screenName}
              </div>
            </div>
          </div>
        </div>

        {/* Seat Details */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <h4 className="text-lg font-semibold mb-3">Seat Details</h4>
          <div className="flex items-center mb-4">
            <FaChair className="text-gray-400 mr-3" />
            <div>
              <div className="text-sm text-gray-400">Selected Seats</div>
              <div className="font-semibold text-lg">
                {seats.join(', ')} ({totalSeats} seats)
              </div>
              <div className="text-sm text-gray-500">
                {seatType} • {show.screen.screenName}
              </div>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <h4 className="text-lg font-semibold mb-3">Price Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Ticket Price</span>
              <span className="flex items-center">
                <FaRupeeSign className="text-xs" />
                {calculateSubtotal().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Convenience Fee</span>
              <span className="flex items-center">
                <FaRupeeSign className="text-xs" />
                {convenienceFee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tax (18%)</span>
              <span className="flex items-center">
                <FaRupeeSign className="text-xs" />
                {taxAmount.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="flex items-center text-red-400">
                  <FaRupeeSign />
                  {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="text-sm text-gray-400">
          <p className="mb-2">By proceeding, I agree to the Terms & Conditions and Privacy Policy</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Tickets once booked cannot be exchanged or refunded</li>
            <li>An internet handling fee per ticket may be levied</li>
            <li>Please carry your ID proof to the theater</li>
            <li>The theater reserves the right to refuse entry</li>
          </ul>
        </div>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition-colors flex items-center justify-center"
        >
          <FaTicketAlt className="mr-3" />
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;