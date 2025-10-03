// ReviewSubmitStep.jsx - Updated version
import React, { useState } from "react";

const ReviewSubmitStep = ({ 
  formData, 
  uploadedImages, 
  hasCAN, 
  canNumber, 
  userName, 
  goToPreviousStep, 
  handleFinalSubmit 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Document type mapping
  const documentTypeMap = {
    1: 'Encumbrance certificate',
    2: 'Page of Deed/Document showing details of transferer and transferee',
    3: 'Reverse page of Page showing the registration details along with finger prints of the transferer and transferee',
    4: 'Page showing schedule of property',
    5: 'Parent Document with complete chain of transactions',
    6: 'Legal heir certificate',
    7: 'Death certificate',
    8: 'Aadhaar card'
  };

  // Enhanced submit handler with faster processing
  const handleQuickSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    
    try {
      // Show immediate feedback
      const shouldSubmit = window.confirm(
        "Are you sure you want to submit your application? Please review all details before confirming."
      );
      
      if (!shouldSubmit) {
        setIsSubmitting(false);
        return;
      }

      // Process submission without artificial delays
      await handleFinalSubmit();
      
      // Show success message
      alert("Application submitted successfully! Your request has been processed.");
      
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-blue-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        Review & Submit Application
      </h2>

      {/* CAN Verification Section - Show only when CAN is Yes */}
      {hasCAN === true && (
        <div className="mb-8 p-6 bg-green-50 rounded-xl border border-green-200">
          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            <span className="mr-2">✅</span>
            CAN Verified User
          </h3>
          <p className="text-green-700 mb-4">
            Your application is processed with CAN verification benefits
          </p>
          
          <div className="border-t border-green-200 pt-4">
            <h4 className="font-semibold text-green-800 mb-3">CAN Verification Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-700">CAN Holder Name:</label>
                <p className="text-lg font-semibold text-green-900">{userName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700">CAN Number:</label>
                <p className="text-lg font-semibold text-green-900">{canNumber}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personal Details Section - Show only when CAN is No */}
      {hasCAN === false && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">Full Name:</label>
              <p className="text-lg font-semibold text-gray-900">{formData.name || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Aadhar Name:</label>
              <p className="text-lg font-semibold text-gray-900">{formData.aadharName || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Aadhar Number:</label>
              <p className="text-lg font-semibold text-gray-900">{formData.aadharNumber || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Father's Name:</label>
              <p className="text-lg font-semibold text-gray-900">{formData.fatherName || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Mother's Name:</label>
              <p className="text-lg font-semibold text-gray-900">{formData.motherName || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Date of Birth:</label>
              <p className="text-lg font-semibold text-gray-900">{formData.dob || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Mobile Number:</label>
              <p className="text-lg font-semibold text-gray-900">{formData.mobileNumber || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Address:</label>
              <p className="text-lg font-semibold text-gray-900">{formData.address || "Not provided"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Patta Options Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Patta Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Patta Option:</label>
            <p className="text-lg font-semibold text-gray-900">{formData.pattaOption || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">District:</label>
            <p className="text-lg font-semibold text-gray-900">{formData.district || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Taluk:</label>
            <p className="text-lg font-semibold text-gray-900">{formData.taluk || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Village:</label>
            <p className="text-lg font-semibold text-gray-900">{formData.village || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Area Type:</label>
            <p className="text-lg font-semibold text-gray-900">{formData.areaType || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Reason for Transfer:</label>
            <p className="text-lg font-semibold text-gray-900">{formData.reason || "Not provided"}</p>
          </div>
        </div>
      </div>

      {/* Land Details Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Land Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Survey Number:</label>
            <p className="text-lg font-semibold text-gray-900">{formData.surveyNo || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Sub Division Number:</label>
            <p className="text-lg font-semibold text-gray-900">{formData.subDivisionNo || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">SRO Name:</label>
            <p className="text-lg font-semibold text-gray-900">{formData.sroName || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Registration Document No:</label>
            <p className="text-lg font-semibold text-gray-900">{formData.regDocNo || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Document Year:</label>
            <p className="text-lg font-semibold text-gray-900">{formData.docYear || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Registered Date:</label>
            <p className="text-lg font-semibold text-gray-900">{formData.registeredDate || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Land Category:</label>
            <p className="text-lg font-semibold text-gray-900">{formData.landCategory || "Not provided"}</p>
          </div>
        </div>
      </div>

      {/* Uploaded Documents Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Uploaded Documents ({uploadedImages.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="border rounded-lg p-3 text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <p className="text-sm font-medium text-gray-700 truncate">
                {documentTypeMap[image.documentType] || `Document ${image.documentType}`}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {image.file.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between space-x-4 pt-6 border-t border-gray-200">
        <button
          onClick={goToPreviousStep}
          disabled={isSubmitting}
          className="bg-gray-500 text-white px-8 py-3 rounded-xl hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 active:scale-95 flex-1 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        <button
          onClick={handleQuickSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 active:scale-95 flex-1 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Application ✓"}
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;