import React from "react";
import { Routes, Route } from "react-router-dom";
import HeroSection from "./HeroSection";
import AdminDashboard from "./AdminDashboard";
import AdminSignupPage from "./AdminSignupPage";
import AdminSigninPage from "./AdminSigninPage";
import AdminHomePage from "./AdminHomePage";
import UserDashboard from "./UserDashboard";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HeroSection />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-signup" element={<AdminSignupPage />} />
      <Route path="/admin-signin" element={<AdminSigninPage />} />
      <Route path="/admin/home" element={<AdminHomePage />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />

    </Routes>
  );
}

export default App;
