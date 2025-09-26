import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

const HeroSection = () => {
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
      <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <div className="space-y-3 mb-8">
          <p className="typing-text text-lg md:text-2xl font-light">
            Digital Services, Simplified for You
          </p>
          <p className="typing-text text-base md:text-xl font-light delay-1">
            Fast • Secure • Reliable
          </p>
          <p className="typing-text text-base md:text-xl font-light delay-2">
            Your Trusted E-Sevai Maiyam
          </p>
        </div>

        {/* User Button - Get Started goes to User Dashboard */}
        <div className="flex flex-col space-y-4">
          <button
            type="button"
            onClick={() => navigate("/user-dashboard")}
            className="px-8 py-4 text-xl font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition duration-300"
          >
            Get Started
          </button>
        </div>

        {/* Admin Button - Top-Right with High Contrast */}
        <button
          type="button"
          onClick={() => navigate("/admin-dashboard")}
          className="absolute right-6 top-6 px-5 py-2 text-lg font-semibold text-white 
                     bg-gradient-to-r from-purple-600 to-pink-600 
                     rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 
                     hover:scale-105 transition duration-300"
        >
          Admin
        </button>
      </div>
    </div>
  );
};

export default HeroSection;