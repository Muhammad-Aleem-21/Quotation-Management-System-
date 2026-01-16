import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminNavbar from "../../../components/SuperAdminNavbar";
import { FiSearch, FiFilter, FiX, FiMail, FiPhone, FiMapPin, FiFileText, FiCheckCircle, FiXCircle, FiUsers, FiUser } from 'react-icons/fi';

const ManagerList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedManager, setSelectedManager] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  // Dummy data for managers
  const managers = [
    {
      id: 'MGR-001',
      fullName: 'Emma Rodriguez',
      email: 'emma.rodriguez@example.com',
      contact: '+1 (555) 456-7890',
      area: 'South America',
      profileColor: 'bg-yellow-500',
      initials: 'ER',
      joinDate: '2023-02-10',
      lastActive: '2024-01-15',
      status: 'active',
      teamSize: 8,
      stats: {
        totalQuotations: 94,
        accepted: 65,
        rejected: 22,
        pending: 7,
        avgResponseTime: '3.2 hours'
      }
    },
    {
      id: 'MGR-002',
      fullName: 'Sophia Williams',
      email: 'sophia.williams@example.com',
      contact: '+1 (555) 890-1234',
      area: 'West Coast',
      profileColor: 'bg-teal-500',
      initials: 'SW',
      joinDate: '2023-04-22',
      lastActive: '2024-01-14',
      status: 'active',
      teamSize: 12,
      stats: {
        totalQuotations: 156,
        accepted: 112,
        rejected: 38,
        pending: 6,
        avgResponseTime: '2.8 hours'
      }
    },
    {
      id: 'MGR-003',
      fullName: 'James Wilson',
      email: 'james.wilson@example.com',
      contact: '+1 (555) 123-4567',
      area: 'North America',
      profileColor: 'bg-orange-500',
      initials: 'JW',
      joinDate: '2023-07-15',
      lastActive: '2024-01-15',
      status: 'active',
      teamSize: 6,
      stats: {
        totalQuotations: 72,
        accepted: 52,
        rejected: 15,
        pending: 5,
        avgResponseTime: '4.5 hours'
      }
    },
    {
      id: 'MGR-004',
      fullName: 'Michael Brown',
      email: 'michael.brown@example.com',
      contact: '+1 (555) 234-5678',
      area: 'Europe',
      profileColor: 'bg-indigo-500',
      initials: 'MB',
      joinDate: '2023-09-30',
      lastActive: '2024-01-13',
      status: 'active',
      teamSize: 10,
      stats: {
        totalQuotations: 118,
        accepted: 85,
        rejected: 28,
        pending: 5,
        avgResponseTime: '3.8 hours'
      }
    },
  ];

  const filteredManagers = useMemo(() => {
    let result = [...managers];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(manager =>
        manager.fullName.toLowerCase().includes(query) ||
        manager.email.toLowerCase().includes(query) ||
        manager.area.toLowerCase().includes(query) ||
        manager.id.toLowerCase().includes(query)
      );
    }
    
    return result;
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Total Managers</p>
              <p className="text-2xl font-bold text-yellow-400">{managers.length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Total Team Size</p>
              <p className="text-2xl font-bold text-green-400">
                {managers.reduce((sum, manager) => sum + manager.teamSize, 0)}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Total Quotations</p>
              <p className="text-2xl font-bold text-blue-400">
                {managers.reduce((sum, manager) => sum + manager.stats.totalQuotations, 0)}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Avg Response Time</p>
              <p className="text-2xl font-bold text-purple-400">
                {(
                  managers.reduce((sum, manager) => {
                    const time = parseFloat(manager.stats.avgResponseTime.split(' ')[0]);
                    return sum + time;
                  }, 0) / managers.length
                ).toFixed(1)}h
              </p>
            </div>
          </div>

          {/* Managers Grid */}
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
                    <p className="text-gray-400 text-sm mt-1">{manager.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiPhone className="w-4 h-4" />
                    <span className="text-sm">{manager.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiMapPin className="w-4 h-4" />
                    <span className="text-sm">{manager.area}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiUsers className="w-4 h-4" />
                    <span className="text-sm">{manager.teamSize} team members</span>
                  </div>
                </div>

                {/* Manager Stats */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiFileText className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Total</span>
                      </div>
                      <p className="font-bold text-lg">{manager.stats.totalQuotations}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiCheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-400">Accepted</span>
                      </div>
                      <p className="font-bold text-lg">{manager.stats.accepted}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiXCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-gray-400">Rejected</span>
                      </div>
                      <p className="font-bold text-lg">{manager.stats.rejected}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiUser className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Pending</span>
                      </div>
                      <p className="font-bold text-lg">{manager.stats.pending}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

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