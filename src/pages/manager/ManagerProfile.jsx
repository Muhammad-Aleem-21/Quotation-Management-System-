import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { FiUser, FiMail, FiShield, FiCheckCircle } from "react-icons/fi";

const ManagerProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [profileData, setProfileData] = useState({
    id: "",
    name: "",
    email: "",
    roles: [],
    email_verified_at: "",
    created_at: "",
    updated_at: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching Manager Profile from: /profile");
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-400 mt-1">
            View your Manager account details
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 flex items-start gap-3">
          <div className="mt-0.5 text-lg">⚠️</div>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns - Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2 border-b border-gray-700 pb-4">
              <FiUser className="text-green-500" /> Account Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-700/50">
                  <p className="text-lg text-white font-semibold">{profileData.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-700/50">
                  <p className="text-lg text-white font-semibold">{profileData.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Account Role
                </label>
                <div className="flex items-center gap-3 bg-green-900/10 border border-green-500/20 px-4 py-3 rounded-xl">
                  <FiShield className="text-green-400" />
                  <span className="text-green-400 font-bold uppercase tracking-widest text-sm">
                    {profileData.roles[0]?.replace('_', ' ') || 'Manager'}
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

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Email Verified
                </label>
                <div className="bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-700/50">
                  <p className="text-white">{formatDate(profileData.email_verified_at)}</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Account Created
                </label>
                <div className="bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-700/50">
                  <p className="text-white">{formatDate(profileData.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Summary Section */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FiShield className="text-teal-500" /> Security Status
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
                  <div className="w-10 h-10 bg-teal-500/10 rounded-full flex items-center justify-center text-teal-500">
                    <FiShield />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Two-Factor Authentication</h4>
                    <p className="text-xs text-gray-400">Not yet configured for this account</p>
                  </div>
                </div>
                <button className="text-teal-400 text-xs font-bold hover:underline">ENABLE</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Summary */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center shadow-xl relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-br from-green-600 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-green-600/30 border-4 border-gray-800">
                {profileData.name.charAt(0).toUpperCase() || 'M'}
              </div>
              <h3 className="text-2xl font-bold text-white">{profileData.name}</h3>
              <p className="text-gray-400 font-medium mb-6">Team Manager</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
               Manager Privileges
            </h3>
            <div className="space-y-4">
              {[
                "Salesperson Management",
                "Team Quotation Oversight",
                "Performance Monitoring",
                "Report Generation",
                "Team Analytics"
              ].map((privilege, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  {privilege}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 rounded-2xl border border-green-500/20 p-8 shadow-xl">
             <h3 className="text-green-300 font-bold mb-2">Need Help?</h3>
             <p className="text-gray-400 text-sm mb-4">Questions about your Manager privileges or account settings?</p>
             <button className="text-green-400 font-bold text-sm hover:underline">Contact Support →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;
