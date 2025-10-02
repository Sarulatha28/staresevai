import React, { useState } from 'react';

const CANStep = ({ hasCAN, setHasCAN, canNumber, setCanNumber, userName, setUserName, onSuccess }) => {
  const [errorMsg, setErrorMsg] = useState("");

  const handleContinue = () => {
    setErrorMsg("");
    
    if (hasCAN === true) {
      // Validate CAN user inputs
      if (userName.trim() === '') {
        setErrorMsg('Please enter your Name');
        return;
      }
      if (canNumber.trim() === '') {
        setErrorMsg('Please enter your CAN number');
        return;
      }
      
      // For CAN users, just continue to next step without backend submission
      console.log('CAN User continuing:', { userName, canNumber });
      if (onSuccess) onSuccess(true, userName.trim(), canNumber.trim());
      
    } else if (hasCAN === false) {
      // For non-CAN users, continue to personal details
      if (onSuccess) onSuccess(false);
    }
  };

  const resetSelection = () => {
    setHasCAN(null);
    setCanNumber('');
    setUserName('');
    setErrorMsg('');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl mb-8 border border-blue-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {hasCAN === null ? 'Do you have a CAN Number?' : 'Enter CAN Details'}
      </h3>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠</span>
            {errorMsg}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {hasCAN === null ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setHasCAN(true)}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold shadow-lg"
            >
              Yes, I have CAN Number
            </button>
            <button
              onClick={() => setHasCAN(false)}
              className="px-8 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold shadow-lg"
            >
              No, I don't have CAN
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="font-medium text-blue-800">
                {hasCAN ? 'Yes, I have CAN Number' : "No, I don't have CAN"}
              </span>
              <button
                onClick={resetSelection}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold bg-blue-100 px-3 py-1 rounded-lg transition-colors"
              >
                Change Selection
              </button>
            </div>

            {hasCAN === true && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CAN Number *
                  </label>
                  <input
                    type="text"
                    value={canNumber}
                    onChange={(e) => setCanNumber(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="Enter your CAN number"
                    required
                  />
                </div>
                
                
              </div>
            )}

            <button
              onClick={handleContinue}
              className={`w-full px-6 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                hasCAN 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              {hasCAN ? 'Continue ' : 'Continue to Personal Details'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CANStep;