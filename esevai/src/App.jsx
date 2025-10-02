import React from "react";
import { Routes, Route } from "react-router-dom";
import HeroSection from "./HeroSection";
import AdminDashboard from "./AdminDashboard";
import AdminSignupPage from "./AdminSignupPage";
import AdminSigninPage from "./AdminSigninPage";
import AdminHomePage from "./AdminHomePage";
import UserDashboard from "./UserDashboard";
import AdminEditProfile from "./AdminEditProfile";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HeroSection />} />
     // In your main App.js or routing file
   <Route path="/admin-dashboard" element={<AdminDashboard />} />
   <Route path="/admin/signin" element={<AdminSigninPage />} />
   <Route path="/admin/edit" element={<AdminEditProfile />} />
// Remove or restrict the signup route
      <Route path="/admin/home" element={<AdminHomePage />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />

    </Routes>
  );
}

export default App;
