import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminSignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    adminId: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! Please sign in.");
        navigate("/admin/signin"); // redirect to signin after signup
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Signup</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Admin ID</label>
            <input
              type="text"
              name="adminId"
              value={formData.adminId}
              onChange={handleChange}
              placeholder="Enter admin ID"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
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
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* 👇 Already signup redirect link */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/admin-signin")}
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminSignupPage;
