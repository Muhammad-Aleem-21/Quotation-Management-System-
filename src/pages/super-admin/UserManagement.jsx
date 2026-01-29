import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiBriefcase } from 'react-icons/fi';
import API from '../../api/api';

const UserManagement = () => {
  const navigate = useNavigate();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form state
  const [newUser, setNewUser] = useState({
    role: 'Admin',
    fullName: '',
    email: '',
    contact: '',
    address: '',
    area: '',
    password: '',
    confirmPassword: ''
  });

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Admin",
      status: "Active",
      joinDate: "2023-01-15",
      lastLogin: "2024-01-20 14:30",
      contact: "+1 (555) 123-4567",
      area: "North America",
      profileColor: "bg-blue-500",
      initials: "JD"
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      role: "Admin",
      status: "Active",
      joinDate: "2023-03-10",
      lastLogin: "2024-01-20 10:15",
      contact: "+1 (555) 234-5678",
      area: "Europe",
      profileColor: "bg-purple-500",
      initials: "SW"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      role: "Salesperson",
      status: "Inactive",
      joinDate: "2023-06-22",
      lastLogin: "2024-01-18 09:45",
      contact: "+1 (555) 345-6789",
      area: "Asia Pacific",
      profileColor: "bg-green-500",
      initials: "MJ"
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@company.com",
      role: "Manager",
      status: "Active",
      joinDate: "2023-02-28",
      lastLogin: "2024-01-20 16:20",
      contact: "+1 (555) 456-7890",
      area: "South America",
      profileColor: "bg-yellow-500",
      initials: "ED"
    },
    {
      id: 5,
      name: "Robert Chen",
      email: "robert.chen@company.com",
      role: "Salesperson",
      status: "Active",
      joinDate: "2023-08-10",
      lastLogin: "2024-01-19 11:30",
      contact: "+1 (555) 567-8901",
      area: "East Asia",
      profileColor: "bg-indigo-500",
      initials: "RC"
    },
    {
      id: 6,
      name: "Lisa Park",
      email: "lisa.park@company.com",
      role: "Manager",
      status: "Active",
      joinDate: "2023-04-15",
      lastLogin: "2024-01-20 08:45",
      contact: "+1 (555) 678-9012",
      area: "West Coast",
      profileColor: "bg-teal-500",
      initials: "LP"
    }
  ];

  // Filter out Super Admin (showing only regular users in the list)
  const filteredUsers = users.filter(user => user.role !== "Super Admin");

  const getStatusColor = (status) => {
    return status === "Active" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300";
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Super Admin": return "bg-red-500/20 text-red-300";
      case "Admin": return "bg-purple-500/20 text-purple-300";
      case "Manager": return "bg-yellow-500/20 text-yellow-300";
      case "Salesperson": return "bg-blue-500/20 text-blue-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleCardClick = (type) => {
    switch(type) {
      case 'active-list':
        navigate('/active-list');
        break;
      case 'admin-list':
        navigate('/admin-list');
        break;
      case 'salesperson-list':
        navigate('/salesperson-list');
        break;
      case 'total-users':
        // Scroll to users table
        document.getElementById('users-table').scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await API.post('/users/create-admin', {
        name: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
        password_confirmation: newUser.confirmPassword,
        contact: newUser.contact,
        address: newUser.address,
        area: newUser.area
      });

      if (response.data.success) {
        alert(response.data.message || 'Admin created successfully!');
        setShowAddUserModal(false);
        // Reset form
        setNewUser({
          role: 'Admin',
          fullName: '',
          email: '',
          contact: '',
          address: '',
          area: '',
          password: '',
          confirmPassword: ''
        });
        // Optional: Refresh users list if needed
      } else {
        alert(response.data.message || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred while creating admin';
      alert(errorMessage);
    }
  };

  const handleFormCancel = () => {
    setShowAddUserModal(false);
    // Reset form
    setNewUser({
      role: 'Admin',
      fullName: '',
      email: '',
      contact: '',
      address: '',
      area: '',
      password: '',
      confirmPassword: ''
    });
  };

  const roleOptions = [
    { value: 'Admin', label: 'Admin', color: 'bg-purple-500/20 text-purple-300' }
  ];

  const areaOptions = [
    'North America', 'South America', 'Europe', 'Asia Pacific', 
    'Middle East', 'Africa', 'Australia', 'Central America'
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
          <p className="text-gray-400 mt-1">Manage all system users and their permissions</p>
        </div>
        
        <button 
          onClick={handleAddUser}
          className="bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white flex gap-2 items-center transition-colors duration-200"
        >
          <span className="text-xl">+</span> Add New User
        </button>
      </div>

      {/* Stats Cards - Clickable */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Total Users Card */}
        <div 
          onClick={() => handleCardClick('total-users')}
          className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 cursor-pointer hover:scale-[1.02] transition-all duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Total Users</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{filteredUsers.length}</h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Click to view all users</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
              👥
            </div>
          </div>
        </div>
        
        {/* Active Users Card */}
        <div 
          onClick={() => handleCardClick('active-list')}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 sm:p-6 border border-green-500/30 cursor-pointer hover:scale-[1.02] transition-all duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Active Users</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
                {filteredUsers.filter(u => u.status === "Active").length}
              </h2>
              <p className="text-green-400 text-xs sm:text-sm mt-1">Click to view active users</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
              ✅
            </div>
          </div>
        </div>
        
        {/* Admins Card */}
        <div 
          onClick={() => handleCardClick('admin-list')}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 sm:p-6 border border-purple-500/30 cursor-pointer hover:scale-[1.02] transition-all duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Admins</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
                {filteredUsers.filter(u => u.role === "Admin").length}
              </h2>
              <p className="text-purple-400 text-xs sm:text-sm mt-1">Click to view all admins</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
              ⚙️
            </div>
          </div>
        </div>
        
        {/* Sales Team Card */}
        <div 
          onClick={() => handleCardClick('salesperson-list')}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 sm:p-6 border border-blue-500/30 cursor-pointer hover:scale-[1.02] transition-all duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Sales Team</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
                {filteredUsers.filter(u => u.role === "Salesperson").length}
              </h2>
              <p className="text-blue-400 text-xs sm:text-sm mt-1">Click to view salespersons</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
              📊
            </div>
          </div>
        </div>
      </div>

      {/* Users Table Section */}
      <div id="users-table">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">All Users ({filteredUsers.length})</h2>
          <p className="text-gray-400 text-sm">Showing all users except Super Admin</p>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">User</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">Join Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">Last Login</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-750 transition-colors duration-200">
                    <td className="px-4 py-3">
                      <div 
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => handleUserClick(user)}
                      >
                        <div className={`${user.profileColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold`}>
                          {user.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{user.joinDate}</td>
                    <td className="px-4 py-3 text-gray-300">{user.lastLogin}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200">
                          Edit
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${selectedUser.profileColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}>
                    {selectedUser.initials}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                    <span className={`${getRoleColor(selectedUser.role)} text-sm px-3 py-1 rounded-full`}>
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-750 rounded-lg">
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium text-lg">{selectedUser.email}</p>
                  </div>
                  <div className="p-4 bg-gray-750 rounded-lg">
                    <p className="text-sm text-gray-400">Contact</p>
                    <p className="font-medium text-lg">{selectedUser.contact}</p>
                  </div>
                  <div className="p-4 bg-gray-750 rounded-lg">
                    <p className="text-sm text-gray-400">Area</p>
                    <p className="font-medium text-lg">{selectedUser.area}</p>
                  </div>
                  <div className="p-4 bg-gray-750 rounded-lg">
                    <p className="text-sm text-gray-400">User ID</p>
                    <p className="font-medium text-lg">#{selectedUser.id.toString().padStart(4, '0')}</p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-750 rounded-lg">
                    <p className="text-sm text-gray-400">Status</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-750 rounded-lg">
                    <p className="text-sm text-gray-400">Role</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-750 rounded-lg">
                    <p className="text-sm text-gray-400">Join Date</p>
                    <p className="font-medium text-lg">{selectedUser.joinDate}</p>
                  </div>
                  <div className="p-4 bg-gray-750 rounded-lg">
                    <p className="text-sm text-gray-400">Last Login</p>
                    <p className="font-medium text-lg">{selectedUser.lastLogin}</p>
                  </div>
                </div>
              </div>

              {/* Permissions Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">User Permissions</h3>
                <div className="p-4 bg-gray-750 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">View Quotations</span>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Create Quotations</span>
                      <div className={`w-3 h-3 rounded-full ${selectedUser.role === 'Salesperson' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Approve/Reject Quotations</span>
                      <div className={`w-3 h-3 rounded-full ${selectedUser.role === 'Admin' || selectedUser.role === 'Manager' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Manage Users</span>
                      <div className={`w-3 h-3 rounded-full ${selectedUser.role === 'Admin' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">View Reports</span>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit User
              </button>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Deactivate User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white text-xl">
                    <FiUser className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Add New User</h2>
                    <p className="text-gray-400 text-sm">Create a new user account</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body - Form */}
            <form onSubmit={handleFormSubmit} className="p-6">
              <div className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    <FiBriefcase className="inline-block w-4 h-4 mr-2" />
                    Role *
                  </label>
                  <div className="p-4 rounded-xl border border-red-500 bg-red-500/10">
                    <div className="flex flex-col items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                        Admin
                      </span>
                      <p className="text-sm text-gray-400 text-center">
                        Full system access (Only Super Admin can create other Admins)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      <FiUser className="inline-block w-4 h-4 mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={newUser.fullName}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      <FiMail className="inline-block w-4 h-4 mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      <FiPhone className="inline-block w-4 h-4 mr-2" />
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={newUser.contact}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      <FiMapPin className="inline-block w-4 h-4 mr-2" />
                      Area/Region *
                    </label>
                    <select
                      name="area"
                      value={newUser.area}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    >
                      <option value="">Select Area</option>
                      {areaOptions.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    <FiMapPin className="inline-block w-4 h-4 mr-2" />
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={newUser.address}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="Enter complete address"
                  />
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      <FiLock className="inline-block w-4 h-4 mr-2" />
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      placeholder="Enter password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      <FiLock className="inline-block w-4 h-4 mr-2" />
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={newUser.confirmPassword}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={handleFormCancel}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;