import React, { createContext, useContext, useState } from 'react';

// Error Types
export const ERROR_TYPES = {
  AUTHENTICATION: 'authentication',
  PAYMENT: 'payment',
  NETWORK: 'network',
  VALIDATION: 'validation',
  GENERAL: 'general'
};

// Error Context for global error management
const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const handleError = (errorObj) => {
    // Standardize error object
    const standardizedError = {
      type: errorObj.type || ERROR_TYPES.GENERAL,
      message: errorObj.message || 'An unexpected error occurred',
      code: errorObj.code || null,
      details: errorObj.details || null
    };

    setError(standardizedError);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ error, handleError, clearError }}>
      {children}
      {error && <ErrorModal error={error} onClose={clearError} />}
    </ErrorContext.Provider>
  );
};

// Global error hook
export const useError = () => useContext(ErrorContext);

// Error Modal Component
const ErrorModal = ({ error, onClose }) => {
  const getErrorDetails = () => {
    switch (error.type) {
      case ERROR_TYPES.AUTHENTICATION:
        return {
          title: 'Authentication Error',
          description: 'There was a problem with your login or account access.',
          color: 'text-red-600'
        };
      case ERROR_TYPES.PAYMENT:
        return {
          title: 'Payment Processing Error',
          description: 'We couldn\'t complete your payment. Please try again.',
          color: 'text-orange-600'
        };
      case ERROR_TYPES.NETWORK:
        return {
          title: 'Network Error',
          description: 'Please check your internet connection and try again.',
          color: 'text-yellow-600'
        };
      case ERROR_TYPES.VALIDATION:
        return {
          title: 'Validation Error',
          description: 'Please check your input and try again.',
          color: 'text-blue-600'
        };
      default:
        return {
          title: 'Unexpected Error',
          description: 'An unexpected error occurred.',
          color: 'text-gray-600'
        };
    }
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-dark-card p-6 rounded-lg max-w-md w-full">
        <div className={`text-2xl font-bold mb-4 ${errorDetails.color}`}>
          {errorDetails.title}
        </div>
        <p className="mb-4 text-white">
          {error.message || errorDetails.description}
        </p>
        {error.details && (
          <details className="mb-4 text-gray-400">
            <summary>Error Details</summary>
            <pre className="bg-black p-2 rounded mt-2 overflow-x-auto">
              {JSON.stringify(error.details, null, 2)}
            </pre>
          </details>
        )}
        <button
          onClick={onClose}
          className="w-full bg-brand-orange text-white p-2 rounded hover:bg-orange-700 transition"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

// Utility function for wrapping async operations with error handling
export const withErrorHandling = (asyncFunction) => async (...args) => {
  const { handleError } = useError();
  try {
    return await asyncFunction(...args);
  } catch (error) {
    handleError({
      type: error.type || ERROR_TYPES.GENERAL,
      message: error.message,
      code: error.code,
      details: error
    });
    throw error;
  }
};
