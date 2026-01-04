import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTicketAlt, FaChair, FaCreditCard } from 'react-icons/fa';
import SeatSelection from '../components/booking/SeatSelection';
import BookingSummary from '../components/booking/BookingSummary';
import PaymentGateway from '../components/payments/PaymentGateway';
import { showAPI, bookingAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Seat Selection, 2: Summary, 3: Payment
  const [show, setShow] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  const fetchShowDetails = async () => {
    try {
      setLoading(true);
      const response = await showAPI.getById(showId);
      setShow(response);
    } catch (error) {
      console.error('Error fetching show details:', error);
      toast.error('Failed to load show details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatsSelected = (details) => {
    setBookingDetails({
      ...details,
      show
    });
    setStep(2);
  };

  const handleConfirmBooking = () => {
    if (!user) {
      toast.error('Please login to continue booking');
      navigate('/login', { state: { from: `/booking/${showId}` } });
      return;
    }
    setStep(3);
  };

  const handlePaymentSuccess = async () => {
    try {
      // Create booking
      const bookingRequest = {
        showId: show.id,
        seatNumbers: bookingDetails.seats,
        seatType: bookingDetails.seatType,
        paymentMethod: 'CARD'
      };

      const response = await bookingAPI.create(bookingRequest);
      
      toast.success('Booking confirmed!');
      
      // Navigate to booking confirmation page
      navigate(`/booking-confirmation/${response.bookingId}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };

  const steps = [
    { number: 1, title: 'Select Seats', icon: <FaChair /> },
    { number: 2, title: 'Review Booking', icon: <FaTicketAlt /> },
    { number: 3, title: 'Make Payment', icon: <FaCreditCard /> }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Show not found</h2>
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
      {/* Header */}
      <div className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            
            <div className="flex-1 max-w-2xl mx-auto">
              <div className="flex justify-between items-center">
                {steps.map((stepItem, index) => (
                  <React.Fragment key={stepItem.number}>
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center mb-2
                        ${step >= stepItem.number 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-700 text-gray-400'
                        }
                      `}>
                        {stepItem.icon}
                      </div>
                      <div className={`text-sm ${step >= stepItem.number ? 'text-white' : 'text-gray-400'}`}>
                        {stepItem.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 ${step > stepItem.number ? 'bg-red-600' : 'bg-gray-700'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Info Bar */}
      <div className="bg-gray-800 py-3 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{show.movie.title}</h1>
              <div className="text-sm text-gray-400">
                {show.theater.name} • {show.screen.screenName} • {show.showDate} • {show.showTime}
              </div>
            </div>
            {bookingDetails && (
              <div className="text-right">
                <div className="text-sm text-gray-400">Total Amount</div>
                <div className="text-xl font-bold text-red-400">
                  ₹{bookingDetails.totalAmount.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {step === 1 && (
            <SeatSelection 
              showId={showId}
              onSeatsSelected={handleSeatsSelected}
            />
          )}

          {step === 2 && bookingDetails && (
            <BookingSummary 
              bookingDetails={bookingDetails}
              onConfirm={handleConfirmBooking}
            />
          )}

          {step === 3 && bookingDetails && (
            <PaymentGateway 
              bookingId={bookingDetails.bookingId}
              amount={bookingDetails.totalAmount}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">100% Secure Payment • Best Price Guarantee • Instant Confirmation</p>
          <p>By continuing, you agree to our Terms & Conditions and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;