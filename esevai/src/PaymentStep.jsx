import React, { useState } from 'react';

const PaymentStep = ({ formData, goToPreviousStep, handlePaymentSubmit }) => {
  const [screenshot, setScreenshot] = useState(null);
  const [amount, setAmount] = useState(100);

  const handleFileUpload = (e) => {
  const file = e.target.files[0]; // single file
  if (!file) return;

  if (file.size > 400 * 1024) { // 400KB limit
    alert(`${file.name} exceeds 400KB limit`);
    return;
  }

  setScreenshot(file);
};

  


  const handleSubmit = async () => {
  if (!screenshot) {
    alert('Please upload payment screenshot');
    return;
  }

  const paymentData = new FormData();
  paymentData.append('name', formData.name);
  paymentData.append('mobileNumber', formData.mobileNumber);
  paymentData.append('amount', amount);
  paymentData.append('paymentFile', screenshot);
  
  try {
    const response = await fetch(`${BASE_URL}/api/payments/submit`, {
      method: 'POST',
      body: paymentData
    });

    const result = await response.json();
    
    if (result.success) {
      handlePaymentSubmit();
    } else {
      alert('Payment submission failed: ' + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error submitting payment. Please ensure backend server is running.');
  }
};
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Pay: ₹{amount}
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Payment Screenshot *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={goToPreviousStep}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Submit Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;