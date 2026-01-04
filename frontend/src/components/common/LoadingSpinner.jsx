import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'red', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-8 w-8 border-2',
    medium: 'h-12 w-12 border-2',
    large: 'h-16 w-16 border-4'
  };

  const colorClasses = {
    red: 'border-red-500',
    white: 'border-white',
    gray: 'border-gray-500'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} border-t-transparent`}></div>
      {message && (
        <div className="mt-4 text-gray-400">{message}</div>
      )}
    </div>
  );
};

export default LoadingSpinner;