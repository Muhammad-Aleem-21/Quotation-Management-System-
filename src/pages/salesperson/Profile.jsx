import React, { useState, useEffect } from 'react';
import API from "../../api/api";
import { FiUser, FiMail, FiLock, FiEdit2, FiEye, FiEyeOff, FiX, FiCheckCircle } from "react-icons/fi";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [profileData, setProfileData] = useState({
    id: null,
    name: '',
    email: '',
    phone: '+1 (555) 123-4567',
    position: 'Salesperson',
    department: 'Sales',
    joinDate: '',
    address: '123 Business Street, Suite 100\nNew York, NY 10001',
    bio: 'Experienced sales professional working in software solutions and customer relationship management.',
    roles: []
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [quotationStats, setQuotationStats] = useState({
    approved: 0,
    rejected: 0,
    total: 0,
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
        const profile = response.data.profile;
        setProfileData(prev => ({
          ...prev,
          id: profile.id,
          name: profile.name,
          email: profile.email,
          roles: profile.roles || [],
          position: profile.roles?.[0]?.replace('_', ' ') || prev.position,
          joinDate: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : prev.joinDate
        }));

        // Fetch approved quotations count
        try {
        // const approvedResponse = await API.get(`/quotations/${profile.id}/approve`);
        const approvedResponse = { data: { quotations: [] } };
          if (approvedResponse.data) {
            const quotations = approvedResponse.data.quotations || approvedResponse.data.data || approvedResponse.data || [];
            const approvedCount = Array.isArray(quotations) ? quotations.length : 0;
            setQuotationStats(prev => ({
              ...prev,
              approved: approvedCount
            }));
          }
        } catch (error) {
          console.warn("Could not fetch approved quotations:", error.message);
        }

        // Fetch rejected quotations count
        try {
        // const rejectedResponse = await API.get(`/quotations/${profile.id}/reject`);
        const rejectedResponse = { data: { quotations: [] } };
          if (rejectedResponse.data) {
            const quotations = rejectedResponse.data.quotations || rejectedResponse.data.data || rejectedResponse.data || [];
            const rejectedCount = Array.isArray(quotations) ? quotations.length : 0;
            setQuotationStats(prev => ({
              ...prev,
              rejected: rejectedCount
            }));
          }
        } catch (error) {
          console.warn("Could not fetch rejected quotations:", error.message);
        }
      }
    } catch (err) {
      console.error("Error fetching salesperson profile:", err);
      setError("Failed to load profile data from API");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Approved Quotations', value: quotationStats.approved.toString(), change: '' },
    { label: 'Rejected Quotations', value: quotationStats.rejected.toString(), change: '' },
    { label: 'Role', value: profileData.roles?.[0] || 'Salesperson', change: '' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
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
        setSuccessMsg(response.data.message || "Profile updated successfully!");
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
      console.error("Error updating salesperson profile:", err);
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
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setPasswordError(null);

      const payload = {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation
      };

      console.log("Attempting Password Change. Method: PUT, URL: /profile/change-password");
      console.log("Payload keys:", Object.keys(payload));
      
      const response = await API.put("/profile/change-password", payload);
      
      console.log("Password Change Result:", response.data);

      if (response.data.success) {
        setSuccessMsg(response.data.message || "Password changed successfully!");
        setShowPasswordModal(false);
        setPasswordData({ current_password: "", new_password: "", new_password_confirmation: "" });
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Password Change Error:", err);
      console.log("Error Response Data:", err.response?.data);
      
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        // Log individual validation errors for debugging
        console.table(validationErrors);
        const firstError = Object.values(validationErrors).flat()[0];
        setPasswordError(firstError);
      } else {
        const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to change password";
        setPasswordError(errorMsg);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-400 mt-1">Manage your account details and performance</p>
        </div>
        
        <div className="flex gap-3">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl font-semibold text-white flex gap-2 items-center transition-all duration-200 shadow-lg shadow-blue-600/20"
            >
              <FiEdit2 /> Edit Profile
            </button>
          ) : (
            <>
              <button 
                onClick={handleCancel}
                disabled={saving}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-2.5 rounded-xl font-semibold text-white flex gap-2 items-center transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 px-6 py-2.5 rounded-xl font-semibold text-white flex gap-2 items-center transition-all duration-200 shadow-lg shadow-green-600/20"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

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
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2 border-b border-gray-700 pb-4">
              <FiUser className="text-blue-500" /> Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Full Name</label>
                {isEditing ? (
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-700/50">
                    <p className="text-lg text-white font-semibold">{profileData.name}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Email Address</label>
                {isEditing ? (
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-700/50">
                    <p className="text-lg text-white font-semibold">{profileData.email}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Department</label>
                <div className="bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-700/50">
                  <p className="text-white font-medium">{profileData.department}</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Address</label>
                <div className="bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-700/50">
                   <p className="text-white font-medium whitespace-pre-line">{profileData.address}</p>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Bio</label>
                <div className="bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-700/50">
                  <p className="text-white font-medium">{profileData.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Profile Picture Card */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-600/30 border-4 border-gray-800">
                {profileData.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <h3 className="text-2xl font-bold text-white">{profileData.name}</h3>
              <p className="text-gray-400 font-medium mb-6 uppercase tracking-widest text-xs">{profileData.position}</p>
              
              <div className="pt-6 border-t border-gray-700 space-y-3">
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 border border-red-500/20"
                >
                  <FiLock /> Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">Account Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-gray-700/50 pb-3">
                <span className="text-gray-400 lowercase tracking-wider">User ID</span>
                <span className="text-white font-mono">#{profileData.id}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-gray-700/50 pb-3">
                <span className="text-gray-400 lowercase tracking-wider">Status</span>
                <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 lowercase tracking-wider">Access Level</span>
                <span className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">{profileData.roles?.[0] || 'Salesperson'}</span>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
            <h3 className="text-lg font-bold mb-6">Performance Performance</h3>
            <div className="space-y-6">
              {stats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-xs lowercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-white font-bold text-xl">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700">
                     {index === 0 ? "✅" : index === 1 ? "❌" : "🛡️"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FiLock className="text-blue-500" /> Change Password
              </h3>
              <button 
                onClick={() => { setShowPasswordModal(false); setPasswordError(null); }}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={saving}
              >
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
              {passwordError && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-500 text-sm flex items-center gap-2">
                   <span>⚠️</span> {passwordError}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    required
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData(d => ({ ...d, current_password: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-11 pr-12 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                    required
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(d => ({ ...d, new_password: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-11 pr-12 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                    required
                    value={passwordData.new_password_confirmation}
                    onChange={(e) => setPasswordData(d => ({ ...d, new_password_confirmation: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-11 pr-12 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                  onClick={() => { setShowPasswordModal(false); setPasswordError(null); }} 
                  disabled={saving}
                  className="flex-1 py-3 bg-gray-700 rounded-xl font-bold hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-500 rounded-xl font-bold transition-all duration-200 hover:from-blue-700 hover:to-purple-600 shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : <FiCheckCircle />}
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;