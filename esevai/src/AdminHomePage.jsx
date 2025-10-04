import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || "https://staresevaimaiyam.onrender.com";

// Navbar Component
const Navbar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: 'applications', label: 'Patta Applications' },
    { id: 'payments', label: 'Payments' }
  ];

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 text-xl md:text-2xl font-bold">StarMobiles Admin</div>
          <div className="hidden md:flex space-x-4">
            <a href="/" className="hover:bg-gray-700 px-3 py-2 rounded text-sm lg:text-base">
              Home
            </a>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`hover:bg-gray-700 px-3 py-2 rounded text-sm lg:text-base ${
                  activeTab === tab.id ? 'bg-gray-900' : ''
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-gray-700">
          <a href="/" className="block px-3 py-2 rounded hover:bg-gray-600 text-base">Home</a>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-600 text-base ${
                activeTab === tab.id ? 'bg-gray-900' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

// Enhanced Application Details Modal with CAN Information
const ApplicationDetails = ({ application, onClose, onStatusUpdate }) => {
  const [status, setStatus] = useState(application.status || 'pending');
  const [activeSection, setActiveSection] = useState('personal');
  const [downloading, setDownloading] = useState(null);

  const updateStatus = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/applications/${application._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      const result = await response.json();
      if (result.success) {
        onStatusUpdate(application._id, status);
        onClose();
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };
const downloadDocument = async (doc, index) => {
  setDownloading(index);
  try {
    console.log('Attempting to download:', doc.fileName);
    
    // Try multiple endpoints for robustness
    const endpoints = [
      `${BASE_URL}/api/documents/download/${doc.fileName}`,
      `${BASE_URL}/api/documents/file/${doc.fileName}`,
      `${BASE_URL}/uploads/${doc.fileName}`
    ];

    let success = false;
    
    for (const endpoint of endpoints) {
      try {
        console.log('Trying endpoint:', endpoint);
        const response = await fetch(endpoint);
        
        if (response.ok) {
          const blob = await response.blob();
          
          // Check if blob is valid
          if (blob.size === 0) {
            console.warn('Empty blob received from:', endpoint);
            continue;
          }
          
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          
          // Use original name or generate meaningful name
          const fileName = doc.originalName && doc.originalName.endsWith('.pdf') 
            ? doc.originalName 
            : `${doc.originalName || `document_${index + 1}`}.pdf`;
          
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          console.log('Download successful from:', endpoint);
          success = true;
          break;
        }
      } catch (endpointError) {
        console.warn(`Endpoint ${endpoint} failed:`, endpointError);
        continue;
      }
    }

    if (!success) {
      throw new Error('All download methods failed');
    }
    
  } catch (error) {
    console.error('All download attempts failed:', error);
    
    // Final fallback - direct link
    try {
      const directUrl = `${BASE_URL}/uploads/${doc.fileName}`;
      console.log('Trying direct URL:', directUrl);
      window.open(directUrl, '_blank');
    } catch (fallbackError) {
      console.error('Final fallback failed:', fallbackError);
      alert('Failed to download document. Please check console for details.');
    }
  } finally {
    setDownloading(null);
  }
};

// Enhanced view function
const viewDocument = async (document) => {
  try {
    console.log('Viewing document:', document.fileName);
    
    const viewUrl = `${BASE_URL}/api/documents/view/${document.fileName}`;
    const directUrl = `${BASE_URL}/uploads/${document.fileName}`;
    
    // Try the API endpoint first
    const response = await fetch(viewUrl);
    if (response.ok) {
      window.open(viewUrl, '_blank');
    } else {
      // Fallback to direct URL
      window.open(directUrl, '_blank');
    }
  } catch (error) {
    console.error('View error:', error);
    // Final fallback
    window.open(`${BASE_URL}/uploads/${document.fileName}`, '_blank');
  }
};
 

  const getDocumentTypeName = (docType) => {
    const types = {
      1: 'Encumbrance certificate',
      2: 'Page of Deed/Document showing details of transferer and transferee',
      3: 'Reverse page of Page showing the registration details along with finger prints of the transferer an transferee',
      4: 'Page showing schedule of property',
      5: 'Parent Document with complete chain of transactions',
      6: 'Legal heir certificate',
      7: 'Death certificate',
      8: 'Aadhaar card'
    };
    return types[docType] || `Document Type ${docType}`;
  };

  const getFileIcon = (fileName) => {
    if (fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
      return '🖼️';
    } else if (fileName.match(/\.pdf$/i)) {
      return '📄';
    } else {
      return '📎';
    }
  };

  if (!application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Application Details</h2>
              <p className="text-gray-600 text-sm sm:text-base">Application ID: {application._id}</p>
              {application.hasCAN && (
                <div className="flex items-center mt-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    CAN Verified User
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
                ✕
              </button>
            </div>
          </div>

          {/* CAN Information Section - Only for CAN users */}
          {application.hasCAN && (
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 border border-blue-200">
              <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 flex items-center">
                <span className="mr-2">🔐</span>
                CAN Verification Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <strong className="text-blue-700 text-sm sm:text-base">CAN Holder Name:</strong>
                  <div className="text-gray-800 font-medium mt-1 text-sm sm:text-base">
                    {application.userName || application.name || "Not provided"}
                  </div>
                </div>
                <div>
                  <strong className="text-blue-700 text-sm sm:text-base">CAN Number:</strong>
                  <div className="text-gray-800 font-medium mt-1 text-sm sm:text-base">
                    {application.canNumber || "Not provided"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
            <nav className="flex space-x-4 sm:space-x-8 min-w-max">
              {application.hasCAN ? 
                ['can', 'patta', 'land', 'documents'].map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm capitalize whitespace-nowrap ${
                      activeSection === section
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {section === 'can' ? 'CAN Details' : `${section.replace('_', ' ')} Details`}
                  </button>
                )) : 
                ['personal', 'patta', 'land', 'documents'].map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm capitalize whitespace-nowrap ${
                      activeSection === section
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {section.replace('_', ' ')} Details
                  </button>
                ))
              }
            </nav>
          </div>

          {/* Personal Details Section - Only for non-CAN users */}
          {!application.hasCAN && activeSection === 'personal' && (
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Full Name:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.name || "Not provided"}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Aadhar Name:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.aadharName || "Not provided"}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Aadhar Number:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.aadharNumber || "Not provided"}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Mobile Number:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.mobileNumber || "Not provided"}</span>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Father's Name:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.fatherName || "Not provided"}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Mother's Name:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.motherName || "Not provided"}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Date of Birth:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">
                      {application.dob ? new Date(application.dob).toLocaleDateString() : "Not provided"}
                    </span>
                  </div>
                  {application.address && (
                    <div>
                      <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Address:</strong>
                      <p className="text-gray-900 mt-1 whitespace-pre-wrap text-sm sm:text-base">{application.address}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CAN Details Section - Only for CAN users */}
          {application.hasCAN && activeSection === 'can' && (
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4">CAN Verification Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-blue-200">
                    <strong className="text-blue-700 block mb-1 text-sm sm:text-base">CAN Holder Name:</strong>
                    <span className="text-gray-900 font-medium text-sm sm:text-base">{application.userName || application.name || "Not provided"}</span>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-blue-200">
                    <strong className="text-blue-700 block mb-1 text-sm sm:text-base">CAN Number:</strong>
                    <span className="text-gray-900 font-medium text-sm sm:text-base">{application.canNumber || "Not provided"}</span>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-blue-200">
                    <strong className="text-blue-700 block mb-1 text-sm sm:text-base">Verification Type:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">CAN Verified Application</span>
                  </div>
                  
                </div>
              </div>
            </div>
          )}

          {/* Patta Details Section */}
          {activeSection === 'patta' && (
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Patta Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Service Type:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.pattaOption || "Not provided"}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">District:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.district || "Not provided"}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Taluk:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.taluk || "Not provided"}</span>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Village:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.village || "Not provided"}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Area Type:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.areaType || "Not provided"}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Reason:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.reason || "Not provided"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Land Details Section */}
          {activeSection === 'land' && (
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Land Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Survey No:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.surveyNo || "Not provided"}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Sub Division No:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.subDivisionNo || "Not provided"}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Name of SRO:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.sroName || "Not provided"}</span>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Registration Doc No:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">
                      {application.regDocNo && application.docYear 
                        ? `${application.regDocNo}/${application.docYear}`
                        : application.regDocNo || "Not provided"
                      }
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Registered Date:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">
                      {application.registeredDate ? new Date(application.registeredDate).toLocaleDateString() : "Not provided"}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-1 text-sm sm:text-base">Land Category:</strong>
                    <span className="text-gray-900 text-sm sm:text-base">{application.landCategory || "Not provided"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Section */}
          {activeSection === 'documents' && (
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
              <p className="mb-4 text-base sm:text-lg">
                <strong>Total Documents:</strong> 
                <span className="ml-2 bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-sm font-medium">
                  {application.documents?.length || 0}
                </span>
              </p>
              
              {application.documents && application.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {application.documents.map((document, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white hover:shadow-lg transition-shadow">
                      <div className="text-center mb-3 sm:mb-4">
                        <div className="text-3xl sm:text-4xl mb-2">{getFileIcon(document.fileName)}</div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                          {document.originalName || `Document ${index + 1}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getDocumentTypeName(document.documentType)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Uploaded: {new Date(document.uploadDate).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Preview for images */}
                      {document.fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) && (
                        <div 
                          className="w-full h-24 sm:h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3 cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => viewDocument(document)}
                        >
                          <img 
                            src={`${BASE_URL}/uploads/${document.fileName}`} 
                            alt={`Preview ${index + 1}`}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden items-center justify-center">
                            <span className="text-2xl">🖼️</span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => downloadDocument(document, index)}
                          disabled={downloading === index}
                          className="flex-1 bg-blue-600 text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors text-xs sm:text-sm font-semibold flex items-center justify-center"
                        >
                          {downloading === index ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Downloading...
                            </>
                          ) : (
                            'Download'
                          )}
                        </button>
                        <button
                          onClick={() => viewDocument(document)}
                          className="flex-1 bg-green-600 text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-semibold"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="text-4xl sm:text-6xl mb-4">📂</div>
                  <p className="text-red-500 text-base sm:text-lg font-semibold">No documents uploaded</p>
                  <p className="text-gray-500 mt-2 text-sm sm:text-base">No documents were uploaded with this application</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 sm:pt-6 border-t border-gray-200 gap-4">
            <div className="text-xs sm:text-sm text-gray-500">
              Applied on: {new Date(application.createdAt).toLocaleDateString()}
              {application.updatedAt && (
                <span className="block sm:inline sm:ml-4 mt-1 sm:mt-0">
                  Last updated: {new Date(application.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base w-full sm:w-auto"
              >
                <option value="pending">Pending</option>
                <option value="in review">In Review</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={updateStatus}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                Update Status
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// CAN Details Modal
const CANDetails = ({ canRecord, onClose, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this CAN record?")) return;
    
    setIsDeleting(true);
    try {
      await onDelete(canRecord._id);
      onClose();
    } catch (error) {
      alert('Failed to delete CAN record');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!canRecord) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-2">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">CAN Record Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl">
              ✕
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700">Name</label>
              <p className="text-base sm:text-lg font-semibold text-gray-900">{canRecord.name}</p>
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700">CAN Number</label>
              <p className="text-base sm:text-lg font-semibold text-blue-600">{canRecord.canNumber}</p>
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700">Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                canRecord.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {canRecord.status}
              </span>
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700">Created Date</label>
              <p className="text-sm text-gray-600">{new Date(canRecord.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700">Expiry Date</label>
              <p className="text-sm text-gray-600">{new Date(canRecord.expiresAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm sm:text-base w-full sm:w-auto"
            >
              Close
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
            >
              {isDeleting ? 'Deleting...' : 'Delete Record'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Details Modal
const PaymentDetails = ({ payment, onClose, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this payment record?")) return;
    
    setIsDeleting(true);
    try {
      await onDelete(payment._id);
      onClose();
    } catch (error) {
      alert('Failed to delete payment record');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!payment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-2">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Payment Record Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">Name</label>
                <p className="text-base sm:text-lg font-semibold text-gray-900">{payment.name}</p>
              </div>
              
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">Mobile Number</label>
                <p className="text-base sm:text-lg font-semibold text-purple-600">{payment.mobileNumber}</p>
              </div>
              
               <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">Days Remaining</label>
                <p className="text-sm text-gray-600">
                  {Math.ceil((new Date(payment.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">Submitted Date</label>
                <p className="text-sm text-gray-600">{new Date(payment.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">Expiry Date</label>
                <p className="text-sm text-gray-600">{new Date(payment.expiresAt).toLocaleDateString()}</p>
              </div>
              
             
            </div>
          </div>

{payment.paymentScreenshot && (
  <div className="mb-3 sm:mb-4">
    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Payment Screenshot:</p>
    <div className="relative">
      <img 
        src={`${BASE_URL}/uploads/payments/${payment.paymentScreenshot}`} 
        alt={`Payment screenshot for ${payment.name}`}
        className="rounded-lg shadow-md max-w-full h-32 sm:h-48 object-contain cursor-pointer bg-gray-100"
        onError={(e) => {
          console.error('Error loading payment image:', `${BASE_URL}/uploads/payments/${payment.paymentScreenshot}`);
          e.target.style.display = 'none';
          // Show fallback message
          const fallback = document.createElement('div');
          fallback.className = 'bg-gray-200 rounded-lg h-32 sm:h-48 flex items-center justify-center';
          fallback.innerHTML = '<p class="text-gray-500 text-sm">Image not available</p>';
          e.target.parentNode.appendChild(fallback);
        }}
        onLoad={(e) => {
          console.log('Payment image loaded successfully');
        }}
      />
    </div>
    <p className="text-xs text-gray-500 mt-1">Click image to view full size</p>
  </div>
)}

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm sm:text-base w-full sm:w-auto"
            >
              Close
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
            >
              {isDeleting ? 'Deleting...' : 'Delete Record'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminHomepage = () => {
  const [applications, setApplications] = useState([]);
  const [canRecords, setCanRecords] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedCAN, setSelectedCAN] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('applications');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [applicationFilter, setApplicationFilter] = useState('all');

  // Enhanced fetchData function
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching data from:', BASE_URL);
      
      const [appsRes, canRes, paymentsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/applications/all`),
        fetch(`${BASE_URL}/api/can/all`),
        fetch(`${BASE_URL}/api/payments/all`)
      ]);

      console.log('API Responses:', {
        applications: appsRes.status,
        can: canRes.status,
        payments: paymentsRes.status
      });

      if (!appsRes.ok) throw new Error(`Applications API error: ${appsRes.status}`);
      if (!canRes.ok) throw new Error(`CAN API error: ${canRes.status}`);
      if (!paymentsRes.ok) throw new Error(`Payments API error: ${paymentsRes.status}`);

      const appsResult = await appsRes.json();
      const canResult = await canRes.json();
      const paymentsResult = await paymentsRes.json();

      if (appsResult.success) {
        const sortedApps = appsResult.applications?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ) || [];
        setApplications(sortedApps);
      } else {
        throw new Error(appsResult.message || 'Failed to fetch applications');
      }

      if (canResult.success) {
        setCanRecords(canResult.canRecords || []);
      } else {
        throw new Error(canResult.message || 'Failed to fetch CAN records');
      }

      if (paymentsResult.success) {
        setPayments(paymentsResult.payments || []);
      } else {
        throw new Error(paymentsResult.message || 'Failed to fetch payments');
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Failed to fetch data: ${error.message}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Filter applications based on CAN status
  const filteredApplications = applications.filter(app => {
    if (applicationFilter === 'can') return app.hasCAN === true;
    if (applicationFilter === 'non-can') return app.hasCAN === false;
    return true;
  });

  const canApplications = applications.filter(app => app.hasCAN === true);
  const nonCanApplications = applications.filter(app => app.hasCAN === false);

  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId);
    try {
      const response = await fetch(`${BASE_URL}/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      if (result.success) {
        setApplications(prev => prev.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        ));
        setTimeout(() => refreshData(), 500);
      } else {
        alert('Failed to update status: ' + result.message);
      }
    } catch (error) {
      alert('Error updating status: ' + error.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Delete functions
  const deleteApplication = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      const response = await fetch(`${BASE_URL}/api/applications/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.success) {
        setApplications(prev => prev.filter(app => app._id !== id));
        if (selectedApplication && selectedApplication._id === id) {
          setSelectedApplication(null);
        }
        setTimeout(() => refreshData(), 500);
      } else {
        alert('Failed to delete application: ' + result.message);
      }
    } catch (error) {
      alert('Failed to delete application: ' + error.message);
    }
  };

  const deleteCAN = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/can/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.success) {
        setCanRecords(prev => prev.filter(can => can._id !== id));
        if (selectedCAN && selectedCAN._id === id) {
          setSelectedCAN(null);
        }
        setTimeout(() => refreshData(), 500);
      } else {
        alert('Failed to delete CAN record: ' + result.message);
      }
    } catch (error) {
      alert('Failed to delete CAN record: ' + error.message);
    }
  };

  const deletePayment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment record?")) return;
    
    try {
      const response = await fetch(`${BASE_URL}/api/payments/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.success) {
        setPayments(prev => prev.filter(payment => payment._id !== id));
        if (selectedPayment && selectedPayment._id === id) {
          setSelectedPayment(null);
        }
        setTimeout(() => refreshData(), 500);
      } else {
        alert('Failed to delete payment record: ' + result.message);
      }
    } catch (error) {
      alert('Failed to delete payment record: ' + error.message);
    }
  };

  // Modal close handlers
  const handleApplicationModalClose = () => {
    setSelectedApplication(null);
    setTimeout(() => refreshData(), 300);
  };

  const handleCANModalClose = () => {
    setSelectedCAN(null);
    setTimeout(() => refreshData(), 300);
  };

  const handlePaymentModalClose = () => {
    setSelectedPayment(null);
    setTimeout(() => refreshData(), 300);
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      'in review': 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // Refresh button component
  const RefreshButton = () => (
    <button
      onClick={refreshData}
      disabled={loading}
      className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-300 flex items-center space-x-2 text-sm sm:text-base"
    >
      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
    </button>
  );

  // Render Applications with CAN/Non-CAN separation
  const renderApplications = () => (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Patta Applications</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
              Total: {applications.length}
            </span>
            <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
              CAN: {canApplications.length}
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
              Regular: {nonCanApplications.length}
            </span>
          </div>
          <RefreshButton />
        </div>
      </div>

      {/* Application Type Filter */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setApplicationFilter('all')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
              applicationFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Applications ({applications.length})
          </button>
          <button
            onClick={() => setApplicationFilter('can')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
              applicationFilter === 'can'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            CAN Verified ({canApplications.length})
          </button>
          <button
            onClick={() => setApplicationFilter('non-can')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
              applicationFilter === 'non-can'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Regular ({nonCanApplications.length})
          </button>
        </div>
      </div>
      
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
          <p className="text-gray-500 text-base sm:text-lg">
            {applicationFilter === 'all' 
              ? 'No applications found' 
              : applicationFilter === 'can' 
                ? 'No CAN verified applications found'
                : 'No regular applications found'
            }
          </p>
          <button 
            onClick={refreshData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredApplications.map((app) => (
            <div key={app._id} className={`bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
              app.hasCAN ? 'border-green-200' : 'border-purple-200'
            }`}>
              {/* Header with Name, CAN Badge, and Status */}
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                      {app.hasCAN ? app.userName || app.name : app.name || "N/A"}
                    </h2>
                    {app.hasCAN && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center flex-shrink-0">
                        <span className="mr-1">🔐</span>
                        CAN
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm truncate">
                    {app.hasCAN ? `CAN: ${app.canNumber || "N/A"}` : `Aadhar: ${app.aadharNumber || "N/A"}`}
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                    {app.status || 'pending'}
                  </span>
                </div>
              </div>
              
              {/* Application Details */}
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Service Type:</span>
                  <span className="font-medium text-gray-900 truncate ml-2">{app.pattaOption || "N/A"}</span>
                </div>
                
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">District:</span>
                  <span className="font-medium text-gray-900 truncate ml-2">{app.district || "N/A"}</span>
                </div>
                
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Survey No:</span>
                  <span className="font-medium text-gray-900 truncate ml-2">{app.surveyNo || "N/A"}</span>
                </div>
                
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Documents:</span>
                  <span className="font-medium text-gray-900">{app.documents?.length || 0} files</span>
                </div>
                
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Applied:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Update Status:
                </label>
                <select
                  value={app.status || 'pending'}
                  onChange={(e) => updateApplicationStatus(app._id, e.target.value)}
                  disabled={updatingStatus === app._id}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-xs sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in review">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
                {updatingStatus === app._id && (
                  <p className="text-xs text-blue-600 mt-1">Updating...</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => setSelectedApplication(app)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-xs sm:text-sm font-semibold"
                >
                  View Details
                </button>
                <button
                  onClick={() => deleteApplication(app._id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-xs sm:text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render CAN Records
  const renderCANRecords = () => (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">CAN Records</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
            Total: {canRecords.length}
          </span>
          <RefreshButton />
        </div>
      </div>
      {canRecords.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
          <p className="text-gray-500 text-base sm:text-lg">No CAN records found</p>
          <button 
            onClick={refreshData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {canRecords.map((can) => (
            <div key={can._id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{can.name}</h2>
                  <p className="text-blue-600 font-semibold text-sm sm:text-lg truncate">CAN: {can.canNumber}</p>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-2 mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>Created:</strong> {new Date(can.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>Expires:</strong> {new Date(can.expiresAt).toLocaleDateString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {Math.ceil((new Date(can.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => setSelectedCAN(can)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-xs sm:text-sm font-semibold"
                >
                  View Details
                </button>
                <button
                  onClick={() => deleteCAN(can._id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-xs sm:text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render Payments
  const renderPayments = () => (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payment Records</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <span className="bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
            Total: {payments.length}
          </span>
          <RefreshButton />
        </div>
      </div>
      {payments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
          <p className="text-gray-500 text-base sm:text-lg">No payment records found</p>
          <button 
            onClick={refreshData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {payments.map((payment) => (
            <div key={payment._id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-purple-100 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{payment.name}</h2>
                  <p className="text-purple-600 font-semibold text-sm sm:text-base truncate">Mobile: {payment.mobileNumber}</p>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-2 mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>Submitted:</strong> {new Date(payment.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>Expires:</strong> {new Date(payment.expiresAt).toLocaleDateString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {Math.ceil((new Date(payment.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                </p>
              </div>

{payment.paymentScreenshot && (
  <div className="mb-3 sm:mb-4">
    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Payment Screenshot:</p>
    <div className="relative">
      <img 
        src={`${BASE_URL}/uploads/payments/${payment.paymentScreenshot}`} 
        alt={`Payment screenshot for ${payment.name}`}
        className="rounded-lg shadow-md max-w-full h-32 sm:h-48 object-contain cursor-pointer bg-gray-100"
        onError={(e) => {
          console.error('Error loading payment image:', `${BASE_URL}/uploads/payments/${payment.paymentScreenshot}`);
          e.target.style.display = 'none';
          // Show fallback message
          const fallback = document.createElement('div');
          fallback.className = 'bg-gray-200 rounded-lg h-32 sm:h-48 flex items-center justify-center';
          fallback.innerHTML = '<p class="text-gray-500 text-sm">Image not available</p>';
          e.target.parentNode.appendChild(fallback);
        }}
        onLoad={(e) => {
          console.log('Payment image loaded successfully');
        }}
      />
    </div>
    <p className="text-xs text-gray-500 mt-1">Click image to view full size</p>
  </div>
)}

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => setSelectedPayment(payment)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-xs sm:text-sm font-semibold"
                >
                  View Details
                </button>
                <button
                  onClick={() => deletePayment(payment._id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-xs sm:text-sm font-semibold"
                >
                  Delete Record
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex-1">
                <strong className="font-bold">Error! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
              <button 
                onClick={refreshData}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm sm:text-base w-full sm:w-auto"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'canRecords' && renderCANRecords()}
        {activeTab === 'payments' && renderPayments()}
      </div>

      {selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          onClose={handleApplicationModalClose}
          onStatusUpdate={updateApplicationStatus}
        />
      )}

      {selectedCAN && (
        <CANDetails
          canRecord={selectedCAN}
          onClose={handleCANModalClose}
          onDelete={deleteCAN}
        />
      )}

      {selectedPayment && (
        <PaymentDetails
          payment={selectedPayment}
          onClose={handlePaymentModalClose}
          onDelete={deletePayment}
        />
      )}
    </div>
  );
};

export default AdminHomepage;