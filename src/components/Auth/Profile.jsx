import React, { useState, useEffect } from "react";
import { FaUserShield, FaUser } from "react-icons/fa";
import { 
  getUserDetails, 
  updateUserDetails, 
  get2FAStatus, 
  enable2FA, 
  disable2FA, 
  logout 
} from "../../assets/services/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const userDetails = await getUserDetails();
      setUser(userDetails);
      setForm({ username: userDetails.username, email: userDetails.email });
    } catch (err) {
      console.error("Failed to fetch user details", err);
      if (err?.response?.status === 401) handleTokenExpiration();
    } finally {
      setLoading(false);
    }
  };

  const fetch2FAStatus = async () => {
    try {
      const status = await get2FAStatus();
      setTwoFAEnabled(status.is2faEnabled);

      // Only update qrUrl when enabling 2FA, don't clear it on refresh
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
      console.error("Update failed", err);
      if (err?.response?.status === 401) handleTokenExpiration();
    }
  };

  const handle2FAToggle = async () => {
    try {
      if (!twoFAEnabled) {
        // Enable 2FA
        const response = await enable2FA();
        setQrUrl(response);
        setTwoFAEnabled(true);
      } else {
        // Disable 2FA
        await disable2FA();
        setQrUrl("");
        setTwoFAEnabled(false);
      }
    } catch (err) {
      console.error("Failed to toggle 2FA", err);
      if (err?.response?.status === 401) handleTokenExpiration();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 p-6">
      <div className="w-1/2 bg-white p-6 shadow-md rounded-lg">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <FaUserShield className="text-4xl text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold mt-2">{user?.username}</h2>
          <p className="text-gray-500">Role: {user?.roles?.join(", ")}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Update Credentials</h3>
          <input 
            type="text" 
            placeholder="Username" 
            className="w-full p-2 border rounded mb-2" 
            value={form.username} 
            onChange={(e) => setForm({ ...form, username: e.target.value })} 
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-2 border rounded mb-2" 
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
          />
          <input 
            type="password" 
            placeholder="New Password" 
            className="w-full p-2 border rounded mb-2" 
            value={form.newPassword} 
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })} 
          />
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full" 
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
          <ul className="space-y-2">
            <li className="flex items-center"><FaUser className="text-gray-500 mr-2" /> Account Expired: {user?.accountNonExpired ? "No" : "Yes"}</li>
            <li className="flex items-center"><FaUser className="text-gray-500 mr-2" /> Account Locked: {user?.accountNonLocked ? "No" : "Yes"}</li>
            <li className="flex items-center"><FaUser className="text-gray-500 mr-2" /> Account Enabled: {user?.enabled ? "Yes" : "No"}</li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Credential Expiry</h3>
          <p className="text-gray-500 mt-1">{user?.credentialsExpiryDate}</p>
        </div>
      </div>

      <div className="w-1/2 bg-white p-6 shadow-md rounded-lg ml-6">
        <h2 className="text-xl font-semibold mb-4">Two-Factor Authentication</h2>

        <button
          className={`px-4 py-2 rounded ${twoFAEnabled ? "bg-red-600" : "bg-green-600"} text-white`}
          onClick={handle2FAToggle}
        >
          {twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
        </button>

        {qrUrl && (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold mb-2">Scan the QR Code for 2FA:</p>
            <img src={qrUrl} alt="QR Code for 2FA" className="mx-auto mb-2 border p-2 rounded-md shadow" />
            <span className="text-xl font-bold text-yellow-800">Or</span>
            <br />
            <span className="text-lg text-400">Follow the below link</span>
            <p className="text-blue-600 break-all">
              <a href={qrUrl} target="_blank" rel="noopener noreferrer">
                {qrUrl}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
