import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || "https://staresevaimaiyam.onrender.com";

const CANStep = ({ hasCAN, setHasCAN, canNumber, setCanNumber, onSuccess }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        if (onSuccess) onSuccess(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, onSuccess]);

  const handleSubmitCAN = async () => {
    setErrorMsg("");
    if (userName.trim() === '') {
      setErrorMsg('Please enter your Name');
      return;
    }
    if (canNumber.trim() === '') {
      setErrorMsg('Please enter your CAN number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/can/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName.trim(),
          canNumber: canNumber.trim()
        })
      });

      // Try to parse JSON, but handle non-JSON gracefully
      let result;
      const text = await response.text();
      try {
        result = text ? JSON.parse(text) : {};
      } catch (e) {
        result = { success: response.ok, message: text || (response.ok ? 'OK' : 'Server error') };
      }

      if (response.ok && result.success) {
        setIsSubmitted(true);
      } else {
        // Show server-side message if present
        const msg = result.message || `Server returned ${response.status}`;
        setErrorMsg(msg);
        alert('Failed to save CAN record: ' + msg);
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrorMsg('Network error. Please check your connection or backend URL.');
      alert('Error submitting CAN details. Please ensure backend server is reachable.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (hasCAN === true) {
      handleSubmitCAN();
    } else if (hasCAN === false) {
      if (onSuccess) onSuccess(false);
    }
  };

  const resetSelection = () => {
    setHasCAN(null);
    setCanNumber('');
    setUserName('');
    setIsSubmitted(false);
    setErrorMsg('');
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            CAN Details Submitted Successfully!
          </h3>
          <p className="text-gray-600">Redirecting to services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl mb-8 border border-blue-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {hasCAN === null ? 'Do you have a CAN Number?' : 'Enter CAN Details'}
      </h3>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
          {errorMsg}
        </div>
      )}

      <div className="space-y-6">
        {hasCAN === null ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setHasCAN(true)}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold"
            >
              Yes, I have CAN Number
            </button>
            <button
              onClick={() => setHasCAN(false)}
              className="px-8 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold"
            >
              No, I don't have CAN
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-800">
                {hasCAN ? 'Yes, I have CAN Number' : "No, I don't have CAN"}
              </span>
              <button
                onClick={resetSelection}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
              >
                Change Selection
              </button>
            </div>

            {hasCAN === true && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CAN Number
                  </label>
                  <input
                    type="text"
                    value={canNumber}
                    onChange={(e) => setCanNumber(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="Enter your CAN number"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleContinue}
              className={`w-full px-6 py-4 rounded-xl text-lg font-semibold shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : (hasCAN ? 'Submit CAN Details' : 'Continue Without CAN')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CANStep;
