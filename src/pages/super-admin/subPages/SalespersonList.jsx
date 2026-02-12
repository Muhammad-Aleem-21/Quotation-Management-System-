import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { getMyTeam } from "../../../api/api";
import SuperAdminNavbar from "../../../components/SuperAdminNavbar";
import { FiSearch, FiFilter, FiX, FiMail, FiPhone, FiMapPin, FiFileText, FiCheckCircle, FiXCircle, FiAward, FiUser } from 'react-icons/fi';

const SalespersonList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSalesperson, setSelectedSalesperson] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [salespersons, setSalespersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalespersons();
  }, []);

  const fetchSalespersons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyTeam('salesperson');
      
      const teamData = response.data.team || {};
      const allUsers = teamData.salespersons || response.data.users || response.data || [];
      
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

      // Filter and transform for Salespersons
      const salespersonUsers = usersArray
        .filter(user => {
          if (!user) return false;
          const role = user.role || (user.roles && user.roles[0]?.name) || (user.roles && user.roles[0]) || '';
          return role.toLowerCase() === 'salesperson' || !role; // Fallback if role is missing but it's in the salespersons list
        })
        .map(user => {
          const roleName = 'Salesperson';
          const profile = user.profile || {};
          
          // Reports To Manager logic
          const manager = user.manager || user.creator;
          const reportsTo = manager ? (manager.name || manager.fullName) : (user.manager_id ? `Manager #${user.manager_id}` : 'Team Manager');

          return {
            ...user,
            fullName: user.name || user.fullName || 'N/A',
            role: roleName,
            creatorName: reportsTo,
            manager: reportsTo, // For filtering consistency
            address: user.address || profile.address || 'Not Provided',
            area: user.region || user.area || profile.region || profile.area || 'N/A',
            contact: user.phone || user.contact || profile.phone || profile.contact || 'N/A',
            bio: user.bio || profile.bio || '',
            initials: (user.name || user.fullName || 'N').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
            profileColor: getUserColor(roleName),
            joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
            lastActive: user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Recently',
            status: 'active',
            stats: {
                created: user.quotations_count || 0,
                accepted: user.accepted_quotations_count || 0,
                rejected: user.rejected_quotations_count || 0,
                pending: user.pending_quotations_count || 0,
                win: user.win_quotations_count || 0,
                successRate: user.success_rate || "0%"
            }
          };
        });

      setSalespersons(salespersonUsers);
    } catch (err) {
      console.error("Error fetching salespersons:", err);
      setError("Failed to load sales team list. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSalespersons = useMemo(() => {
    if (!searchQuery) return salespersons;
    
    const query = searchQuery.toLowerCase();
    return salespersons.filter(sp =>
      sp.fullName.toLowerCase().includes(query) ||
      sp.email.toLowerCase().includes(query) ||
      sp.area.toLowerCase().includes(query) ||
      sp.id.toString().toLowerCase().includes(query) ||
      sp.manager.toLowerCase().includes(query)
    );
  }, [salespersons, searchQuery]);

  const handleSalespersonClick = (salesperson) => {
    setSelectedSalesperson(salesperson);
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
                <h1 className="text-2xl sm:text-3xl font-bold">Salesperson Management</h1>
                <p className="text-gray-400 mt-1">
                    Manage sales team members
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
                placeholder="Search salespersons by name, email, area, or manager..."
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
                <p className="text-gray-400 text-sm">Total Salespersons</p>
                <p className="text-2xl font-bold text-blue-400">{salespersons.length}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Total Quotations Created</p>
                <p className="text-2xl font-bold text-green-400">
                  {salespersons.reduce((sum, sp) => sum + (sp.stats.created || 0), 0)}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Total Wins</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {salespersons.reduce((sum, sp) => sum + (sp.stats.win || 0), 0)}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Avg Success Rate</p>
                <p className="text-2xl font-bold text-purple-400">
                  {salespersons.length > 0 
                    ? (salespersons.reduce((sum, sp) => {
                        const rate = parseFloat(sp.stats.successRate) || 0;
                        return sum + rate;
                      }, 0) / salespersons.length).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Fetching sales team...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center mb-6">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={fetchSalespersons}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Salespersons Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSalespersons.map((sp) => (
                <div 
                  key={sp.id}
                  onClick={() => handleSalespersonClick(sp)}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-4 cursor-pointer hover:border-blue-500 hover:scale-[1.02] transition-all duration-200"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`${sp.profileColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}>
                      {sp.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{sp.fullName}</h3>
                        <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">
                          Sales
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1 truncate max-w-[150px]">{sp.email}</p>
                      <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-wider">Manager: {sp.reportsToName || sp.manager}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiPhone className="w-4 h-4" />
                      <span className="text-sm">{sp.contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiMapPin className="w-4 h-4" />
                      <span className="text-sm truncate">{sp.area}</span>
                    </div>
                  </div>

                  {/* Salesperson Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-gray-900/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <FiFileText className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] text-gray-400 uppercase">Quotes</span>
                        </div>
                        <p className="font-bold text-lg">{sp.stats.created}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-900/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <FiAward className="w-3 h-3 text-yellow-400" />
                          <span className="text-[10px] text-gray-400 uppercase">Wins</span>
                        </div>
                        <p className="font-bold text-lg">{sp.stats.win}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-[10px] text-gray-400 uppercase">Success Rate: </span>
                      <span className="text-[10px] font-bold text-green-400">{sp.stats.successRate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredSalespersons.length === 0 && (
            <div className="text-center py-12">
              <FiUser className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No salespersons found matching your search</p>
            </div>
          )}

          {/* Salesperson Details Modal */}
          {showDetailsModal && selectedSalesperson && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${selectedSalesperson.profileColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}>
                        {selectedSalesperson.initials}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedSalesperson.fullName}</h2>
                        <span className="bg-blue-600 text-sm px-3 py-1 rounded-full">
                          Salesperson
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
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Salesperson Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiMail className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="font-medium">{selectedSalesperson.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiPhone className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">Contact</p>
                          <p className="font-medium">{selectedSalesperson.contact}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiMapPin className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="text-sm text-gray-400">Area</p>
                          <p className="font-medium">{selectedSalesperson.area}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiUser className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Manager</p>
                          <p className="font-medium">{selectedSalesperson.manager}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Performance Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-900/30 border border-blue-700/30 p-4 rounded-xl text-center">
                        <FiFileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Created</p>
                        <p className="text-2xl font-bold">{selectedSalesperson.stats.created}</p>
                      </div>
                      <div className="bg-green-900/30 border border-green-700/30 p-4 rounded-xl text-center">
                        <FiCheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Accepted</p>
                        <p className="text-2xl font-bold">{selectedSalesperson.stats.accepted}</p>
                      </div>
                      <div className="bg-red-900/30 border border-red-700/30 p-4 rounded-xl text-center">
                        <FiXCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Rejected</p>
                        <p className="text-2xl font-bold">{selectedSalesperson.stats.rejected}</p>
                      </div>
                      <div className="bg-yellow-900/30 border border-yellow-700/30 p-4 rounded-xl text-center">
                        <FiAward className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Win</p>
                        <p className="text-2xl font-bold">{selectedSalesperson.stats.win}</p>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="mt-6 p-4 bg-gray-750 rounded-xl">
                      <h4 className="font-semibold mb-3 text-gray-300">Performance Metrics</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Acceptance Rate</span>
                            <span className="font-medium">
                              {selectedSalesperson.stats.created > 0 
                                ? ((selectedSalesperson.stats.accepted / selectedSalesperson.stats.created) * 100).toFixed(1)
                                : '0'}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ 
                                width: `${selectedSalesperson.stats.created > 0 
                                  ? (selectedSalesperson.stats.accepted / selectedSalesperson.stats.created) * 100 
                                  : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Win Rate</span>
                            <span className="font-medium">
                              {selectedSalesperson.stats.accepted > 0 
                                ? ((selectedSalesperson.stats.win / selectedSalesperson.stats.accepted) * 100).toFixed(1)
                                : '0'}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ 
                                width: `${selectedSalesperson.stats.accepted > 0 
                                  ? (selectedSalesperson.stats.win / selectedSalesperson.stats.accepted) * 100 
                                  : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-gray-750 p-4 rounded-xl">
                        <p className="text-sm text-gray-400">Join Date</p>
                        <p className="font-medium">{selectedSalesperson.joinDate}</p>
                      </div>
                      <div className="bg-gray-750 p-4 rounded-xl">
                        <p className="text-sm text-gray-400">Last Active</p>
                        <p className="font-medium">{selectedSalesperson.lastActive}</p>
                      </div>
                      <div className="bg-gray-750 p-4 rounded-xl col-span-2">
                        <p className="text-sm text-gray-400">Success Rate</p>
                        <p className="font-medium text-xl text-green-400">{selectedSalesperson.stats.successRate}</p>
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
                    Edit Salesperson
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

export default SalespersonList;