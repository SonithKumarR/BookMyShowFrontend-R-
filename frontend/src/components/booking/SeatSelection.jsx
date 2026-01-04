import React, { useState, useEffect } from 'react';
import { FaChair, FaCheck, FaTimes } from 'react-icons/fa';
import { seatAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SeatSelection = ({ showId, onSeatsSelected }) => {
  const [seatLayout, setSeatLayout] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [classicPrice, setClassicPrice] = useState(200);
  const [premiumPrice, setPremiumPrice] = useState(350);
  const [loading, setLoading] = useState(true);
  const [seatType, setSeatType] = useState('CLASSIC');

  useEffect(() => {
    fetchSeatLayout();
  }, [showId]);

  const fetchSeatLayout = async () => {
    try {
      setLoading(true);
      const response = await seatAPI.getLayout(showId);
      setSeatLayout(response.seatLayout);
      setBookedSeats(response.bookedSeats);
      setClassicPrice(response.classicPrice);
      setPremiumPrice(response.premiumPrice);
    } catch (error) {
      console.error('Error fetching seat layout:', error);
      toast.error('Failed to load seat layout');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (rowIndex, seatIndex, seat) => {
    if (!seat.isAvailable) {
      toast.error('This seat is already booked');
      return;
    }

    const seatId = `${rowIndex}-${seatIndex}`;
    const isSelected = selectedSeats.some(s => s.id === seatId);

    if (isSelected) {
      // Remove seat
      setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
      // Update layout
      const updatedLayout = [...seatLayout];
      updatedLayout[rowIndex][seatIndex].isSelected = false;
      setSeatLayout(updatedLayout);
    } else {
      // Add seat
      if (selectedSeats.length >= 10) {
        toast.error('You can select maximum 10 seats');
        return;
      }

      const newSeat = {
        id: seatId,
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,
        price: seat.price,
        row: rowIndex,
        column: seatIndex
      };

      setSelectedSeats(prev => [...prev, newSeat]);
      // Update layout
      const updatedLayout = [...seatLayout];
      updatedLayout[rowIndex][seatIndex].isSelected = true;
      setSeatLayout(updatedLayout);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    const seats = selectedSeats.map(seat => ({
      seatNumber: seat.seatNumber,
      seatType: seat.seatType,
      price: seat.price
    }));

    const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const convenienceFee = selectedSeats.length * 30;
    const taxAmount = totalAmount * 0.18;
    const finalAmount = totalAmount + convenienceFee + taxAmount;

    onSeatsSelected({
      seats: selectedSeats.map(s => s.seatNumber),
      seatType,
      totalSeats: selectedSeats.length,
      totalAmount: finalAmount,
      convenienceFee,
      taxAmount,
      seatDetails: seats
    });
  };

  const handleClearSelection = () => {
    setSelectedSeats([]);
    // Reset all seats to not selected
    const updatedLayout = seatLayout.map(row => 
      row.map(seat => ({ ...seat, isSelected: false }))
    );
    setSeatLayout(updatedLayout);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Select Your Seats</h2>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-700 rounded mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-600 rounded mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-500 rounded mr-2"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-500 rounded mr-2"></div>
            <span>Premium</span>
          </div>
        </div>
      </div>

      {/* Screen */}
      <div className="mb-8">
        <div className="bg-gray-700 h-2 rounded-full mb-4 mx-auto" style={{ width: '80%' }}></div>
        <div className="text-center text-gray-400">SCREEN THIS WAY</div>
      </div>

      {/* Seat Layout */}
      <div className="overflow-x-auto">
        {seatLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-2 mb-4">
            <div className="w-8 flex items-center justify-center text-gray-400">
              {String.fromCharCode(65 + rowIndex)}
            </div>
            {row.map((seat, seatIndex) => (
              <button
                key={seatIndex}
                onClick={() => handleSeatClick(rowIndex, seatIndex, seat)}
                disabled={!seat.isAvailable}
                className={`
                  w-10 h-10 rounded flex items-center justify-center
                  ${seat.seatType === 'PREMIUM' ? 'border-2 border-yellow-500' : 'border border-gray-600'}
                  ${!seat.isAvailable ? 'bg-gray-500 cursor-not-allowed' : 
                    seat.isSelected ? 'bg-red-600' : 
                    'bg-gray-700 hover:bg-gray-600'}
                  transition-colors
                `}
              >
                <FaChair className={seat.seatType === 'PREMIUM' ? 'text-yellow-400' : 'text-white'} />
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Seat Type Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Seat Type</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSeatType('CLASSIC')}
            className={`p-4 rounded-lg border-2 transition-all ${
              seatType === 'CLASSIC' 
                ? 'border-red-500 bg-red-500/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="text-lg font-semibold">Classic</div>
            <div className="text-gray-400">₹{classicPrice}</div>
          </button>
          <button
            onClick={() => setSeatType('PREMIUM')}
            className={`p-4 rounded-lg border-2 transition-all ${
              seatType === 'PREMIUM' 
                ? 'border-yellow-500 bg-yellow-500/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="text-lg font-semibold">Premium</div>
            <div className="text-gray-400">₹{premiumPrice}</div>
            <div className="text-sm text-yellow-400">Best View</div>
          </button>
        </div>
      </div>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Selected Seats ({selectedSeats.length})</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSeats.map((seat) => (
              <div 
                key={seat.id}
                className="px-3 py-2 bg-red-600 rounded-lg flex items-center"
              >
                <span className="mr-2">{seat.seatNumber}</span>
                <button
                  onClick={() => handleSeatClick(seat.row, seat.column, seat)}
                  className="text-sm hover:text-red-200"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Ticket Price</div>
              <div className="font-semibold">
                ₹{selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Convenience Fee</div>
              <div className="font-semibold">₹{selectedSeats.length * 30}</div>
            </div>
            <div>
              <div className="text-gray-400">Tax (18%)</div>
              <div className="font-semibold">
                ₹{(selectedSeats.reduce((sum, seat) => sum + seat.price, 0) * 0.18).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Total Amount</div>
              <div className="font-semibold text-lg">
                ₹{selectedSeats.reduce((sum, seat) => sum + seat.price, 0) + 
                  (selectedSeats.length * 30) + 
                  (selectedSeats.reduce((sum, seat) => sum + seat.price, 0) * 0.18)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleClearSelection}
          disabled={selectedSeats.length === 0}
          className="flex-1 py-3 px-4 border-2 border-gray-600 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear Selection
        </button>
        <button
          onClick={handleConfirmSelection}
          disabled={selectedSeats.length === 0}
          className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <FaCheck className="mr-2" />
          Confirm Selection ({selectedSeats.length} seats)
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;