import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { FiUser, FiMail, FiShield, FiSave, FiEdit2, FiX, FiCheckCircle, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const SuperadminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    roles: [],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching Super Admin Profile from: /profile");
      const response = await API.get("/profile");
      console.log("Profile Fetch Response:", response.data);
      
      if (response.data.success) {
        setProfileData(response.data.profile);
      } else {
        setError(response.data.message || "Failed to load profile data");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      console.log("Error Response Data:", err.response?.data);
      setError(err.response?.data?.message || "An error occurred while loading your profile (Check Console)");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg("");
      
      const payload = {
        name: profileData.name,
        email: profileData.email,
      };
      
      console.log("Updating Profile with payload (PUT):", payload);
      const response = await API.put("/profile", payload);
      console.log("Profile Update Response:", response.data);

      if (response.data.success) {
        setSuccessMsg(response.data.message || "Profile updated successfully!");
        setProfileData(response.data.profile);
        setIsEditing(false);
        
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({
          ...currentUser,
          name: response.data.profile.name,
          email: response.data.profile.email
        }));

        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      console.log("Error Response Data:", err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.error || "An error occurred while saving changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfile(); 
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const payload = {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation,
      };

      console.log("Changing Password with payload (PUT):", { ...payload, current_password: "***", new_password: "***", new_password_confirmation: "***" });
      const response = await API.put("/profile/change-password", payload);
      console.log("Password Change Response:", response.data);

      if (response.data.success) {
        setSuccessMsg(response.data.message || "Password changed successfully");
        setShowPasswordModal(false);
        setPasswordData({ current_password: "", new_password: "", new_password_confirmation: "" });
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Error changing password:", err);
      console.log("Error Response Data:", err.response?.data);
      
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        const firstError = Object.values(validationErrors).flat()[0];
        setPasswordError(firstError);
      } else {
        setPasswordError(err.response?.data?.message || err.response?.data?.error || "Failed to change password");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your Super Admin account details
          </p>
        </div>

        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-xl font-semibold text-white flex gap-2 items-center transition-all duration-200 shadow-lg shadow-red-600/20"
            >
              <FiEdit2 /> Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-2.5 rounded-xl font-semibold text-white flex gap-2 items-center transition-all duration-200 disabled:opacity-50"
              >
                <FiX /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 px-6 py-2.5 rounded-xl font-semibold text-white flex gap-2 items-center transition-all duration-200 shadow-lg shadow-green-600/20 disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : <FiSave />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 flex items-start gap-3">
          <div className="mt-0.5 text-lg">⚠️</div>
          <p>{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl text-green-400 flex items-center gap-3">
          <FiCheckCircle className="text-xl" />
          <p>{successMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns - Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2 border-b border-gray-700 pb-4">
              <FiUser className="text-red-500" /> Account Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                {isEditing ? (
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-700/50">
                    <p className="text-lg text-white font-semibold">{profileData.name}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                {isEditing ? (
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-700/50">
                    <p className="text-lg text-white font-semibold">{profileData.email}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Account Role
                </label>
                <div className="flex items-center gap-3 bg-red-900/10 border border-red-500/20 px-4 py-3 rounded-xl">
                  <FiShield className="text-red-400" />
                  <span className="text-red-400 font-bold uppercase tracking-widest text-sm">
                    {profileData.roles[0]?.replace('_', ' ') || 'Super Admin'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  User ID
                </label>
                <div className="bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-700/50">
                  <p className="text-white font-mono">#{profileData.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Summary Section */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FiShield className="text-green-500" /> Security Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                    <FiCheckCircle />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">API Authentication</h4>
                    <p className="text-xs text-gray-400">Bearer Token active and secured</p>
                  </div>
                </div>
                <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded">SECURED</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl border border-gray-700/50 opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                    <FiShield />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Two-Factor Authentication</h4>
                    <p className="text-xs text-gray-400">Not yet configured for this account</p>
                  </div>
                </div>
                <button className="text-blue-400 text-xs font-bold hover:underline">ENABLE</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Summary */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center shadow-xl relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-br from-red-600 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-red-600/30 border-4 border-gray-800">
                {profileData.name.charAt(0).toUpperCase() || 'S'}
              </div>
              <h3 className="text-2xl font-bold text-white">{profileData.name}</h3>
              <p className="text-gray-400 font-medium mb-6">Master Access Control</p>
              
              <div className="pt-6 border-t border-gray-700 space-y-3">
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FiLock /> Change Password
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
               System Privileges
            </h3>
            <div className="space-y-4">
              {[
                "Full User Access",
                "Administrative Control",
                "Quotation Management",
                "System Audit Oversight",
                "Product & Pricing Access"
              ].map((privilege, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  {privilege}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl border border-blue-500/20 p-8 shadow-xl">
             <h3 className="text-blue-300 font-bold mb-2">Need Help?</h3>
             <p className="text-gray-400 text-sm mb-4">Questions about your Super Admin privileges or account settings?</p>
             <button className="text-blue-400 font-bold text-sm hover:underline">Contact Support →</button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FiLock className="text-red-500" /> Change Password
              </h3>
              <button 
                onClick={() => { setShowPasswordModal(false); setPasswordError(null); }}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={saving}
              >
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={submitPasswordChange} className="p-6 space-y-5">
              {passwordError && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-500 text-sm flex items-center gap-2 animate-shake">
                   <span>⚠️</span> {passwordError}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    name="current_password"
                    required
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-11 pr-12 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPasswords.old ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="new_password"
                    required
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-11 pr-12 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="new_password_confirmation"
                    required
                    value={passwordData.new_password_confirmation}
                    onChange={handlePasswordChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-11 pr-12 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="Repeat new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={saving}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-3 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : <FiCheckCircle />}
                  {saving ? "Changing..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperadminProfile;

