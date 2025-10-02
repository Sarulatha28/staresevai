import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminSigninPage = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Signin successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("admin", JSON.stringify(data.admin));

        // Redirect to admin home page
        navigate("/admin/home");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Signin</h2>
        <form onSubmit={handleSignin} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email or Admin ID</label>
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Enter your email or admin ID"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-lg transition ${
              loading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/admin-signup")}
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminSigninPage;