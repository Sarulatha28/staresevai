import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminEditProfile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Password verification, 2: Edit form
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({ 
    companyName: "", 
    name: "", 
    email: "", 
    phone: "", 
    currentPassword: "", 
    newPassword: "" 
  });
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin");
    
    if (!token) {
      // If no token, redirect to signin
      navigate("/admin/signin");
      return;
    }

    if (admin) {
      const data = JSON.parse(admin);
      setAdminData(data);
      setFormData(prev => ({
        ...prev,
        companyName: data.companyName,
        name: data.name,
        email: data.email,
        phone: data.phone
      }));
    } else {
      // If no admin data but has token, fetch profile
      fetchAdminProfile(token);
    }
  }, [navigate]);

  const fetchAdminProfile = async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/profile`, {
        headers: { 
          "Authorization": `Bearer ${token}` 
        },
      });
      const data = await res.json();
      if (data.success) {
        setAdminData(data.admin);
        setFormData(prev => ({
          ...prev,
          companyName: data.admin.companyName,
          name: data.admin.name,
          email: data.admin.email,
          phone: data.admin.phone
        }));
      } else {
        setError("Failed to load admin data");
      }
    } catch (err) {
      setError("Error fetching admin profile");
    }
  };

  const handlePasswordVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      console.log("Verifying password with token:", token);
      
      const res = await fetch(`${BASE_URL}/api/admin/verify-password`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ currentPassword: password })
      });
      
      const data = await res.json();
      console.log("Password verification response:", data);
      
      if (data.success) {
        setFormData(prev => ({ ...prev, currentPassword: password }));
        setStep(2);
      } else {
        setError(data.message || "Invalid password");
      }
    } catch (err) {
      console.error("Password verification error:", err);
      setError("Error verifying password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (step === 1) {
      setPassword(e.target.value);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    setError(""); // Clear error when user types
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      console.log("Updating profile with data:", formData);
      
      const res = await fetch(`${BASE_URL}/api/admin/update`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...formData,
          currentPassword: password // Use the verified password
        })
      });
      
      const data = await res.json();
      console.log("Update response:", data);
      
      if (data.success) {
        localStorage.setItem("admin", JSON.stringify(data.admin));
        alert("Profile updated successfully!");
        navigate("/admin/home");
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!adminData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
        <div className="bg-white p-8 rounded-xl">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="bg-white p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === 1 ? "Verify Password" : "Edit Admin Profile"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handlePasswordVerify} className="space-y-4">
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-2">
                Please enter your current password to edit admin details
              </p>
              <input 
                type="password" 
                value={password}
                onChange={handleChange}
                placeholder="Current Password" 
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none" 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Verifying..." : "Verify Password"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/signin")}
              className="w-full py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mt-2"
            >
              Back to Signin
            </button>
          </form>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <input 
              type="text" 
              name="companyName" 
              placeholder="Company Name" 
              value={formData.companyName} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none" 
              required 
            />
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none" 
              required 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none" 
              required 
            />
            <input 
              type="tel" 
              name="phone" 
              placeholder="Phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none" 
              required 
            />
            <input 
              type="password" 
              name="newPassword" 
              placeholder="New Password (optional)" 
              value={formData.newPassword}
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none" 
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminEditProfile;