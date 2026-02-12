import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiBriefcase, FiAlertCircle } from 'react-icons/fi';
import API, { createAdmin } from '../../api/api';

const UserManagement = () => {
  const navigate = useNavigate();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/users");
      
      const getRoleDisplay = (role) => {
        const roles = {
          'super-admin': 'Super Admin',
          'admin': 'Admin',
          'manager': 'Manager',
          'salesperson': 'Salesperson'
        };
        return roles[role.toLowerCase()] || role;
      };

      const getUserColor = (role) => {
        const colors = {
          'super-admin': 'bg-red-500',
          'admin': 'bg-purple-500',
          'manager': 'bg-yellow-500',
          'salesperson': 'bg-blue-500'
        };
        return colors[role.toLowerCase()] || 'bg-gray-500';
      };

      // Transform data with robust fallbacks
      const teamData = response.data.team || {};
      const allUsers = response.data.users || teamData.admins || response.data || [];
      
      const userList = Array.isArray(allUsers) ? allUsers : 
                      (typeof allUsers === 'object' ? Object.values(allUsers).flat().filter(u => typeof u === 'object' && u !== null) : []);

      const transformedUsers = userList.map(user => {
        const role = user.role || (user.roles && user.roles[0]?.name) || (user.roles && user.roles[0]) || '';
        const profile = user.profile || {};
        
        // Reports To logic
        let reportsTo = 'System';
        if (role.toLowerCase() === 'salesperson') {
          const manager = user.manager || user.creator;
          reportsTo = manager ? (manager.name || manager.fullName) : (user.manager_id ? `Manager #${user.manager_id}` : 'Manager');
        } else if (role.toLowerCase() === 'manager') {
          const admin = user.admin || user.creator;
          reportsTo = admin ? (admin.name || admin.fullName) : (user.admin_id ? `Admin #${user.admin_id}` : 'Administrator');
        } else if (role.toLowerCase() === 'admin') {
          reportsTo = 'Super Admin';
        }

        return {
          ...user,
          fullName: user.name || user.fullName || 'N/A',
          name: user.name || user.fullName || 'N/A', // For backward compatibility in this component
          role: getRoleDisplay(role),
          roleRaw: role.toLowerCase(),
          creatorName: reportsTo,
          address: user.address || profile.address || 'Not Provided',
          area: user.region || user.area || profile.region || profile.area || 'N/A',
          contact: user.phone || user.contact || profile.phone || profile.contact || 'N/A',
          bio: user.bio || profile.bio || '',
          initials: (user.name || user.fullName || 'N').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
          profileColor: getUserColor(role),
          joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
          lastLogin: user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never',
          status: user.status === 'inactive' ? 'Inactive' : 'Active',
          stats: {
            created: user.quotations_count || 0,
            accepted: user.accepted_quotations_count || 0,
            successRate: user.success_rate || "0%"
          }
        };
      });

      setUsers(transformedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to synchronize user data with the server.");
    } finally {
      setLoading(false);
    }
  };

  // Filter out Super Admin (showing only regular users in the list)
  const filteredUsers = useMemo(() => {
    return users.filter(user => user.roleRaw !== "super-admin");
  }, [users]);

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
      setSaving(true);
      const payload = {
        name: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
        password_confirmation: newUser.confirmPassword,
        phone: newUser.contact,
        address: newUser.address,
        area: newUser.area
      };

      const response = await createAdmin(payload);

      if (response.data.success) {
        alert(response.data.message || "Admin created successfully");
        setShowAddUserModal(false);
        fetchUsers();
        // Reset form
        handleFormCancel();
      }
    } catch (err) {
      console.error("Error creating admin:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to create admin";
      alert(errorMsg);
    } finally {
      setSaving(false);
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
      {!loading && !error && (
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
                <p className="text-gray-500 text-xs sm:text-sm mt-1">Platform wide</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl text-blue-400">
                 <FiUser />
              </div>
            </div>
          </div>
          
          {/* Active Users Card */}
          <div 
            onClick={() => handleCardClick('total-users')}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 sm:p-6 border border-green-500/30 cursor-pointer hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm sm:text-base">Active Users</p>
                <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
                  {filteredUsers.filter(u => u.status === "Active").length}
                </h2>
                <p className="text-green-400 text-xs sm:text-sm mt-1">Currently active</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
                <FiBriefcase />
              </div>
            </div>
          </div>
          
          {/* Admins Card */}
          <div 
            onClick={() => navigate('/admin-list')}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 sm:p-6 border border-purple-500/30 cursor-pointer hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm sm:text-base">Admins</p>
                <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
                  {filteredUsers.filter(u => u.role === "Admin").length}
                </h2>
                <p className="text-purple-400 text-xs sm:text-sm mt-1">System admins</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
                ⚙️
              </div>
            </div>
          </div>
          
          {/* Sales Team Card */}
          <div 
            onClick={() => navigate('/salesperson-list')}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 sm:p-6 border border-blue-500/30 cursor-pointer hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm sm:text-base">Sales Team</p>
                <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
                  {filteredUsers.filter(u => u.role === "Salesperson").length}
                </h2>
                <p className="text-blue-400 text-xs sm:text-sm mt-1">Field agents</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
                <FiBriefcase />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-20 text-center mb-8">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Syncing user database...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 text-center mb-8">
           <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
           <p className="text-red-400 mb-6 font-medium">{error}</p>
           <button 
             onClick={fetchUsers}
             className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
           >
             Retry Sync
           </button>
        </div>
      )}

      {/* Users Table Section */}
      <div id="users-table">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">All Users ({filteredUsers.length})</h2>
          <p className="text-gray-400 text-sm">Showing all users except Super Admin</p>
        </div>

        {/* Users Table */}
        {!loading && !error && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">User</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Role</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Area</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Reports To</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Joined</th>
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
                            <div className="text-sm text-gray-400 truncate max-w-[200px]">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm truncate max-w-[150px]">{user.area}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                            <span className="text-gray-300 text-sm font-medium">{user.creatorName}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Reports To</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{user.joinDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => navigate(`/user-profile/${user.id}`)}
                            className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 border border-blue-600/20"
                          >
                            Profile
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
                  disabled={saving}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {saving ? "Creating..." : "Create User Account"}
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
