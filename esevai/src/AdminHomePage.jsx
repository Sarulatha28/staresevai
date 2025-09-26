import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminApplications from "./AdminApplications";

const AdminHomePage = () => {
  const [admin, setAdmin] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard' or 'applications'
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem("token");
    const adminData = localStorage.getItem("admin");

    if (!token || !adminData) {
      navigate("/admin/signin");
      return;
    }

    setAdmin(JSON.parse(adminData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/admin/signin");
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {admin.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Navigation Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`px-4 py-2 rounded-lg transition ${
                  currentView === "dashboard" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView("applications")}
                className={`px-4 py-2 rounded-lg transition ${
                  currentView === "applications" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Applications
              </button>
            </div>
            
            {/* Profile */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
              >
                {admin.name.charAt(0).toUpperCase()}
              </button>
              
              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-10">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                    <p className="text-xs text-gray-600">{admin.email}</p>
                  </div>
                  <div className="px-4 py-2">
                    <p className="text-xs text-gray-600 mb-1">Company</p>
                    <p className="text-sm font-medium text-gray-900 mb-3">{admin.companyName}</p>
                    
                    <p className="text-xs text-gray-600 mb-1">Admin ID</p>
                    <p className="text-sm font-medium text-gray-900 mb-3">{admin.adminId}</p>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "dashboard" ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900">Total Applications</h3>
                <p className="text-3xl font-bold text-indigo-600">1,234</p>
                <p className="text-sm text-gray-600">Patta applications</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900">Pending Review</h3>
                <p className="text-3xl font-bold text-yellow-600">56</p>
                <p className="text-sm text-gray-600">Awaiting approval</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900">Approved</h3>
                <p className="text-3xl font-bold text-green-600">1,178</p>
                <p className="text-sm text-gray-600">Completed applications</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setCurrentView("applications")}
                  className="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  View Applications
                </button>
                <button className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition">
                  Generate Reports
                </button>
                <button className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition">
                  System Settings
                </button>
              </div>
            </div>
          </>
        ) : (
          <AdminApplications />
        )}
      </main>
    </div>
  );
};

export default AdminHomePage;