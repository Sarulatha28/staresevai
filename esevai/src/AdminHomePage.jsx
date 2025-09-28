import React, { useState, useEffect } from 'react';

// Navbar Component
const Navbar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: 'applications', label: 'Patta Applications' },
    { id: 'canRecords', label: 'CAN Records' },
    { id: 'payments', label: 'Payments' }
  ];

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 text-2xl font-bold">StarMobiles</div>
          <div className="hidden md:flex space-x-4">
            <a href="/" className="hover:bg-gray-700 px-3 py-2 rounded">
              Home
            </a>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`hover:bg-gray-700 px-3 py-2 rounded ${
                  activeTab === tab.id ? 'bg-gray-900' : ''
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-gray-700">
          <a href="/" className="block px-3 py-2 rounded hover:bg-gray-600">
            Home
          </a>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-600 ${
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

// Enhanced Application Details Modal with Full Review Sections
const ApplicationDetails = ({ application, onClose, onStatusUpdate }) => {
  const [status, setStatus] = useState(application.status || 'pending');
  const [activeSection, setActiveSection] = useState('personal');

  const updateStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/applications/${application._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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

  const downloadImage = (imageUrl, fileName) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName || 'document';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
    
   

  if (!application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
              <p className="text-gray-600">Application ID: {application._id}</p>
            </div>
            <div className="flex items-center space-x-4">
              
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
                ✕
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {['personal', 'patta', 'land', 'documents'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeSection === section
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {section.replace('_', ' ')} Details
                </button>
              ))}
            </nav>
          </div>

          {/* Personal Details Section */}
          {activeSection === 'personal' && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div><strong className="text-gray-700">Full Name:</strong> {application.name || "Not provided"}</div>
                  <div><strong className="text-gray-700">Aadhar Name:</strong> {application.aadharName || "Not provided"}</div>
                  <div><strong className="text-gray-700">Aadhar Number:</strong> {application.aadharNumber || "Not provided"}</div>
                  <div><strong className="text-gray-700">Mobile Number:</strong> {application.mobileNumber || "Not provided"}</div>
                </div>
                <div className="space-y-3">
                  <div><strong className="text-gray-700">Father's Name:</strong> {application.fatherName || "Not provided"}</div>
                  <div><strong className="text-gray-700">Mother's Name:</strong> {application.motherName || "Not provided"}</div>
                  <div><strong className="text-gray-700">Date of Birth:</strong> {application.dob || "Not provided"}</div>
                  {application.address && (
                <div className="mt-4">
                  <strong className="text-gray-700">Address:</strong>
                  <p className="text-gray-900 mt-1">{application.address}</p>
                </div>
              )}
                </div>
              </div>
              
            </div>
          )}

          {/* Patta Details Section */}
          {activeSection === 'patta' && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Patta Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div><strong className="text-gray-700">Service Type:</strong> {application.pattaOption || "Not provided"}</div>
                  <div><strong className="text-gray-700">District:</strong> {application.district || "Not provided"}</div>
                  <div><strong className="text-gray-700">Taluk:</strong> {application.taluk || "Not provided"}</div>
                </div>
                <div className="space-y-3">
                  <div><strong className="text-gray-700">Village:</strong> {application.village || "Not provided"}</div>
                  <div><strong className="text-gray-700">Area Type:</strong> {application.areaType || "Not provided"}</div>
                  <div><strong className="text-gray-700">Reason:</strong> {application.reason || "Not provided"}</div>
                </div>
              </div>
            </div>
          )}

          {/* Land Details Section */}
          {/* Land Details Section */}
{activeSection === 'land' && (
  <div className="bg-gray-50 p-6 rounded-lg mb-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">Land Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div><strong className="text-gray-700">Survey No:</strong> {application.surveyNo || "Not provided"}</div>
        <div><strong className="text-gray-700">Sub Division No:</strong> {application.subDivisionNo || "Not provided"}</div>
        <div><strong className="text-gray-700">Name of SRO:</strong> {application.sroName || "Not provided"}</div>
      </div>
      <div className="space-y-3">
        <div>
          <strong className="text-gray-700">Registration Doc No:</strong>{" "}
          {application.regDocNo && application.docYear 
            ? `${application.regDocNo}/${application.docYear}`
            : application.regDocNo || "Not provided"
          }
        </div>
        <div><strong className="text-gray-700">Registered Date:</strong> {application.registeredDate || "Not provided"}</div>
        <div><strong className="text-gray-700">Land Category:</strong> {application.landCategory || "Not provided"}</div>
      </div>
    </div>
  </div>
)}

          {/* Documents Section */}
          {activeSection === 'documents' && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
              <p className="mb-4"><strong>Total Documents:</strong> {application.uploadedImages?.length || 0}</p>
              
              {application.uploadedImages && application.uploadedImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {application.uploadedImages.map((image, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-lg transition-shadow">
                      <div 
                        className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-3 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => window.open(`http://localhost:5000/uploads/${image.name}`, '_blank')}
                      >
                        <img 
                          src={`http://localhost:5000/uploads/${image.name}`} 
                          alt={`Document ${index + 1}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700 truncate mb-2">
                          {image.originalName || `Document ${index + 1}`}
                        </p>
                        <button
                          onClick={() => downloadImage(`http://localhost:5000/uploads/${image.name}`, image.originalName)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-500 text-lg">No documents uploaded</p>
                </div>
              )}
            </div>
          )}

        
          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Applied on: {new Date(application.createdAt).toLocaleDateString()}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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

// CAN Details Modal (unchanged)
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">CAN Record Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="text-lg font-semibold text-gray-900">{canRecord.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">CAN Number</label>
              <p className="text-lg font-semibold text-blue-600">{canRecord.canNumber}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                canRecord.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {canRecord.status}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Created Date</label>
              <p className="text-sm text-gray-600">{new Date(canRecord.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <p className="text-sm text-gray-600">{new Date(canRecord.expiresAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Record'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Details Modal (unchanged)
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Payment Record Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-lg font-semibold text-gray-900">{payment.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <p className="text-lg font-semibold text-purple-600">{payment.mobileNumber}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  payment.status === "completed" ? "bg-green-100 text-green-800" :
                  payment.status === "failed" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {payment.status || "pending"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Submitted Date</label>
                <p className="text-sm text-gray-600">{new Date(payment.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <p className="text-sm text-gray-600">{new Date(payment.expiresAt).toLocaleDateString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Days Remaining</label>
                <p className="text-sm text-gray-600">
                  {Math.ceil((new Date(payment.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </div>

          {payment.paymentScreenshot && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Screenshot</label>
              <img 
                src={`http://localhost:5000/uploads/payments/${payment.paymentScreenshot}`} 
                alt={`Payment screenshot for ${payment.name}`}
                className="rounded-lg shadow-md max-w-full h-64 object-contain cursor-pointer"
                onClick={() => window.open(`http://localhost:5000/uploads/payments/${payment.paymentScreenshot}`, '_blank')}
              />
              <p className="text-xs text-gray-500 mt-1 text-center">Click image to view full size</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [appsRes, canRes, paymentsRes] = await Promise.all([
        fetch('http://localhost:5000/api/applications/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/can/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/payments/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const appsResult = await appsRes.json();
      const canResult = await canRes.json();
      const paymentsResult = await paymentsRes.json();

      if (appsResult.success) {
        const sortedApps = appsResult.applications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setApplications(sortedApps);
      }
      if (canResult.success) setCanRecords(canResult.canRecords);
      if (paymentsResult.success) setPayments(paymentsResult.payments);

    } catch (error) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      if (result.success) {
        setApplications(prev => prev.filter(app => app._id !== id));
        if (selectedApplication && selectedApplication._id === id) {
          setSelectedApplication(null);
        }
      }
    } catch (error) {
      alert('Failed to delete application');
    }
  };

  const deleteCAN = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/can/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      if (result.success) {
        setCanRecords(prev => prev.filter(can => can._id !== id));
        if (selectedCAN && selectedCAN._id === id) {
          setSelectedCAN(null);
        }
      } else {
        alert('Failed to delete CAN record');
      }
    } catch (error) {
      alert('Failed to delete CAN record');
    }
  };

  const deletePayment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment record?")) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/payments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      if (result.success) {
        setPayments(prev => prev.filter(payment => payment._id !== id));
        if (selectedPayment && selectedPayment._id === id) {
          setSelectedPayment(null);
        }
      } else {
        alert('Failed to delete payment record');
      }
    } catch (error) {
      alert('Failed to delete payment record');
    }
  };

  const updateApplicationStatus = (applicationId, newStatus) => {
    setApplications(prev => prev.map(app => 
      app._id === applicationId ? { ...app, status: newStatus } : app
    ));
  };

  const renderApplications = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Patta Applications</h1>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Total: {applications.length}
        </span>
      </div>
      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No applications found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{app.name || "N/A"}</h2>
                  <p className="text-gray-600">Aadhar: {app.aadharNumber || "N/A"}</p>
                </div>
                <div className="flex items-center space-x-2">
                 
                  <span className="text-sm text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p><strong>Service Type:</strong> {app.pattaOption || "N/A"}</p>
                  <p><strong>Survey No:</strong> {app.surveyNo || "N/A"}</p>
                  <p><strong>Documents:</strong> {app.uploadedImages?.length || 0} files</p>
                </div>
               
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedApplication(app)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  View Full Details
                </button>
                <button
                  onClick={() => deleteApplication(app._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
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

  const renderCANRecords = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">CAN Records</h1>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Total: {canRecords.length}
        </span>
      </div>
      {canRecords.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No CAN records found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canRecords.map((can) => (
            <div key={can._id} className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{can.name}</h2>
                  <p className="text-blue-600 font-semibold text-lg">CAN: {can.canNumber}</p>
                </div>
               
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Created:</strong> {new Date(can.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Expires:</strong> {new Date(can.expiresAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {Math.ceil((new Date(can.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedCAN(can)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-sm font-semibold"
                >
                  View Details
                </button>
                <button
                  onClick={() => deleteCAN(can._id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-sm font-semibold"
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

  const renderPayments = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment Records</h1>
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          Total: {payments.length}
        </span>
      </div>
      {payments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No payment records found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {payments.map((payment) => (
            <div key={payment._id} className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{payment.name}</h2>
                  <p className="text-purple-600 font-semibold">Mobile: {payment.mobileNumber}</p>
                </div>
                
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Submitted:</strong> {new Date(payment.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Expires:</strong> {new Date(payment.expiresAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {Math.ceil((new Date(payment.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                </p>
              </div>

              {payment.paymentScreenshot && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Payment Screenshot:</p>
                  <img 
                    src={`http://localhost:5000/uploads/payments/${payment.paymentScreenshot}`} 
                    alt={`Payment screenshot for ${payment.name}`}
                    className="rounded-lg shadow-md max-w-full h-48 object-cover cursor-pointer"
                    onClick={() => window.open(`http://localhost:5000/uploads/payments/${payment.paymentScreenshot}`, '_blank')}
                  />
                  <p className="text-xs text-gray-500 mt-1">Click image to view full size</p>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedPayment(payment)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-sm font-semibold"
                >
                  View Details
                </button>
                <button
                  onClick={() => deletePayment(payment._id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-sm font-semibold"
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
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'canRecords' && renderCANRecords()}
        {activeTab === 'payments' && renderPayments()}
      </div>

      {selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusUpdate={updateApplicationStatus}
        />
      )}

      {selectedCAN && (
        <CANDetails
          canRecord={selectedCAN}
          onClose={() => setSelectedCAN(null)}
          onDelete={deleteCAN}
        />
      )}

      {selectedPayment && (
        <PaymentDetails
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onDelete={deletePayment}
        />
      )}
    </div>
  );
};

export default AdminHomepage;