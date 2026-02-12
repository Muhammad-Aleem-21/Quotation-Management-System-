import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { getMyTeam } from "../../../api/api";
import SuperAdminNavbar from "../../../components/SuperAdminNavbar";
import { FiSearch, FiFilter, FiX, FiMail, FiPhone, FiMapPin, FiFileText, FiCheckCircle, FiXCircle, FiUsers, FiUser } from 'react-icons/fi';

const ManagerList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedManager, setSelectedManager] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyTeam('manager');
      
      const teamData = response.data.team || {};
      const allUsers = teamData.managers || response.data.users || response.data || [];
      
      // Ensure allUsers is an array for filtering
      const usersArray = Array.isArray(allUsers) ? allUsers : 
                        (typeof allUsers === 'object' ? Object.values(allUsers).flat().filter(Array.isArray).flat() : []);
      
      const getUserColor = (role) => {
        const colors = {
          'super-admin': 'bg-red-500',
          'admin': 'bg-purple-500',
          'manager': 'bg-green-500',
          'salesperson': 'bg-blue-500'
        };
        return colors[role.toLowerCase()] || 'bg-gray-500';
      };

      // Filter and transform for Managers
      const managerUsers = usersArray
        .filter(user => {
          if (!user) return false;
          const role = user.role || (user.roles && user.roles[0]?.name) || (user.roles && user.roles[0]) || '';
          return role.toLowerCase() === 'manager' || !role; // Fallback if role is missing but it's in the managers list
        })
        .map(user => {
          const roleName = 'Manager';
          const profile = user.profile || {};
          
          // Reports To Admin logic
          const admin = user.admin || user.creator;
          const reportsTo = admin ? (admin.name || admin.fullName) : (user.admin_id ? `Admin #${user.admin_id}` : 'Operations Admin');

          return {
            ...user,
            fullName: user.name || user.fullName || 'N/A',
            role: roleName,
            creatorName: reportsTo,
            address: user.address || profile.address || 'Not Provided',
            area: user.region || user.area || profile.region || profile.area || 'N/A',
            contact: user.phone || user.contact || profile.phone || profile.contact || 'N/A',
            bio: user.bio || profile.bio || '',
            initials: (user.name || user.fullName || 'N').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
            profileColor: getUserColor(roleName),
            joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
            lastActive: user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Recently',
            status: 'active',
            teamSize: user.salespersons_count || user.team_size || 0,
            stats: {
                totalQuotations: user.quotations_count || 0,
                accepted: user.accepted_quotations_count || 0,
                rejected: user.rejected_quotations_count || 0,
                pending: user.pending_quotations_count || 0,
                avgResponseTime: user.avg_response_time || 'N/A'
            }
          };
        });

      setManagers(managerUsers);
    } catch (err) {
      console.error("Error fetching managers:", err);
      setError("Failed to load managers list. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredManagers = useMemo(() => {
    if (!searchQuery) return managers;
    
    const query = searchQuery.toLowerCase();
    return managers.filter(manager =>
      manager.fullName.toLowerCase().includes(query) ||
      manager.email.toLowerCase().includes(query) ||
      manager.area.toLowerCase().includes(query) ||
      manager.id.toString().toLowerCase().includes(query)
    );
  }, [managers, searchQuery]);

  const handleManagerClick = (manager) => {
    setSelectedManager(manager);
    setShowDetailsModal(true);
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
                <h1 className="text-2xl sm:text-3xl font-bold">Manager Management</h1>
                <p className="text-gray-400 mt-1">
                    Manage team managers
                </p>
                </div>

                {/* Right Button */}
                <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                ← Back to Dashboard
                </button>

            </div>
            </div>


          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search managers by name, email, or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
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
          </div>

          {/* Stats Summary */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Total Managers</p>
                <p className="text-2xl font-bold text-yellow-400">{managers.length}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Total Team Size</p>
                <p className="text-2xl font-bold text-green-400">
                  {managers.reduce((sum, manager) => sum + (manager.teamSize || 0), 0)}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Total Quotations</p>
                <p className="text-2xl font-bold text-blue-400">
                  {managers.reduce((sum, manager) => sum + (manager.stats.totalQuotations || 0), 0)}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Avg Acceptance</p>
                <p className="text-2xl font-bold text-purple-400">
                  {managers.length > 0 
                    ? (managers.reduce((sum, manager) => {
                        const rate = manager.stats.totalQuotations > 0 
                          ? (manager.stats.accepted / manager.stats.totalQuotations) * 100 
                          : 0;
                        return sum + rate;
                      }, 0) / managers.length).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Fetching managers...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center mb-6">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={fetchManagers}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Managers Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredManagers.map((manager) => (
                <div 
                  key={manager.id}
                  onClick={() => handleManagerClick(manager)}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-4 cursor-pointer hover:border-yellow-500 hover:scale-[1.02] transition-all duration-200"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`${manager.profileColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}>
                      {manager.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{manager.fullName}</h3>
                        <span className="bg-yellow-600 text-xs px-2 py-1 rounded-full">
                          Manager
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1 truncate max-w-[150px]">{manager.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiPhone className="w-4 h-4" />
                      <span className="text-sm">{manager.contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiMapPin className="w-4 h-4" />
                      <span className="text-sm truncate">{manager.area}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiUsers className="w-4 h-4" />
                      <span className="text-sm">{manager.teamSize} team members</span>
                    </div>
                  </div>

                  {/* Manager Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 bg-gray-900/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <FiFileText className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] text-gray-400 uppercase">Quotations</span>
                        </div>
                        <p className="font-bold text-lg">{manager.stats.totalQuotations}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-900/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <FiCheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-[10px] text-gray-400 uppercase">Accepted</span>
                        </div>
                        <p className="font-bold text-lg">{manager.stats.accepted}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-900/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <FiXCircle className="w-3 h-3 text-red-400" />
                          <span className="text-[10px] text-gray-400 uppercase">Rejected</span>
                        </div>
                        <p className="font-bold text-lg">{manager.stats.rejected}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-900/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <FiUser className="w-3 h-3 text-yellow-400" />
                          <span className="text-[10px] text-gray-400 uppercase">Pending</span>
                        </div>
                        <p className="font-bold text-lg">{manager.stats.pending}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                       <span className="text-[10px] text-gray-500 uppercase">Avg Response: </span>
                       <span className="text-[10px] font-bold text-purple-400">{manager.stats.avgResponseTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredManagers.length === 0 && (
            <div className="text-center py-12">
              <FiUser className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No managers found matching your search</p>
            </div>
          )}

          {/* Manager Details Modal */}
          {showDetailsModal && selectedManager && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${selectedManager.profileColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}>
                        {selectedManager.initials}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedManager.fullName}</h2>
                        <span className="bg-yellow-600 text-sm px-3 py-1 rounded-full">
                          Team Manager
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
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Manager Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiMail className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="font-medium">{selectedManager.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiPhone className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">Contact</p>
                          <p className="font-medium">{selectedManager.contact}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiMapPin className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="text-sm text-gray-400">Area</p>
                          <p className="font-medium">{selectedManager.area}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiUsers className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Team Size</p>
                          <p className="font-medium">{selectedManager.teamSize} members</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Performance Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-900/30 border border-blue-700/30 p-4 rounded-xl text-center">
                        <FiFileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Total Quotations</p>
                        <p className="text-2xl font-bold">{selectedManager.stats.totalQuotations}</p>
                      </div>
                      <div className="bg-green-900/30 border border-green-700/30 p-4 rounded-xl text-center">
                        <FiCheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Accepted</p>
                        <p className="text-2xl font-bold">{selectedManager.stats.accepted}</p>
                      </div>
                      <div className="bg-red-900/30 border border-red-700/30 p-4 rounded-xl text-center">
                        <FiXCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Rejected</p>
                        <p className="text-2xl font-bold">{selectedManager.stats.rejected}</p>
                      </div>
                      <div className="bg-yellow-900/30 border border-yellow-700/30 p-4 rounded-xl text-center">
                        <FiUser className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Pending</p>
                        <p className="text-2xl font-bold">{selectedManager.stats.pending}</p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-gray-750 p-4 rounded-xl">
                        <p className="text-sm text-gray-400">Join Date</p>
                        <p className="font-medium">{selectedManager.joinDate}</p>
                      </div>
                      <div className="bg-gray-750 p-4 rounded-xl">
                        <p className="text-sm text-gray-400">Last Active</p>
                        <p className="font-medium">{selectedManager.lastActive}</p>
                      </div>
                      <div className="bg-gray-750 p-4 rounded-xl col-span-2">
                        <p className="text-sm text-gray-400">Average Response Time</p>
                        <p className="font-medium text-xl text-yellow-400">{selectedManager.stats.avgResponseTime}</p>
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
                    Edit Manager
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

export default ManagerList;