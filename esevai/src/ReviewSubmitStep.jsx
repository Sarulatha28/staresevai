import React from 'react';

const ReviewSubmitStep = ({ formData, uploadedImages, goToPreviousStep, handleFinalSubmit }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Review Your Application</h3>
      
      {/* Personal Details Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold text-lg mb-3 text-blue-800">Personal Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><strong>Name:</strong> {formData.name || "Not provided"}</div>
          <div><strong>Aadhar Name:</strong> {formData.aadharName || "Not provided"}</div>
          <div><strong>Aadhar Number:</strong> {formData.aadharNumber || "Not provided"}</div>
          <div><strong>Father's Name:</strong> {formData.fatherName || "Not provided"}</div>
          <div><strong>Mother's Name:</strong> {formData.motherName || "Not provided"}</div>
          <div><strong>Date of Birth:</strong> {formData.dob || "Not provided"}</div>
          <div><strong>Mobile Number:</strong> {formData.mobileNumber || "Not provided"}</div>
          <div><strong>Address:</strong> {formData.address || "Not provided"}</div>
        </div>
      </div>
      
      {/* Patta Details Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold text-lg mb-3 text-blue-800">Patta Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><strong>Service Type:</strong> {formData.pattaOption || "Not provided"}</div>
          <div><strong>District:</strong> {formData.district || "Not provided"}</div>
          <div><strong>Taluk:</strong> {formData.taluk || "Not provided"}</div>
          <div><strong>Village:</strong> {formData.village || "Not provided"}</div>
          <div><strong>Area Type:</strong> {formData.areaType || "Not provided"}</div>
          <div><strong>Reason:</strong> {formData.reason || "Not provided"}</div>
        </div>
      </div>

      {/* Land Details Section */}
     <div className="bg-gray-50 p-4 rounded-lg mb-4">
  <h4 className="font-semibold text-lg mb-3 text-blue-800">Land Details</h4>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <div><strong>Survey No:</strong> {formData.surveyNo || "Not provided"}</div>
    <div><strong>Sub Division No:</strong> {formData.subDivisionNo || "Not provided"}</div>
    <div><strong>SRO Name:</strong> {formData.sroName || "Not provided"}</div>
    <div>
      <strong>Registration Doc No:</strong>{" "}
      {formData.regDocNo && formData.docYear 
        ? `${formData.regDocNo}/${formData.docYear}`
        : "Not provided"
      }
    </div>
    <div><strong>Registered Date:</strong> {formData.registeredDate || "Not provided"}</div>
    <div><strong>Land Category:</strong> {formData.landCategory || "Not provided"}</div>
  </div>

      </div>

      {/* Uploaded Documents Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-lg mb-3 text-blue-800">Uploaded Documents</h4>
        <p className="mb-3"><strong>Total Documents:</strong> {uploadedImages.length}</p>
        {uploadedImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="border rounded-lg p-2 bg-white">
                <div className="w-full h-20 bg-blue-100 rounded flex items-center justify-center mb-2">
                  <span className="text-xl">📄</span>
                </div>
                <p className="text-xs text-gray-600 truncate text-center">{image.name}</p>
                <p className="text-xs text-green-600 font-medium text-center">Uploaded ✓</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-500">No documents uploaded</p>
        )}
      </div>

      {/* Final Action Buttons */}
      <div className="flex justify-between space-x-4">
        <button
          onClick={goToPreviousStep}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition flex-1"
        >
          Back to Documents
        </button>
        
        <button
          onClick={handleFinalSubmit}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex-1"
        >
          Confirm and Submit Application
        </button>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Please review all information carefully before submitting. You cannot make changes after submission.</p>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;