import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminNavbar from "../../../components/SuperAdminNavbar";
import { FiSearch, FiFilter, FiX, FiMail, FiPhone, FiMapPin, FiFileText, FiCheckCircle, FiXCircle, FiAward, FiUser } from 'react-icons/fi';

const AdminList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  // Dummy data for admins
  const admins = [
    {
      id: 'ADM-001',
      fullName: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      contact: '+1 (555) 234-5678',
      area: 'Europe',
      profileColor: 'bg-purple-500',
      initials: 'SW',
      joinDate: '2023-03-15',
      lastActive: '2024-01-15',
      status: 'active',
      stats: {
        totalQuotations: 125,
        accepted: 85,
        rejected: 32,
        pending: 8,
        avgResponseTime: '2.5 hours'
      }
    },
    {
      id: 'ADM-002',
      fullName: 'David Miller',
      email: 'david.miller@example.com',
      contact: '+1 (555) 789-0123',
      area: 'Central Europe',
      profileColor: 'bg-pink-500',
      initials: 'DM',
      joinDate: '2023-05-20',
      lastActive: '2024-01-14',
      status: 'active',
      stats: {
        totalQuotations: 167,
        accepted: 120,
        rejected: 40,
        pending: 7,
        avgResponseTime: '1.8 hours'
      }
    },
    {
      id: 'ADM-003',
      fullName: 'Robert Chen',
      email: 'robert.chen@example.com',
      contact: '+1 (555) 345-6789',
      area: 'Asia Pacific',
      profileColor: 'bg-blue-500',
      initials: 'RC',
      joinDate: '2023-08-10',
      lastActive: '2024-01-15',
      status: 'active',
      stats: {
        totalQuotations: 89,
        accepted: 65,
        rejected: 18,
        pending: 6,
        avgResponseTime: '3.2 hours'
      }
    },
    {
      id: 'ADM-004',
      fullName: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      contact: '+1 (555) 456-7890',
      area: 'North America',
      profileColor: 'bg-teal-500',
      initials: 'LA',
      joinDate: '2023-11-05',
      lastActive: '2024-01-13',
      status: 'active',
      stats: {
        totalQuotations: 42,
        accepted: 32,
        rejected: 8,
        pending: 2,
        avgResponseTime: '4.1 hours'
      }
    },
  ];

  const filteredAdmins = useMemo(() => {
    let result = [...admins];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(admin =>
        admin.fullName.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query) ||
        admin.area.toLowerCase().includes(query) ||
        admin.id.toLowerCase().includes(query)
      );
    }
    
    return result;
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Total Admins</p>
              <p className="text-2xl font-bold text-purple-400">{admins.length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Active Now</p>
              <p className="text-2xl font-bold text-green-400">{admins.filter(a => a.status === 'active').length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Total Quotations</p>
              <p className="text-2xl font-bold text-blue-400">
                {admins.reduce((sum, admin) => sum + admin.stats.totalQuotations, 0)}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Avg Response Time</p>
              <p className="text-2xl font-bold text-yellow-400">
                {(
                  admins.reduce((sum, admin) => {
                    const time = parseFloat(admin.stats.avgResponseTime.split(' ')[0]);
                    return sum + time;
                  }, 0) / admins.length
                ).toFixed(1)}h
              </p>
            </div>
          </div>

          {/* Admins Grid */}
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
                    <p className="text-gray-400 text-sm mt-1">{admin.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiPhone className="w-4 h-4" />
                    <span className="text-sm">{admin.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiMapPin className="w-4 h-4" />
                    <span className="text-sm">{admin.area}</span>
                  </div>
                </div>

                {/* Admin Stats */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiFileText className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Total</span>
                      </div>
                      <p className="font-bold text-lg">{admin.stats.totalQuotations}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiCheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-400">Accepted</span>
                      </div>
                      <p className="font-bold text-lg">{admin.stats.accepted}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiXCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-gray-400">Rejected</span>
                      </div>
                      <p className="font-bold text-lg">{admin.stats.rejected}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiAward className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Response</span>
                      </div>
                      <p className="font-bold text-lg text-sm">{admin.stats.avgResponseTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
                          <p className="text-sm text-gray-400">Admin ID</p>
                          <p className="font-medium">{selectedAdmin.id}</p>
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