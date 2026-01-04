import React from 'react';
import { FaCreditCard, FaMobileAlt, FaUniversity, FaWallet } from 'react-icons/fa';

const PaymentMethods = ({ selectedMethod, onMethodSelect }) => {
  const methods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <FaCreditCard />,
      description: 'Pay with Visa, MasterCard, RuPay'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: <FaMobileAlt />,
      description: 'Pay using UPI apps'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <FaUniversity />,
      description: 'All major banks'
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: <FaWallet />,
      description: 'Paytm, PhonePe, etc.'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Select Payment Method</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {methods.map(method => (
          <button
            key={method.id}
            onClick={() => onMethodSelect(method.id)}
            className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center ${
              selectedMethod === method.id
                ? 'border-red-500 bg-red-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="text-2xl mb-2">
              {method.icon}
            </div>
            <div className="font-semibold text-center">{method.name}</div>
            <div className="text-xs text-gray-400 text-center mt-1">
              {method.description}
            </div>
          </button>
        ))}
      </div>
      
      {/* Popular UPI Apps */}
      {selectedMethod === 'upi' && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400 mb-3">Popular UPI Apps:</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
              <button
                key={app}
                className="p-3 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm transition-colors"
              >
                {app}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;