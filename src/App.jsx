import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Profile from "./components/Auth/Profile"; 
import Register from "./components/Auth/Register";
import TwoFactorVerification from "./components/Auth/TwoFactorVerification";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") // Check if user is already logged in
  );

  return (
    <Router>
      <Routes>
        {/* Pass setAuth to Login component */}
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />

        <Route path="/register" element={<Register />} />

        <Route path="/twofactorverification" element={<TwoFactorVerification />} />
        
        {/* Protected route: Redirect to login if not authenticated */}
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Redirect root to login */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
