import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../assets/services/api"; // Import API function
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      await forgotPassword(email);
      setMessage("A reset link has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Forgot Password
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your email address and we'll send you a password reset link.
        </p>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        {message && <p className="text-green-500 text-sm text-center mb-3">{message}</p>}

        <form onSubmit={handleForgotPassword} className="w-full">
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p
            className="text-blue-500 text-sm cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
