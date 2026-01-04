import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaMobileAlt, FaUniversity, FaWallet } from 'react-icons/fa';
import RazorpayPayment from '../components/payments/RazorpayPayment';
import UPIPayment from '../components/payments/UPIPayment';
import { useBooking } from '../context/BookingContext';
import { paymentAPI } from '../services/api';
import toast from 'react-hot-toast';

const PaymentPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { bookingData, completeBooking } = useBooking();
    const [selectedMethod, setSelectedMethod] = useState('razorpay');
    const [processing, setProcessing] = useState(false);

    const paymentMethods = [
        { id: 'razorpay', name: 'Razorpay', icon: <FaCreditCard />, color: 'text-blue-500' },
        { id: 'upi', name: 'UPI', icon: <FaMobileAlt />, color: 'text-purple-500' },
        { id: 'netbanking', name: 'Net Banking', icon: <FaUniversity />, color: 'text-green-500' },
        { id: 'wallet', name: 'Wallet', icon: <FaWallet />, color: 'text-yellow-500' },
    ];

    const handlePaymentSuccess = async (paymentData) => {
        try {
            setProcessing(true);
            
            // Verify payment with backend
            await paymentAPI.verify(paymentData);
            
            // Complete booking process
            completeBooking();
            
            // Navigate to success page
            navigate(`/payment-success/${bookingId || 'temp'}`);
            
        } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed');
        } finally {
            setProcessing(false);
        }
    };

    const handlePaymentFailure = (error) => {
        toast.error(`Payment failed: ${error}`);
        navigate('/my-tickets');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-400 hover:text-white mr-6"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back
                        </button>
                        <h1 className="text-2xl font-bold">Payment</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Amount Summary */}
                    <div className="bg-gray-800 rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-gray-400">Total Amount</div>
                                <div className="text-3xl font-bold text-red-400">
                                    ₹{bookingData.totalAmount.toFixed(2)}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-gray-400">For</div>
                                <div className="font-semibold">{bookingData.seats.length} seat(s)</div>
                                <div className="text-sm text-gray-400">
                                    {bookingData.show?.movie?.title}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Payment Methods */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-800 rounded-lg p-6 mb-6">
                                <h2 className="text-xl font-bold mb-6">Select Payment Method</h2>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    {paymentMethods.map(method => (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id)}
                                            className={`
                                                p-4 rounded-lg border-2 transition-all flex flex-col items-center
                                                ${selectedMethod === method.id
                                                    ? 'border-red-500 bg-red-500/10'
                                                    : 'border-gray-600 hover:border-gray-500'
                                                }
                                            `}
                                        >
                                            <div className={`text-2xl mb-2 ${method.color}`}>
                                                {method.icon}
                                            </div>
                                            <div className="font-semibold">{method.name}</div>
                                        </button>
                                    ))}
                                </div>

                                {/* Payment Component */}
                                {selectedMethod === 'razorpay' && (
                                    <RazorpayPayment
                                        orderDetails={{
                                            orderId: `order_${Date.now()}`,
                                            amount: bookingData.totalAmount,
                                            razorpayKey: 'rzp_test_your_key',
                                            callbackUrl: window.location.origin + '/payment-success',
                                            bookingId: bookingId
                                        }}
                                        onSuccess={handlePaymentSuccess}
                                        onFailure={handlePaymentFailure}
                                    />
                                )}

                                {selectedMethod === 'upi' && (
                                    <UPIPayment
                                        amount={bookingData.totalAmount}
                                        bookingId={bookingId}
                                        onSuccess={handlePaymentSuccess}
                                    />
                                )}

                                {/* Other payment methods can be added similarly */}
                            </div>
                        </div>

                        {/* Right Column - Booking Summary */}
                        <div>
                            <div className="bg-gray-800 rounded-lg p-6 sticky top-4">
                                <h3 className="text-lg font-bold mb-4">Booking Summary</h3>
                                
                                {bookingData.show && (
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-gray-400 text-sm">Movie</div>
                                            <div className="font-semibold">{bookingData.show.movie.title}</div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-gray-400 text-sm">Show Time</div>
                                            <div className="font-semibold">
                                                {new Date(bookingData.show.showDate).toLocaleDateString()} • 
                                                {bookingData.show.showTime}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-gray-400 text-sm">Theater</div>
                                            <div className="font-semibold">{bookingData.show.theater.name}</div>
                                            <div className="text-sm text-gray-400">{bookingData.show.theater.city}</div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-gray-400 text-sm">Seats</div>
                                            <div className="font-semibold">
                                                {bookingData.seats.join(', ')} ({bookingData.seatType})
                                            </div>
                                        </div>
                                        
                                        <div className="border-t border-gray-700 pt-4">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-400">Ticket Price</span>
                                                <span>₹{(bookingData.totalAmount - bookingData.convenienceFee - bookingData.taxAmount).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-400">Convenience Fee</span>
                                                <span>₹{bookingData.convenienceFee.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-400">Tax (18%)</span>
                                                <span>₹{bookingData.taxAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-2">
                                                <span>Total</span>
                                                <span className="text-red-400">₹{bookingData.totalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="mt-6 text-center text-sm text-gray-400">
                        <p>Your payment is secured with 256-bit SSL encryption</p>
                        <p className="mt-1">By continuing, you agree to our Terms & Conditions</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;