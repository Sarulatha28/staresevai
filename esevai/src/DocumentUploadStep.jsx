import React, { useState } from 'react';

const DocumentUploadStep = ({ uploadedImages, handleImageUpload, removeImage, goToPreviousStep, handleReviewSubmit }) => {
  const [fileErrors, setFileErrors] = useState({});

  const documentTypes = [
    { id: 1, name: "Encumbrance certificate", required: true },
    { id: 2, name: "Page of Deed/Document showing details of transferer and transferee", required: true },
    { id: 3, name: "Reverse page showing registration details with finger prints", required: true },
    { id: 4, name: "Page showing schedule of property", required: true },
    { id: 5, name: "Parent Document with complete chain of transactions", required: true },
    { id: 6, name: "Legal heir certificate", required: false },
    { id: 7, name: "Death certificate", required: false },
    { id: 8, name: "Aadhar card photo", required: false }
  ];

  const handleDocumentUpload = (documentId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type - Only PDF allowed
    if (file.type !== 'application/pdf') {
      setFileErrors(prev => ({
        ...prev,
        [documentId]: "Please upload PDF files only"
      }));
      event.target.value = '';
      return;
    }

    // Check file size (400KB limit)
    if (file.size > 400 * 1024) {
      setFileErrors(prev => ({
        ...prev,
        [documentId]: "Please upload file below 400KB"
      }));
      event.target.value = '';
      return;
    }

    // Clear any previous errors
    setFileErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[documentId];
      return newErrors;
    });

    // Check if document already exists
    const existingDocIndex = uploadedImages.findIndex(img => img.documentType === documentId);
    if (existingDocIndex !== -1) {
      removeImage(existingDocIndex);
    }

    // Create image object with the actual File object
    const newImage = {
      id: Date.now(),
      name: documentTypes.find(doc => doc.id === documentId)?.name || file.name,
      file: file,
      documentType: documentId,
      type: 'pdf' // Add type indicator
    };

    handleImageUpload([newImage]);
    event.target.value = '';
  };

  const handleRemoveDocument = (index, documentId) => {
    removeImage(index);
    setFileErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[documentId];
      return newErrors;
    });
  };

  const getUploadedDocument = (documentId) => {
    return uploadedImages.find(img => img.documentType === documentId);
  };

  const isSubmitDisabled = () => {
    const requiredDocs = documentTypes.filter(doc => doc.required);
    const uploadedRequiredDocs = requiredDocs.filter(doc => 
      uploadedImages.some(img => img.documentType === doc.id)
    );
    return uploadedRequiredDocs.length < requiredDocs.length;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Land Documents</h3>
      <p className="text-gray-600 mb-6">Please upload relevant land documents in PDF format only (Max 400KB each)</p>
      
      {/* File type warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Important Note
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Only PDF files are accepted. Please convert images or other file types to PDF before uploading.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Document Upload List */}
      <div className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left w-8">Check</th>
                <th className="border border-gray-300 px-4 py-2 text-left w-12">S.No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Attachment (PDF Only - Maximum Size 400KB)</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {documentTypes.map((doc, index) => {
                const uploadedDoc = getUploadedDocument(doc.id);
                return (
                  <tr key={doc.id} className="border-b border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <input 
                        type="checkbox" 
                        checked={!!uploadedDoc} 
                        readOnly 
                        className="h-4 w-4 text-blue-600"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <label className="text-sm font-medium text-gray-700">
                        {doc.name}
                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="file"
                        accept=".pdf" // Only accept PDF files
                        onChange={(e) => handleDocumentUpload(doc.id, e)}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {fileErrors[doc.id] && (
                        <p className="text-red-500 text-xs mt-1">{fileErrors[doc.id]}</p>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {uploadedDoc ? (
                        <span className="text-green-600 text-sm font-medium">✓ Uploaded</span>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          {doc.id === 5 ? "Check physical copy" : "Pending upload"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Declaration Checkbox */}
        <div className="mt-6 flex items-start">
          <input 
            type="checkbox" 
            id="declaration" 
            className="h-4 w-4 text-blue-600 rounded mt-1"
            required
          />
          <label htmlFor="declaration" className="ml-2 text-sm text-gray-700">
            Declare that lands are not covered under land ceiling/assignment/panchami lands/court disputes
          </label>
        </div>
      </div>

      {/* Uploaded Documents Preview */}
      {uploadedImages.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Uploaded Documents ({uploadedImages.length}/8)</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={image.id} className="relative border rounded-lg p-2 bg-gray-50">
                <div className="w-full h-24 bg-red-100 rounded flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                  <span className="ml-2 text-xs font-medium text-red-700">PDF</span>
                </div>
                <button
                  onClick={() => handleRemoveDocument(index, image.documentType)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
                <p className="text-xs text-gray-600 truncate mt-1">{image.name}</p>
                <p className="text-xs text-green-600 font-medium">Uploaded</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Back
        </button>
        
        <button
          onClick={handleReviewSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isSubmitDisabled()}
        >
          Review and Submit
        </button>
      </div>
    </div>
  );
};

export default DocumentUploadStep;