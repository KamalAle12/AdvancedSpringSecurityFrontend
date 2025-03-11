import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Profile from "./components/Auth/Profile";
import Register from "./components/Auth/Register";
import TwoFactorVerification from "./components/Auth/TwoFactorVerification";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") // Check if user is already logged in
  );

  // Function to handle login
  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true); // Update authentication state
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Pass setAuth to Login component */}
        <Route path="/login" element={<Login setAuth={handleLogin} />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword/>} />

        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Ensure only logged-in users can access TwoFactorVerification */}
        <Route
          path="/twofactorverification"
          element={isAuthenticated ? <TwoFactorVerification /> : <Navigate to="/login" />}
        />

        {/* Protected Profile Route */}
        <Route path="/profile" element={isAuthenticated ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" />} />

        {/* Redirect root to login or profile */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
