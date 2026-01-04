import api from './api';

export const paymentService = {
    // Initiate payment
    initiatePayment: async (paymentData) => {
        try {
            const response = await api.post('/payments/initiate', paymentData);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Initiate payment error:', error);
            return {
                success: false,
                message: error.message || 'Failed to initiate payment'
            };
        }
    },
    
    // Verify payment
    verifyPayment: async (verificationData) => {
        try {
            const response = await api.post('/payments/verify', verificationData);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Verify payment error:', error);
            return {
                success: false,
                message: error.message || 'Payment verification failed'
            };
        }
    },
    
    // Get payment details
    getPaymentDetails: async (paymentId) => {
        try {
            const response = await api.get(`/payments/${paymentId}`);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Get payment details error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch payment details'
            };
        }
    },
    
    // Process refund
    processRefund: async (paymentId, reason) => {
        try {
            const response = await api.post(`/payments/${paymentId}/refund`, { reason });
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Process refund error:', error);
            return {
                success: false,
                message: error.message || 'Failed to process refund'
            };
        }
    },
    
    // Initiate Razorpay payment
    initiateRazorpay: async (bookingId, amount) => {
        try {
            const response = await api.post('/payments/razorpay/initiate', {
                bookingId,
                amount
            });
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Initiate Razorpay error:', error);
            return {
                success: false,
                message: error.message || 'Failed to initiate Razorpay payment'
            };
        }
    },
    
    // Initiate UPI payment
    initiateUPI: async (bookingId, amount, phone) => {
        try {
            const response = await api.post('/payments/upi/initiate', {
                bookingId,
                amount,
                customerPhone: phone
            });
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Initiate UPI error:', error);
            return {
                success: false,
                message: error.message || 'Failed to initiate UPI payment'
            };
        }
    },
    
    // Check UPI payment status
    checkUPIStatus: async (orderId) => {
        try {
            const response = await api.get(`/payments/upi/status/${orderId}`);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Check UPI status error:', error);
            return {
                success: false,
                message: error.message || 'Failed to check UPI status'
            };
        }
    },
    
    // Initiate Stripe payment
    initiateStripe: async (bookingId, amount) => {
        try {
            const response = await api.post('/payments/stripe/initiate', {
                bookingId,
                amount
            });
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Initiate Stripe error:', error);
            return {
                success: false,
                message: error.message || 'Failed to initiate Stripe payment'
            };
        }
    },
    
    // Get payment methods
    getPaymentMethods: async () => {
        try {
            const response = await api.get('/payments/methods');
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Get payment methods error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch payment methods'
            };
        }
    },
    
    // Get user payment history
    getPaymentHistory: async (userId) => {
        try {
            const response = await api.get(`/payments/user/${userId}`);
            return {
                success: true,
                data: response,
                total: response.length
            };
        } catch (error) {
            console.error('Get payment history error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch payment history'
            };
        }
    },
    
    // Validate payment data
    validatePaymentData: (paymentData) => {
        const errors = {};
        
        if (!paymentData.bookingId) {
            errors.bookingId = 'Booking ID is required';
        }
        
        if (!paymentData.amount || paymentData.amount <= 0) {
            errors.amount = 'Valid amount is required';
        }
        
        if (!paymentData.paymentMethod) {
            errors.paymentMethod = 'Payment method is required';
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    },
    
    // Format amount for display
    formatAmount: (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    },
    
    // Calculate tax and fees
    calculatePaymentBreakdown: (amount, convenienceFee = 30) => {
        const subtotal = amount - convenienceFee;
        const tax = subtotal * 0.18;
        const total = subtotal + tax + convenienceFee;
        
        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            convenienceFee,
            total: parseFloat(total.toFixed(2))
        };
    }
};

export default paymentService;