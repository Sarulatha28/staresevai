import React, { useState, useRef } from 'react';

const BASE_URL = "https://staresevaimaiyam.onrender.com";

const PaymentStep = ({ formData, goToPreviousStep, handlePaymentSubmit }) => {
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset error
    setError('');

    // Validate file size (400KB limit)
    if (file.size > 400 * 1024) {
      setError(`${file.name} exceeds 400KB limit. Please choose a smaller file.`);
      fileInputRef.current.value = '';
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, GIF, WEBP)');
      fileInputRef.current.value = '';
      return;
    }

    setScreenshot(file);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setScreenshotPreview(previewUrl);
  };

  const handleSubmit = async () => {
    if (!screenshot) {
      setError('Please upload payment screenshot');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const paymentData = new FormData();
      paymentData.append('name', formData.name);
      paymentData.append('mobileNumber', formData.mobileNumber);
      paymentData.append('paymentFile', screenshot);
      
      console.log('Submitting payment to:', `${BASE_URL}/api/payments/submit`);
      
      const response = await fetch(`${BASE_URL}/api/payments/submit`, {
        method: 'POST',
        body: paymentData,
        // Don't set Content-Type header - let browser set it with boundary
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Clean up preview URL
        if (screenshotPreview) {
          URL.revokeObjectURL(screenshotPreview);
        }
        handlePaymentSubmit();
      } else {
        throw new Error(result.message || 'Payment submission failed');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      setError(`Error submitting payment: ${error.message}. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  // Clean up preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (screenshotPreview) {
        URL.revokeObjectURL(screenshotPreview);
      }
    };
  }, [screenshotPreview]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Pay: ₹100
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Payment Screenshot *
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            disabled={uploading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPG, PNG, GIF, WEBP. Max size: 400KB
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Preview Section */}
        {screenshotPreview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <div className="border border-gray-300 rounded-lg p-2 max-w-xs">
              <img 
                src={screenshotPreview} 
                alt="Payment screenshot preview" 
                className="max-w-full max-h-48 object-contain mx-auto"
                onError={(e) => {
                  console.error('Error loading preview image');
                  e.target.style.display = 'none';
                }}
              />
              <p className="text-xs text-center text-gray-500 mt-2 truncate">
                {screenshot?.name}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            onClick={goToPreviousStep}
            disabled={uploading}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!screenshot || uploading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center min-w-32"
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              'Submit Payment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;