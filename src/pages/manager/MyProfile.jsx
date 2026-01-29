import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { FiUser, FiMail, FiPhone, FiBriefcase, FiLock, FiEdit2, FiSave, FiX, FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";

const ManagerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "+1 (555) 987-6543", // Fallback for fields not in API
    position: "Sales Manager",
    department: "Sales",
    joinDate: "2022-08-15",
    teamSize: "8 members",
    address: "456 Management Avenue, Suite 200\nNew York, NY 10001",
    bio: "Experienced sales manager with 8+ years in team leadership and sales strategy development.",
    roles: [],
  });

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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/profile");
      if (response.data.success) {
        setProfileData(prev => ({
          ...prev,
          ...response.data.profile,
          // Map API role to position if needed
          position: response.data.profile.roles?.[0]?.replace('_', ' ') || prev.position
        }));
      }
    } catch (err) {
      console.error("Error fetching manager profile:", err);
      setError("Failed to load profile data from API");
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
      
      const response = await API.put("/profile", {
        name: profileData.name,
        email: profileData.email,
      });

      if (response.data.success) {
        setSuccessMsg("Profile updated successfully!");
        setProfileData(prev => ({ ...prev, ...response.data.profile }));
        setIsEditing(false);
        
        // Update local session
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({
          ...currentUser,
          name: response.data.profile.name,
          email: response.data.profile.email
        }));

        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Error updating manager profile:", err);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const response = await API.put("/profile/change-password", {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation
      });
      
      if (response.data.success) {
        setSuccessMsg("Password updated successfully!");
        setShowPasswordModal(false);
        setPasswordData({ current_password: "", new_password: "", new_password_confirmation: "" });
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Error changing password:", err);
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        const firstError = Object.values(validationErrors).flat()[0];
        setPasswordError(firstError);
      } else {
        setPasswordError(err.response?.data?.message || "Failed to change password");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
          <p className="text-gray-400 mt-1">
            Manage your personal and professional information
          </p>
        </div>

        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 hover:bg-green-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white flex gap-2 items-center transition-colors duration-200"
            >
              <FiEdit2 /> Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="bg-gray-600 hover:bg-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white flex gap-2 items-center transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white flex gap-2 items-center transition-colors duration-200"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      {error && <div className="mb-4 text-red-400 text-sm">⚠️ {error}</div>}
      {successMsg && <div className="mb-4 text-green-400 text-sm">✅ {successMsg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                  />
                ) : (
                  <p className="text-white font-medium">{profileData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                  />
                ) : (
                  <p className="text-white font-medium">{profileData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Phone</label>
                <p className="text-white font-medium">{profileData.phone}</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Position</label>
                <p className="text-white font-medium capitalize">{profileData.position}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-4">Professional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Department</label>
                <p className="text-white font-medium">{profileData.department}</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Join Date</label>
                <p className="text-white font-medium">{profileData.joinDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              {profileData.name?.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-lg font-bold text-white">{profileData.name}</h3>
            <p className="text-gray-400 text-sm capitalize">{profileData.position}</p>
            
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full mt-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <FiLock /> Change Password
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-bold mb-4">Account Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">User ID</span>
                <span className="text-white font-mono">#{profileData.id}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-bold uppercase text-[10px]">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
            
            {passwordError && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-500 text-sm">
                ⚠️ {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData(d => ({ ...d, current_password: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData(d => ({ ...d, new_password: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.new_password_confirmation}
                  onChange={(e) => setPasswordData(d => ({ ...d, new_password_confirmation: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowPasswordModal(false); setPasswordError(null); }} className="flex-1 py-2 bg-gray-700 rounded-lg">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-green-600 rounded-lg transition-colors hover:bg-green-700">{saving ? "Updating..." : "Update"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerProfile;
