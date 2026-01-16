import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminNavbar from "../../../components/SuperAdminNavbar";
import { FiSearch, FiFilter, FiX, FiMail, FiPhone, FiMapPin, FiFileText, FiCheckCircle, FiXCircle, FiAward, FiUser, FiChevronRight } from 'react-icons/fi';

const ActiveList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    role: 'all',
    area: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const navigate = useNavigate();

  // Dummy data for active users
  const users = [
    {
      id: 1,
      fullName: "John Doe",
      email: "john.doe@example.com",
      contact: "+1 (555) 123-4567",
      area: "North America",
      role: "Salesperson",
      profileColor: "bg-blue-500",
      initials: "JD",
      joinDate: "2023-01-15",
      lastActive: "2024-01-15",
      status: "active",
      stats: {
        created: 45,
        accepted: 32,
        rejected: 8,
        pending: 5,
        win: 28,
        successRate: "87.5%"
      }
    },
    {
      id: 2,
      fullName: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      contact: "+1 (555) 234-5678",
      area: "Europe",
      role: "Admin",
      profileColor: "bg-purple-500",
      initials: "SW",
      joinDate: "2023-03-15",
      lastActive: "2024-01-15",
      status: "active",
      stats: {
        created: 0,
        accepted: 125,
        rejected: 42,
        pending: 23,
        win: 0,
        successRate: "N/A"
      }
    },
    {
      id: 3,
      fullName: "Michael Chen",
      email: "michael.chen@example.com",
      contact: "+1 (555) 345-6789",
      area: "Asia Pacific",
      role: "Salesperson",
      profileColor: "bg-green-500",
      initials: "MC",
      joinDate: "2023-08-10",
      lastActive: "2024-01-15",
      status: "active",
      stats: {
        created: 67,
        accepted: 48,
        rejected: 12,
        pending: 7,
        win: 40,
        successRate: "83.3%"
      }
    },
    {
      id: 4,
      fullName: "Emma Rodriguez",
      email: "emma.rodriguez@example.com",
      contact: "+1 (555) 456-7890",
      area: "South America",
      role: "Manager",
      profileColor: "bg-yellow-500",
      initials: "ER",
      joinDate: "2023-02-10",
      lastActive: "2024-01-15",
      status: "active",
      stats: {
        created: 0,
        accepted: 89,
        rejected: 31,
        pending: 15,
        win: 0,
        successRate: "N/A"
      }
    },
    {
      id: 5,
      fullName: "Alex Turner",
      email: "alex.turner@example.com",
      contact: "+1 (555) 567-8901",
      area: "Middle East",
      role: "Salesperson",
      profileColor: "bg-red-500",
      initials: "AT",
      joinDate: "2023-05-12",
      lastActive: "2024-01-14",
      status: "active",
      stats: {
        created: 52,
        accepted: 38,
        rejected: 9,
        pending: 5,
        win: 35,
        successRate: "92.1%"
      }
    },
    {
      id: 6,
      fullName: "Lisa Park",
      email: "lisa.park@example.com",
      contact: "+1 (555) 678-9012",
      area: "East Asia",
      role: "Salesperson",
      profileColor: "bg-indigo-500",
      initials: "LP",
      joinDate: "2023-06-18",
      lastActive: "2024-01-15",
      status: "active",
      stats: {
        created: 38,
        accepted: 29,
        rejected: 6,
        pending: 3,
        win: 25,
        successRate: "86.2%"
      }
    },
    {
      id: 7,
      fullName: "David Miller",
      email: "david.miller@example.com",
      contact: "+1 (555) 789-0123",
      area: "Central Europe",
      role: "Admin",
      profileColor: "bg-pink-500",
      initials: "DM",
      joinDate: "2023-05-20",
      lastActive: "2024-01-14",
      status: "active",
      stats: {
        created: 0,
        accepted: 167,
        rejected: 58,
        pending: 32,
        win: 0,
        successRate: "N/A"
      }
    },
    {
      id: 8,
      fullName: "Sophia Williams",
      email: "sophia.williams@example.com",
      contact: "+1 (555) 890-1234",
      area: "West Coast",
      role: "Manager",
      profileColor: "bg-teal-500",
      initials: "SW",
      joinDate: "2023-04-22",
      lastActive: "2024-01-13",
      status: "active",
      stats: {
        created: 0,
        accepted: 94,
        rejected: 27,
        pending: 18,
        win: 0,
        successRate: "N/A"
      }
    },
  ];

  // Get unique values for filters
  const roles = useMemo(() => {
    const unique = [...new Set(users.map(u => u.role))];
    return unique;
  }, [users]);

  const areas = useMemo(() => {
    const unique = [...new Set(users.map(u => u.area))];
    return unique;
  }, [users]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user =>
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.area.toLowerCase().includes(query)
      );
    }
    
    // Apply role filter
    if (filters.role !== 'all') {
      result = result.filter(user => user.role === filters.role);
    }
    
    // Apply area filter
    if (filters.area !== 'all') {
      result = result.filter(user => user.area === filters.area);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.fullName.localeCompare(b.fullName);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'area':
          comparison = a.area.localeCompare(b.area);
          break;
        case 'created':
          comparison = b.stats.created - a.stats.created;
          break;
        case 'accepted':
          comparison = b.stats.accepted - a.stats.accepted;
          break;
        default:
          comparison = a.fullName.localeCompare(b.fullName);
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [users, searchQuery, filters]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const getRoleColor = (role) => {
    switch(role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-600 text-purple-100';
      case 'manager':
        return 'bg-yellow-600 text-yellow-100';
      case 'salesperson':
        return 'bg-blue-600 text-blue-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <SuperAdminNavbar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 lg:ml-64 lg:-mt-135 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
        <div className="h-16 lg:h-0"></div>
        
        <div className={`p-4 sm:p-6 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
          
          <div className={`p-4 sm:p-6 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
                
                {/* Left Text */}
                <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Active Users</h1>
                <p className="text-gray-400 mt-1">
                    Manage and view all active users in the system
                </p>
                </div>

                {/* Right Button */}
                <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                ← Back
                </button>

            </div>
          </div>


          {/* Search and Filter Bar */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-4 mb-6">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, role, or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FiX />
                  </button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col sm:flex-row gap-3">
                  {/* Role Filter */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Role</label>
                    <select
                      value={filters.role}
                      onChange={(e) => setFilters({...filters, role: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">All Roles</option>
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  {/* Area Filter */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Area</label>
                    <select
                      value={filters.area}
                      onChange={(e) => setFilters({...filters, area: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">All Areas</option>
                      {areas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Sort By</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option value="name">Name</option>
                      <option value="role">Role</option>
                      <option value="area">Area</option>
                      <option value="created">Quotations Created</option>
                      <option value="accepted">Quotations Accepted</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Order</label>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) => setFilters({...filters, sortOrder: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Total Active Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Admins</p>
              <p className="text-2xl font-bold text-purple-400">{users.filter(u => u.role === 'Admin').length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Managers</p>
              <p className="text-2xl font-bold text-yellow-400">{users.filter(u => u.role === 'Manager').length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Salespersons</p>
              <p className="text-2xl font-bold text-blue-400">{users.filter(u => u.role === 'Salesperson').length}</p>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              Showing {filteredUsers.length} of {users.length} active users
            </p>
          </div>

          {/* Users Table */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                {/* Desktop Headers */}
                <thead className="bg-gray-700 hidden sm:table-header-group">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">User</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Role</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Area</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Contact</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Quotations Created</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Quotations Accepted</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Win Rate</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm"></th>
                  </tr>
                </thead>
                
                {/* Mobile Headers */}
                <thead className="bg-gray-700 sm:hidden">
                  <tr>
                    <th colSpan="2" className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Active Users ({filteredUsers.length})
                    </th>
                  </tr>
                </thead>
                
                <tbody>
                  {filteredUsers.map((user) => (
                    <>
                      {/* Mobile View - Card Layout */}
                      <tr key={`mobile-${user.id}`} className="sm:hidden border-b border-gray-700 hover:bg-gray-750 transition-colors duration-200">
                        <td colSpan="2" className="p-4">
                          <div 
                            className="space-y-3 cursor-pointer"
                            onClick={() => handleUserClick(user)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <div className={`${user.profileColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold`}>
                                  {user.initials}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-white">{user.fullName}</h3>
                                  <p className="text-gray-400 text-sm">{user.email}</p>
                                </div>
                              </div>
                              <FiChevronRight className="text-gray-400" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Role</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                  {user.role}
                                </span>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Area</p>
                                <p className="text-gray-300 text-sm">{user.area}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Created</p>
                                <p className="text-blue-400 text-sm font-bold">{user.stats.created}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Accepted</p>
                                <p className="text-green-400 text-sm font-bold">{user.stats.accepted}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Win Rate</p>
                                <p className={`text-sm font-bold ${
                                  user.role === 'Salesperson' ? 'text-yellow-400' : 'text-gray-400'
                                }`}>
                                  {user.stats.successRate}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Status</p>
                                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Desktop/Tablet View - Table Layout */}
                      <tr key={`desktop-${user.id}`} className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div 
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => handleUserClick(user)}
                          >
                            <div className={`${user.profileColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold`}>
                              {user.initials}
                            </div>
                            <div>
                              <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {user.fullName}
                              </div>
                              <div className="text-xs text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{user.area}</td>
                        <td className="px-6 py-4">
                          <div className="text-gray-300 text-sm">{user.contact}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-center">
                            <div className="text-blue-400 font-bold text-lg">{user.stats.created}</div>
                            <div className="text-xs text-gray-400">created</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-center">
                            <div className="text-green-400 font-bold text-lg">{user.stats.accepted}</div>
                            <div className="text-xs text-gray-400">accepted</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-center">
                            <div className={`font-bold text-lg ${
                              user.role === 'Salesperson' ? 'text-yellow-400' : 'text-gray-400'
                            }`}>
                              {user.stats.successRate}
                            </div>
                            <div className="text-xs text-gray-400">win rate</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleUserClick(user)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <FiChevronRight className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <FiUser className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No users found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : 'No active users found.'}
                </p>
              </div>
            )}
          </div>

          {/* User Details Modal */}
          {showDetailsModal && selectedUser && (
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
                        <h2 className="text-2xl font-bold">{selectedUser.fullName}</h2>
                        <span className={`${getRoleColor(selectedUser.role)} text-sm px-3 py-1 rounded-full`}>
                          {selectedUser.role}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowDetailsModal(false)}
                      className="text-gray-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  {/* Personal Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiMail className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="font-medium">{selectedUser.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiPhone className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">Contact</p>
                          <p className="font-medium">{selectedUser.contact}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiMapPin className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="text-sm text-gray-400">Area</p>
                          <p className="font-medium">{selectedUser.area}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiUser className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">User ID</p>
                          <p className="font-medium">#{selectedUser.id.toString().padStart(4, '0')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quotation Statistics */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Quotation Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-900/30 border border-blue-700/30 p-4 rounded-xl text-center">
                        <FiFileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Created</p>
                        <p className="text-2xl font-bold">{selectedUser.stats.created}</p>
                      </div>
                      <div className="bg-green-900/30 border border-green-700/30 p-4 rounded-xl text-center">
                        <FiCheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Accepted</p>
                        <p className="text-2xl font-bold">{selectedUser.stats.accepted}</p>
                      </div>
                      <div className="bg-red-900/30 border border-red-700/30 p-4 rounded-xl text-center">
                        <FiXCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Rejected</p>
                        <p className="text-2xl font-bold">{selectedUser.stats.rejected}</p>
                      </div>
                      {selectedUser.role === 'Salesperson' ? (
                        <div className="bg-yellow-900/30 border border-yellow-700/30 p-4 rounded-xl text-center">
                          <FiAward className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">Win</p>
                          <p className="text-2xl font-bold">{selectedUser.stats.win}</p>
                          {selectedUser.stats.accepted > 0 && (
                            <p className="text-xs text-yellow-300 mt-1">
                              {((selectedUser.stats.win / selectedUser.stats.accepted) * 100).toFixed(1)}% success rate
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl text-center">
                          <FiFileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">Pending Review</p>
                          <p className="text-2xl font-bold">{selectedUser.stats.pending}</p>
                        </div>
                      )}
                    </div>

                    {/* Performance Metrics */}
                    {selectedUser.role === 'Salesperson' && (
                      <div className="mt-6 p-4 bg-gray-750 rounded-xl">
                        <h4 className="font-semibold mb-3 text-gray-300">Performance Metrics</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Acceptance Rate</span>
                              <span className="font-medium">
                                {selectedUser.stats.created > 0 
                                  ? ((selectedUser.stats.accepted / selectedUser.stats.created) * 100).toFixed(1)
                                  : '0'}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full"
                                style={{ 
                                  width: `${selectedUser.stats.created > 0 
                                    ? (selectedUser.stats.accepted / selectedUser.stats.created) * 100 
                                    : 0}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Win Rate</span>
                              <span className="font-medium">
                                {selectedUser.stats.accepted > 0 
                                  ? ((selectedUser.stats.win / selectedUser.stats.accepted) * 100).toFixed(1)
                                  : '0'}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-500 rounded-full"
                                style={{ 
                                  width: `${selectedUser.stats.accepted > 0 
                                    ? (selectedUser.stats.win / selectedUser.stats.accepted) * 100 
                                    : 0}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-gray-750 p-4 rounded-xl">
                        <p className="text-sm text-gray-400">Join Date</p>
                        <p className="font-medium">{selectedUser.joinDate}</p>
                      </div>
                      <div className="bg-gray-750 p-4 rounded-xl">
                        <p className="text-sm text-gray-400">Last Active</p>
                        <p className="font-medium">{selectedUser.lastActive}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Edit User
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveList;