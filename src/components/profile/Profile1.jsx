import React, { useState, useEffect } from "react";
import { FaLock, FaUnlock, FaKey } from "react-icons/fa";
import {
  getUserDetails,
  updateUserDetails,
  get2FAStatus,
  enable2FA,
  disable2FA,
  logout
} from "../../assets/services/api";
import avatar from "../../assets/img/avatar.png";

const Profile1 = () => {
  const [user, setUser] = useState(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [form, setForm] = useState({ username: "", email: "", newPassword: "" });

  useEffect(() => {
    fetchUserDetails();
    fetch2FAStatus();
  }, []);

  const handleTokenExpiration = () => {
    alert("Session expired. Please log in again.");
    logout();
    window.location.href = "/login";
  };

  const fetchUserDetails = async () => {
    try {
      const userDetails = await getUserDetails();
      setUser(userDetails);
      setForm({ username: userDetails.username, email: userDetails.email });
    } catch (err) {
      if (err?.response?.status === 401) handleTokenExpiration();
    }
  };

  const fetch2FAStatus = async () => {
    try {
      const status = await get2FAStatus();
      setTwoFAEnabled(status.is2faEnabled);
      if (status.is2faEnabled && !qrUrl) {
        setQrUrl(status.qrUrl || "");
      }
    } catch (err) {
      console.error("Failed to fetch 2FA status", err);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUserDetails(form);
      alert("User details updated successfully!");
      fetchUserDetails();
    } catch (err) {
      if (err?.response?.status === 401) handleTokenExpiration();
    }
  };

  const handle2FAToggle = async () => {
    try {
      if (!twoFAEnabled) {
        const response = await enable2FA();
        setQrUrl(response);
        setTwoFAEnabled(true);
      } else {
        await disable2FA();
        setQrUrl("");
        setTwoFAEnabled(false);
      }
    } catch (err) {
      if (err?.response?.status === 401) handleTokenExpiration();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Top Welcome Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Welcome, <span className="text-blue-600">{user?.username}</span>
            </h1>
            <p className="text-gray-500 text-sm">Manage your profile and security settings</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full border shadow-md" />
            <span className="text-gray-700 font-medium">{user?.username}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="md:col-span-1 bg-white p-6 rounded-3xl shadow-lg">
            <div className="text-center">
              <img src={avatar} alt="avatar" className="w-24 h-24 rounded-full mx-auto shadow-md" />
              <h2 className="text-xl font-bold mt-4">{user?.username}</h2>
              <p className="text-sm text-gray-500 mt-1">Role: {user?.roles?.join(", ")}</p>
            </div>

            <div className="mt-6 text-sm text-gray-600 space-y-1">
              <p>
                Account Expired:{" "}
                <span className={!user?.accountNonExpired ? "text-red-500" : "text-green-600"}>
                  {!user?.accountNonExpired ? "Yes" : "No"}
                </span>
              </p>
              <p>
                Account Locked:{" "}
                <span className={!user?.accountNonLocked ? "text-red-500" : "text-green-600"}>
                  {!user?.accountNonLocked ? "Yes" : "No"}
                </span>
              </p>
              <p>
                Account Enabled:{" "}
                <span className={user?.enabled ? "text-green-600" : "text-red-500"}>
                  {user?.enabled ? "Yes" : "No"}
                </span>
              </p>
              <p>
                Credentials Expire On:
                <br />
                <span className="text-gray-500">{user?.credentialsExpiryDate}</span>
              </p>
            </div>
          </div>

          {/* Update Credentials */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Your Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="password"
                placeholder="New Password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 sm:col-span-2"
              />
            </div>
            <button
              onClick={handleUpdate}
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition"
            >
              Update Information
            </button>
          </div>

          {/* 2FA Section */}
          <div className="md:col-span-3 bg-white p-6 rounded-3xl shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Two-Factor Authentication</h2>
              <button
                onClick={handle2FAToggle}
                className={`mt-3 md:mt-0 px-5 py-2 text-white font-medium rounded-full transition ${
                  twoFAEnabled
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-green-600 hover:bg-green-500"
                }`}
              >
                {twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
              </button>
            </div>

            {qrUrl && (
              <div className="mt-6 text-center">
                <p className="text-gray-700 mb-2 font-medium">Scan this QR Code with your Authenticator App:</p>
                <img src={qrUrl} alt="QR" className="w-40 h-40 mx-auto border p-2 rounded-lg" />
                <p className="text-xs text-blue-600 mt-2 break-all">
                  <a href={qrUrl} target="_blank" rel="noopener noreferrer">
                    {qrUrl}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile1;
