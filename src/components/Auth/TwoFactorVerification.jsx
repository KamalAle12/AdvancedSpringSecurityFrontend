import React, { useState, useEffect } from "react";
import { verify2FA, verify2FALogin } from "../../assets/services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const TwoFactorVerification = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if this is a login-based 2FA verification
  const isLoginVerification = location.state?.isLogin || false;

  useEffect(() => {
    if (!localStorage.getItem("token") && isLoginVerification) {
      setError("Authentication token missing. Please log in again.");
    }
  }, [isLoginVerification]);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      if (isLoginVerification) {
        response = await verify2FALogin(code);
      } else {
        response = await verify2FA(code);
      }

      // Store token if login verification is successful
      if (isLoginVerification && response.token) {
        localStorage.setItem("token", response.token);
      }

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid 2FA code. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          🔒 Two-Factor Authentication
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the 6-digit authentication generate from your device.
        </p>

        <div className="flex justify-center mb-4">
          <input
            type="text"
            maxLength="6"
            placeholder="Enter 2FA Code"
            className="text-center w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 text-lg tracking-widest"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Verify Code"}
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}

        <p className="text-gray-500 text-sm text-center mt-6">
          Didn’t receive a code?{" "}
        </p>
      </div>
    </div>
  );
};

export default TwoFactorVerification;
