import React, { useState, useEffect } from 'react';

const CANStep = ({ hasCAN, setHasCAN, canNumber, setCanNumber, onSuccess }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Add useEffect to handle the redirect after showing success message for 2 seconds
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        // Call onSuccess with true for "Yes CAN" case
        if (onSuccess) onSuccess(true);
      }, 2000); // Changed from 1500ms to 2000ms for 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, onSuccess]);

  const handleContinue = () => {
    if (hasCAN === true) {
      // If user has CAN number, validate it first
      if (canNumber.trim() === '') {
        alert('Please enter your CAN number');
        return;
      }
      
      // Show success message briefly
      setIsSubmitted(true);
      // The useEffect will handle showing the main page after 2 seconds
      
    } else if (hasCAN === false) {
      // If user doesn't have CAN, call onSuccess with false to go to next step immediately
      if (onSuccess) onSuccess(false);
    }
  };

  const resetSelection = () => {
    setHasCAN(null);
    setCanNumber('');
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            CAN Number Submitted Successfully!
          </h3>
          <p className="text-gray-600">
            Redirecting to services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {hasCAN === null ? 'Do you have a CAN Number?' : 'CAN Number Information'}
      </h3>
      
      <div className="space-y-4">
        {hasCAN === null ? (
          // Initial selection
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setHasCAN(true)}
              className={`px-6 py-3 rounded-lg transition ${
                hasCAN === true ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Yes, I have CAN Number
            </button>
            <button
              onClick={() => setHasCAN(false)}
              className={`px-6 py-3 rounded-lg transition ${
                hasCAN === false ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              No, I don't have CAN
            </button>
          </div>
        ) : (
          // After selection made
          <div className="space-y-4">
            {/* Current selection display */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {hasCAN ? 'Yes, I have CAN Number' : 'No, I don\'t have CAN'}
              </span>
              <button
                onClick={resetSelection}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Change
              </button>
            </div>

            {/* CAN number input if yes */}
            {hasCAN === true && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter CAN Number
                </label>
                <input
                  type="text"
                  value={canNumber}
                  onChange={(e) => setCanNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your CAN number"
                />
              </div>
            )}

            {/* Continue button */}
            <button
              onClick={handleContinue}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition mt-4 w-full"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CANStep;