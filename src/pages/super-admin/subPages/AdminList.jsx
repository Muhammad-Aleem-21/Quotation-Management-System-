import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { getMyTeam } from "../../../api/api";
import SuperAdminNavbar from "../../../components/SuperAdminNavbar";
import { FiSearch, FiFilter, FiX, FiMail, FiPhone, FiMapPin, FiFileText, FiCheckCircle, FiXCircle, FiAward, FiUser } from 'react-icons/fi';

const AdminList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyTeam('admin');
      
      const teamData = response.data.team || {};
      const allUsers = teamData.admins || response.data.users || response.data || [];
      
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

      // Filter and transform for Admins
      const adminUsers = usersArray
        .filter(user => {
          if (!user) return false;
          const role = user.role || (user.roles && user.roles[0]?.name) || (user.roles && user.roles[0]) || '';
          return role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator' || !role; // Fallback if role is missing but it's in the admins list
        })
        .map(user => {
          const roleName = 'Admin';
          const profile = user.profile || {};
          
          return {
            ...user,
            fullName: user.name || user.fullName || 'N/A',
            role: roleName,
            creatorName: 'Super Admin', // Admins always report to Super Admin
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
                totalQuotations: user.quotations_count || 0,
                accepted: user.accepted_quotations_count || 0,
                rejected: user.rejected_quotations_count || 0,
                pending: user.pending_quotations_count || 0,
                avgResponseTime: user.avg_response_time || 'N/A'
            }
          };
        });

      setAdmins(adminUsers);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Failed to load admins list. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = useMemo(() => {
    if (!searchQuery) return admins;
    
    const query = searchQuery.toLowerCase();
    return admins.filter(admin =>
      admin.fullName.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query) ||
      admin.area.toLowerCase().includes(query) ||
      admin.id.toString().toLowerCase().includes(query)
    );
  }, [admins, searchQuery]);

  const handleAdminClick = (admin) => {
    setSelectedAdmin(admin);
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
                <h1 className="text-2xl sm:text-3xl font-bold">Admin Managment</h1>
                <p className="text-gray-400 mt-1">
                    Manage system administrators
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


          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search admins by name, email, or area..."
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
                <p className="text-gray-400 text-sm">Total Admins</p>
                <p className="text-2xl font-bold text-purple-400">{admins.length}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Active Now</p>
                <p className="text-2xl font-bold text-green-400">{admins.length}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Total Quotations</p>
                <p className="text-2xl font-bold text-blue-400">
                  {admins.reduce((sum, admin) => sum + admin.stats.totalQuotations, 0)}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Avg Acceptance</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {admins.length > 0 
                    ? (admins.reduce((sum, admin) => {
                        const rate = admin.stats.totalQuotations > 0 
                          ? (admin.stats.accepted / admin.stats.totalQuotations) * 100 
                          : 0;
                        return sum + rate;
                      }, 0) / admins.length).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Fetching administrators...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center mb-6">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={fetchAdmins}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Admins Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAdmins.map((admin) => (
                <div 
                  key={admin.id}
                  onClick={() => handleAdminClick(admin)}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-4 cursor-pointer hover:border-purple-500 hover:scale-[1.02] transition-all duration-200"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`${admin.profileColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}>
                      {admin.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{admin.fullName}</h3>
                        <span className="bg-purple-600 text-xs px-2 py-1 rounded-full">
                          Admin
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1 truncate max-w-[150px]">{admin.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiPhone className="w-4 h-4" />
                      <span className="text-sm">{admin.contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiMapPin className="w-4 h-4" />
                      <span className="text-sm truncate">{admin.area}</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-400/80">
                      <FiUser className="w-4 h-4" />
                      <span className="text-xs font-medium">Reports To: {admin.creatorName}</span>
                    </div>
                  </div>

                  {/* Admin Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-gray-900/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <FiFileText className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] text-gray-400 uppercase">Quotations</span>
                        </div>
                        <p className="font-bold text-lg">{admin.stats.totalQuotations}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-900/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <FiCheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-[10px] text-gray-400 uppercase">Accepted</span>
                        </div>
                        <p className="font-bold text-lg">{admin.stats.accepted}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                       <span className="text-[10px] text-gray-500 uppercase">Avg Response: </span>
                       <span className="text-[10px] font-bold text-yellow-400">{admin.stats.avgResponseTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredAdmins.length === 0 && (
            <div className="text-center py-12">
              <FiUser className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No admins found matching your search</p>
            </div>
          )}

          {/* Admin Details Modal */}
          {showDetailsModal && selectedAdmin && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${selectedAdmin.profileColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}>
                        {selectedAdmin.initials}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedAdmin.fullName}</h2>
                        <span className="bg-purple-600 text-sm px-3 py-1 rounded-full">
                          System Admin
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
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Admin Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiMail className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="font-medium">{selectedAdmin.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiPhone className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">Contact</p>
                          <p className="font-medium">{selectedAdmin.contact}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiMapPin className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="text-sm text-gray-400">Area</p>
                          <p className="font-medium">{selectedAdmin.area}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiUser className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Reports To</p>
                          <p className="font-medium text-purple-300">{selectedAdmin.creatorName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <FiUser className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Admin ID</p>
                          <p className="font-medium text-blue-300">{selectedAdmin.id}</p>
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
                        <p className="text-2xl font-bold">{selectedAdmin.stats.totalQuotations}</p>
                      </div>
                      <div className="bg-green-900/30 border border-green-700/30 p-4 rounded-xl text-center">
                        <FiCheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Accepted</p>
                        <p className="text-2xl font-bold">{selectedAdmin.stats.accepted}</p>
                      </div>
                      <div className="bg-red-900/30 border border-red-700/30 p-4 rounded-xl text-center">
                        <FiXCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Rejected</p>
                        <p className="text-2xl font-bold">{selectedAdmin.stats.rejected}</p>
                      </div>
                      <div className="bg-yellow-900/30 border border-yellow-700/30 p-4 rounded-xl text-center">
                        <FiAward className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Avg Response</p>
                        <p className="text-2xl font-bold">{selectedAdmin.stats.avgResponseTime}</p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-gray-750 p-4 rounded-xl">
                        <p className="text-sm text-gray-400">Join Date</p>
                        <p className="font-medium">{selectedAdmin.joinDate}</p>
                      </div>
                      <div className="bg-gray-750 p-4 rounded-xl">
                        <p className="text-sm text-gray-400">Last Active</p>
                        <p className="font-medium">{selectedAdmin.lastActive}</p>
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
                    Edit Admin
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

export default AdminList;