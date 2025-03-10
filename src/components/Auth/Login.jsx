import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, get2FAStatus} from "../../assets/services/api"; // Import the correct signIn function
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await signIn(username, password);
      console.log("Login Response:", response); // Debugging

      if (!response || !response.jwtToken) {
        throw new Error("Invalid response from server");
      }
      

      localStorage.setItem("token", response.jwtToken);

      const twoFAStatus = await get2FAStatus();
      console.log("2FA Status:", twoFAStatus);

      if (twoFAStatus.is2faEnabled) {
        navigate("/twofactorverification", { state: { isLogin: true } });
        return;
      }
      
      setAuth(true);
      navigate("/profile");

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign in to your account</h1>
        <p className="text-gray-600 mb-4 text-center">
          Don't have an account? <a href="/register" className="text-blue-500">Register</a>
        </p>

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Enter your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your Password"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-gray-600 text-center">Or Continue with</div>
        <div className="flex gap-4 mt-4">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            <FaGoogle className="text-red-500 mr-2" />Google
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            <FaGithub className="text-gray-800 mr-2" />GitHub
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-amber-50 text-black p-6 md:p-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Welcome Back!</h2>
        <p className="text-lg text-center">
          Sign in to access your personalized dashboard and manage your account efficiently.
        </p>
        <img
          src="https://cdn.pixabay.com/photo/2023/01/30/07/24/losangeles-7754986_1280.jpg"
          alt="Login Illustration"
          className="mt-6 rounded-lg shadow-lg w-3/4 md:w-2/3"
        />
      </div>
    </div>
  );
};

export default Login;
