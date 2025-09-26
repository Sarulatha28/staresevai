import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/animi.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Welcome, Admin!
        </h1>
        <p className="text-base md:text-xl mb-8 max-w-lg">
          Hello, Admin! 👋 <br />
          Ready to help users get started? Use the buttons below to access the Admin Signup or Signin forms,  
          and manage everything smoothly. Let’s make things happen!
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <button
            onClick={() => navigate("/admin-signup")}
            className="px-6 py-3 text-lg font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 hover:scale-105 transition duration-300"
          >
            Admin Signup
          </button>
          <button
            onClick={() => navigate("/admin-signin")}
            className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition duration-300"
          >
            Admin Signin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
