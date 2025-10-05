import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "https://staresevaimaiyam.onrender.com";

const AdminSigninPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Sending login request...', formData.email);
      
      const res = await fetch(`${BASE_URL}/api/admin/signin`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      console.log('📨 Login response:', data);
            if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("admin", JSON.stringify(data.admin));
        console.log('✅ Login successful, redirecting...');
        navigate("/admin/home");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error('💥 Login error:', err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  

  return (
   <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="bg-white p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Sign In</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignin} className="space-y-4">
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
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none" 
            required 
          />
           <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-400"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/admin/edit")}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Edit Admin Details
          </button>
        </div>
         {/* Temporary test credentials display */}
        <div className="mt-4 p-3 bg-yellow-100 rounded text-sm">
          <p className="font-bold">Test Credentials:</p>
          <p>Email: admin@example.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSigninPage;