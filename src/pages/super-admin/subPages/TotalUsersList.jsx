import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminNavbar from "../../../components/SuperAdminNavbar";
import API, { getAllUsers } from "../../../api/api";
import { FiSearch, FiFilter, FiX, FiUser, FiBriefcase, FiDownload, FiTrash2, FiEdit2, FiAlertCircle, FiEye, FiChevronRight, FiMail, FiPhone, FiMapPin, FiFileText, FiCheckCircle, FiXCircle, FiAward } from 'react-icons/fi';

const TotalUsersList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers();
      
      const teamData = response.data.team || {};
      const data = response.data.users || teamData.admins || response.data || [];
      const userList = Array.isArray(data) ? data : 
                      (typeof data === 'object' ? Object.values(data).flat().filter(u => typeof u === 'object' && u !== null) : []);
        
        // Transform data to match UI expectations if needed
        const transformedData = userList.map(user => {
          // Robust role extraction
          let roleName = 'User';
          if (user.role) {
            roleName = user.role;
          } else if (user.roles && user.roles.length > 0) {
            const firstRole = user.roles[0];
            roleName = typeof firstRole === 'string' ? firstRole : (firstRole.name || 'User');
          }

          // Hierarchy/Creator extraction logic based on role - Robust handling with ID lookup
          let reportsTo = 'Super Admin';
          const rName = roleName.toLowerCase();
          const findByAnyId = (id) => userList.find(u => u.id.toString() === id.toString());
          
          if (rName === 'salesperson') {
            const mName = (() => {
              if (typeof user.manager === 'object') return user.manager?.name;
              if (user.manager) {
                const found = findByAnyId(user.manager);
                if (found) return found.name || found.fullName;
                return user.manager;
              }
              return null;
            })();

            const aName = (() => {
              if (user.created_by_admin_name) return user.created_by_admin_name;
              if (typeof user.created_by_admin === 'object') return user.created_by_admin?.name;
              if (user.created_by_admin) {
                const found = findByAnyId(user.created_by_admin);
                if (found) return found.name || found.fullName;
                return user.created_by_admin;
              }
              return null;
            })();
            
            if (mName && aName && mName !== aName) {
              reportsTo = `${mName} (Admin: ${aName})`;
            } else {
              reportsTo = mName || aName || 'Super Admin';
            }
          } else if (rName === 'manager') {
            const aName = (() => {
              if (user.created_by_admin_name) return user.created_by_admin_name;
              if (typeof user.created_by_admin === 'object') return user.created_by_admin?.name;
              if (user.created_by_admin) {
                const found = findByAnyId(user.created_by_admin);
                if (found) return found.name || found.fullName;
                return user.created_by_admin;
              }
              return null;
            })();
            reportsTo = aName || 'Super Admin';
          } else if (rName === 'admin') {
            reportsTo = 'Super Admin';
          }

          // Nested profile data extraction
          const profile = user.profile || {};
          const area = user.region || user.area || user.city || profile.region || profile.area || profile.city || 'N/A';
          const contact = user.phone || user.contact || user.phone_number || profile.phone || profile.contact || profile.phone_number || 'N/A';

          return {
            ...user,
            fullName: user.name || user.fullName || 'N/A',
            role: roleName,
            creatorName: reportsTo,
            address: user.address || profile.address || 'Not Provided',
            area: area,
            contact: contact,
            bio: user.bio || profile.bio || '',
            initials: (user.name || user.fullName || 'N').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
            profileColor: getUserColor(roleName),
            stats: user.stats || {
              created: user.quotations_count || 0,
              accepted: user.accepted_quotations_count || 0,
              rejected: user.rejected_quotations_count || 0,
              pending: user.pending_quotations_count || 0,
              win: user.win_quotations_count || 0,
              successRate: user.success_rate || "0%"
            }
          };
        });
        
        setUsers(transformedData);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users from API");
    } finally {
      setLoading(false);
    }
  };

  const getUserColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return 'bg-purple-500';
      case 'manager': return 'bg-yellow-500';
      case 'salesperson': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Get unique values for filters
  const roles = useMemo(() => {
    const unique = [...new Set(users.map(u => u.role).filter(Boolean))];
    return unique.sort();
  }, [users]);

  const areas = useMemo(() => {
    const unique = [...new Set(users.map(u => u.area).filter(Boolean))];
    return unique.sort();
  }, [users]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = users.filter(u => u.role?.toLowerCase() !== 'super admin');
    
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
    navigate(`/user-profile/${user.id}`, { state: { userData: user } });
  };

  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
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
                <h1 className="text-2xl sm:text-3xl font-bold">Total Users</h1>
                <p className="text-gray-400 mt-1">
                    Manage and view all total users in the system
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
                      <option key="role-all" value="all">All Roles</option>
                      {roles.map(role => (
                        <option key={`role-${role}`} value={role}>{role}</option>
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
                      <option key="area-all" value="all">All Areas</option>
                      {areas.map(area => (
                        <option key={`area-${area}`} value={area}>{area}</option>
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
                      <option key="sort-name" value="name">Name</option>
                      <option key="sort-role" value="role">Role</option>
                      <option key="sort-area" value="area">Area</option>
                      <option key="sort-created" value="created">Quotations Created</option>
                      <option key="sort-accepted" value="accepted">Quotations Accepted</option>
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
                      <option key="order-asc" value="asc">Ascending</option>
                      <option key="order-desc" value="desc">Descending</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Admins</p>
              <p className="text-2xl font-bold text-purple-400">{users.filter(u => u.role?.toLowerCase() === 'admin').length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Managers</p>
              <p className="text-2xl font-bold text-yellow-400">{users.filter(u => u.role?.toLowerCase() === 'manager').length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Salespersons</p>
              <p className="text-2xl font-bold text-blue-400">{users.filter(u => u.role?.toLowerCase() === 'salesperson').length}</p>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              Showing {filteredUsers.length} of {users.length} total users
            </p>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-3 py-1 rounded-lg border border-red-400/20">
                <FiAlertCircle />
                <span>{error}</span>
                <button onClick={fetchUsers} className="underline ml-2 hover:text-red-300">Retry</button>
              </div>
            )}
            {loading && (
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Syncing with API...</span>
              </div>
            )}
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
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Reports To</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Contact</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Joined</th>
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
                      total Users ({filteredUsers.length})
                    </th>
                  </tr>
                </thead>
                
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-gray-400 animate-pulse">Loading users from server...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.map((user) => (
                    <React.Fragment key={user.id}>
                      {/* Mobile View - Card Layout */}
                      <tr className="sm:hidden border-b border-gray-700 hover:bg-gray-750 transition-colors duration-200">
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
                                <p className="text-gray-300 text-sm">{user.area || 'N/A'}</p>
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
                                  user.role?.toLowerCase() === 'salesperson' ? 'text-yellow-400' : 'text-gray-400'
                                }`}>
                                  {user.stats.successRate}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Status</p>
                                <span className={`${user.status?.toLowerCase() === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'} px-2 py-1 rounded text-xs`}>
                                  {user.status || 'Active'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Desktop/Tablet View - Table Layout */}
                      <tr className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
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
                        <td className="px-6 py-4 text-gray-300 text-sm">{user.area || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-gray-300 text-sm font-medium">{user.creatorName}</span>
                            <span className="text-gray-500 text-[10px] uppercase">Reports To</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-300 text-sm">{user.contact || user.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-400 text-xs italic">{user.joinDate || (user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A')}</div>
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
                              user.role?.toLowerCase() === 'salesperson' ? 'text-yellow-400' : 'text-gray-400'
                            }`}>
                              {user.stats.successRate}
                            </div>
                            <div className="text-xs text-gray-400">win rate</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`${user.status?.toLowerCase() === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'} px-3 py-1 rounded-full text-xs font-medium`}>
                            {user.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => navigate(`/user-profile/${user.id}`)}
                            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-blue-400 transition-all group"
                            title="View Full Profile"
                          >
                            <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && !loading && (
              <div className="text-center py-12">
                <FiUser className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No users found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : 'No users found.'}
                </p>
              </div>
            )}
          </div>

          {/* User Details Modal - Removed in favor of direct navigation */}
        </div>
      </div>
    </div>
  );
};

export default TotalUsersList;