import React, { useState } from 'react';
import { 
  FaCreditCard, 
  FaMobileAlt, 
  FaUniversity, 
  FaWallet,
  FaLock,
  FaCheckCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { paymentAPI } from '../../services/api';

const PaymentGateway = ({ bookingId, amount, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [netBanking, setNetBanking] = useState('hdfc');
  const [wallet, setWallet] = useState('paytm');
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: <FaCreditCard />, color: 'text-blue-500' },
    { id: 'upi', name: 'UPI', icon: <FaMobileAlt />, color: 'text-purple-500' },
    { id: 'netbanking', name: 'Net Banking', icon: <FaUniversity />, color: 'text-green-500' },
    { id: 'wallet', name: 'Wallet', icon: <FaWallet />, color: 'text-yellow-500' },
  ];

  const banks = [
    { id: 'hdfc', name: 'HDFC Bank' },
    { id: 'icici', name: 'ICICI Bank' },
    { id: 'sbi', name: 'State Bank of India' },
    { id: 'axis', name: 'Axis Bank' },
    { id: 'kotak', name: 'Kotak Mahindra Bank' },
  ];

  const wallets = [
    { id: 'paytm', name: 'Paytm' },
    { id: 'phonepe', name: 'PhonePe' },
    { id: 'googlepay', name: 'Google Pay' },
    { id: 'amazonpay', name: 'Amazon Pay' },
  ];

  const handleCardInput = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      // Format card number with spaces
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }

    if (name === 'expiry') {
      // Format expiry date
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
      if (formattedValue.length > 5) return;
    }

    if (name === 'cvv') {
      if (value.length > 3) return;
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateCard = () => {
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length !== 16) {
      toast.error('Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardDetails.name.trim()) {
      toast.error('Please enter cardholder name');
      return false;
    }
    if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      toast.error('Please enter valid expiry date (MM/YY)');
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      toast.error('Please enter valid CVV');
      return false;
    }
    return true;
  };

  const validateUpi = () => {
    if (!upiId || !/^[\w.-]+@[\w]+$/.test(upiId)) {
      toast.error('Please enter valid UPI ID');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);

      // Validate based on selected method
      let isValid = false;
      switch (selectedMethod) {
        case 'card':
          isValid = validateCard();
          break;
        case 'upi':
          isValid = validateUpi();
          break;
        case 'netbanking':
        case 'wallet':
          isValid = true;
          break;
        default:
          toast.error('Please select a payment method');
          return;
      }

      if (!isValid) {
        setProcessing(false);
        return;
      }

      // Initiate payment
      const paymentRequest = {
        bookingId,
        paymentMethod: selectedMethod.toUpperCase(),
        amount
      };

      const response = await paymentAPI.initiate(paymentRequest);

      // Simulate payment processing
      setTimeout(async () => {
        try {
          // Verify payment (mock for now)
          const verificationRequest = {
            razorpayPaymentId: `pay_${Date.now()}`,
            razorpayOrderId: response.orderId,
            razorpaySignature: 'mock_signature'
          };

          await paymentAPI.verify(verificationRequest);
          
          toast.success('Payment successful!');
          onPaymentSuccess();
        } catch (error) {
          console.error('Payment verification error:', error);
          toast.error('Payment verification failed');
        } finally {
          setProcessing(false);
        }
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Payment</h2>
        <div className="text-xl font-bold text-red-400">
          ₹{amount.toFixed(2)}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      </div>

      {/* Payment Form */}
      <div className="mb-8">
        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="number"
                value={cardDetails.number}
                onChange={handleCardInput}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="name"
                value={cardDetails.name}
                onChange={handleCardInput}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardInput}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CVV
                </label>
                <input
                  type="password"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardInput}
                  placeholder="123"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'upi' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="username@upi"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="text-sm text-gray-400 mt-2">
              Enter your UPI ID to receive payment request
            </div>
          </div>
        )}

        {selectedMethod === 'netbanking' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Bank
            </label>
            <select
              value={netBanking}
              onChange={(e) => setNetBanking(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {banks.map(bank => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedMethod === 'wallet' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Wallet
            </label>
            <div className="grid grid-cols-2 gap-4">
              {wallets.map(walletOption => (
                <button
                  key={walletOption.id}
                  onClick={() => setWallet(walletOption.id)}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${wallet === walletOption.id
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                    }
                  `}
                >
                  <div className="font-semibold">{walletOption.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Security Info */}
      <div className="flex items-center justify-center mb-6 text-gray-400">
        <FaLock className="mr-2" />
        <span>Your payment is secured with 256-bit SSL encryption</span>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={processing}
        className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <FaCheckCircle className="mr-3" />
            Pay ₹{amount.toFixed(2)}
          </>
        )}
      </button>

      {/* Payment Security */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h4 className="font-semibold mb-2">Payment Security</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Your card details are secured with 256-bit SSL encryption</li>
          <li>• We do not store your card details</li>
          <li>• All transactions are PCI DSS compliant</li>
          <li>• 100% secure payment gateway</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentGateway;