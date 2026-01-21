import React, { useState } from "react";

const ManagerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    phone: "+1 (555) 987-6543",
    position: "Sales Manager",
    department: "Sales",
    joinDate: "2022-08-15",
    teamSize: "8 members",
    address: "456 Management Avenue, Suite 200\nNew York, NY 10001",
    bio: "Experienced sales manager with 8+ years in team leadership and sales strategy development.",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Profile saved:", profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const teamStats = [
    { label: "Team Members", value: "8", change: "+2" },
    { label: "Team Revenue", value: "$94.6K", change: "+15%" },
    { label: "Success Rate", value: "70.5%", change: "+2.3%" },
    { label: "Active Projects", value: "24", change: "+4" },
  ];

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
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white flex gap-2 items-center transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white flex gap-2 items-center transition-colors duration-200"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Full Name
                </label>
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
                <label className="block text-gray-400 text-sm mb-2">
                  Email
                </label>
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
                <label className="block text-gray-400 text-sm mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                  />
                ) : (
                  <p className="text-white font-medium">{profileData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Position
                </label>
                <p className="text-white font-medium">{profileData.position}</p>
              </div>
            </div>
          </div>

          {/* Professional Details Card */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-4">Professional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Department
                </label>
                <p className="text-white font-medium">
                  {profileData.department}
                </p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Join Date
                </label>
                <p className="text-white font-medium">{profileData.joinDate}</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Team Size
                </label>
                <p className="text-white font-medium">{profileData.teamSize}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 resize-none"
                  />
                ) : (
                  <p className="text-white font-medium whitespace-pre-line">
                    {profileData.address}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 resize-none"
                  />
                ) : (
                  <p className="text-white font-medium">{profileData.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Profile Picture Card */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              SW
            </div>
            <h3 className="text-lg font-bold text-white">{profileData.name}</h3>
            <p className="text-gray-400 text-sm">{profileData.position}</p>
            <p className="text-gray-400 text-sm mt-1">
              {profileData.department}
            </p>

            <button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors duration-200">
              Change Photo
            </button>
          </div>

          {/* Team Stats */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-bold mb-4">Team Overview</h3>
            <div className="space-y-4">
              {teamStats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-white font-bold text-lg">{stat.value}</p>
                  </div>
                  <span className="text-green-400 text-sm font-medium">
                    {stat.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors duration-200">
                Change Password
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors duration-200">
                Team Settings
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors duration-200">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;
