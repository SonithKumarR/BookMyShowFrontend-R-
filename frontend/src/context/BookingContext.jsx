import React, { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const BookingContext = createContext({});

export const BookingProvider = ({ children }) => {
    const [bookingData, setBookingData] = useState({
        show: null,
        seats: [],
        seatType: 'CLASSIC',
        totalAmount: 0,
        convenienceFee: 0,
        taxAmount: 0,
        bookingStep: 1 // 1: Select seats, 2: Review, 3: Payment
    });

    const [isLoading, setIsLoading] = useState(false);

    const selectShow = useCallback((show) => {
        setBookingData(prev => ({
            ...prev,
            show,
            seats: [],
            totalAmount: 0,
            bookingStep: 1
        }));
        toast.success('Show selected');
    }, []);

    const selectSeats = useCallback((seats, seatType, prices) => {
        const totalSeats = seats.length;
        const seatPrice = seatType === 'PREMIUM' ? 
            bookingData.show.pricePremium : bookingData.show.priceClassic;
        const subtotal = seatPrice * totalSeats;
        const convenienceFee = totalSeats * 30;
        const taxAmount = subtotal * 0.18;
        const totalAmount = subtotal + convenienceFee + taxAmount;

        setBookingData(prev => ({
            ...prev,
            seats,
            seatType,
            totalAmount,
            convenienceFee,
            taxAmount,
            bookingStep: 2
        }));

        toast.success(`${seats.length} seat(s) selected`);
    }, [bookingData.show]);

    const proceedToPayment = useCallback(() => {
        setBookingData(prev => ({
            ...prev,
            bookingStep: 3
        }));
    }, []);

    const completeBooking = useCallback(() => {
        setBookingData({
            show: null,
            seats: [],
            seatType: 'CLASSIC',
            totalAmount: 0,
            convenienceFee: 0,
            taxAmount: 0,
            bookingStep: 1
        });
        toast.success('Booking completed successfully!');
    }, []);

    const cancelBooking = useCallback(() => {
        setBookingData({
            show: null,
            seats: [],
            seatType: 'CLASSIC',
            totalAmount: 0,
            convenienceFee: 0,
            taxAmount: 0,
            bookingStep: 1
        });
        toast.info('Booking cancelled');
    }, []);

    const value = {
        bookingData,
        isLoading,
        selectShow,
        selectSeats,
        proceedToPayment,
        completeBooking,
        cancelBooking,
        setIsLoading
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};

export default BookingContext;