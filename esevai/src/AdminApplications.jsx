import React, { useState, useEffect } from 'react';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/applications/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setApplications(result.applications);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (error) {
      setError('Error fetching applications');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationDetails = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/applications/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSelectedApplication(result.application);
      } else {
        alert('Failed to fetch application details');
      }
    } catch (error) {
      alert('Error fetching application details');
      console.error('Error:', error);
    }
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Application status updated successfully');
        fetchApplications(); // Refresh the list
        setSelectedApplication(result.application); // Update details view
      } else {
        alert('Failed to update application status');
      }
    } catch (error) {
      alert('Error updating application status');
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Patta Applications</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Applications ({applications.length})</h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {applications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No applications found
                  </div>
                ) : (
                  applications.map((app) => (
                    <div
                      key={app._id}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                        selectedApplication && selectedApplication._id === app._id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => fetchApplicationDetails(app._id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{app.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{app.mobileNumber}</p>
                      <p className="text-sm text-gray-600">
                        {app.district}, {app.village}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="lg:col-span-2">
            {selectedApplication ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Application Details - {selectedApplication.name}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication._id, 'approved')}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-blue-800 border-b pb-2">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong>Full Name:</strong> {selectedApplication.name}</div>
                    <div><strong>Aadhar Name:</strong> {selectedApplication.aadharName}</div>
                    <div><strong>Aadhar Number:</strong> {selectedApplication.aadharNumber}</div>
                    <div><strong>Father's Name:</strong> {selectedApplication.fatherName || 'N/A'}</div>
                    <div><strong>Mother's Name:</strong> {selectedApplication.motherName || 'N/A'}</div>
                    <div><strong>Date of Birth:</strong> {selectedApplication.dob ? new Date(selectedApplication.dob).toLocaleDateString() : 'N/A'}</div>
                    <div><strong>Mobile Number:</strong> {selectedApplication.mobileNumber}</div>
                    <div><strong>Address:</strong> {selectedApplication.address}</div>
                    <div><strong>Has CAN:</strong> {selectedApplication.hasCAN ? 'Yes' : 'No'}</div>
                    {selectedApplication.hasCAN && (
                      <div><strong>CAN Number:</strong> {selectedApplication.canNumber}</div>
                    )}
                  </div>
                </div>

                {/* Patta Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-blue-800 border-b pb-2">
                    Patta Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong>Service Type:</strong> {selectedApplication.pattaOption}</div>
                    <div><strong>District:</strong> {selectedApplication.district}</div>
                    <div><strong>Taluk:</strong> {selectedApplication.taluk}</div>
                    <div><strong>Village:</strong> {selectedApplication.village}</div>
                    <div><strong>Area Type:</strong> {selectedApplication.areaType}</div>
                    <div><strong>Reason:</strong> {selectedApplication.reason || 'N/A'}</div>
                  </div>
                </div>

                {/* Land Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-blue-800 border-b pb-2">
                    Land Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong>Survey No:</strong> {selectedApplication.surveyNo}</div>
                    <div><strong>Sub Division No:</strong> {selectedApplication.subDivisionNo}</div>
                    <div><strong>SRO Name:</strong> {selectedApplication.sroName}</div>
                    <div><strong>Registration Doc No:</strong> {selectedApplication.regDocNo}</div>
                    <div><strong>Registered Date:</strong> {new Date(selectedApplication.registeredDate).toLocaleDateString()}</div>
                    <div><strong>Land Category:</strong> {selectedApplication.landCategory}</div>
                   
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-800 border-b pb-2">
                    Uploaded Documents ({selectedApplication.documents.length})
                  </h3>
                  {selectedApplication.documents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedApplication.documents.map((doc, index) => (
                        <div key={index} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{doc.originalName}</p>
                              <p className="text-xs text-gray-600">
                                Type: {doc.documentType} | 
                                Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                            <a
                              href={`http://localhost:5000/uploads/${doc.fileName}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No documents uploaded</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500">Select an application to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApplications;