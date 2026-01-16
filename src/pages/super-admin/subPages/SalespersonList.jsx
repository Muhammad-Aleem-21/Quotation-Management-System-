import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminNavbar from "../../../components/SuperAdminNavbar";
import { FiSearch, FiFilter, FiX, FiMail, FiPhone, FiMapPin, FiFileText, FiCheckCircle, FiXCircle, FiAward, FiUser } from 'react-icons/fi';

const SalespersonList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSalesperson, setSelectedSalesperson] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  // Dummy data for salespersons
  const salespersons = [
    {
      id: 'SP-001',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      contact: '+1 (555) 123-4567',
      area: 'North America',
      profileColor: 'bg-blue-500',
      initials: 'JD',
      joinDate: '2023-01-15',
      lastActive: '2024-01-15',
      status: 'active',
      manager: 'Emma Rodriguez',
      stats: {
        created: 45,
        accepted: 32,
        rejected: 8,
        pending: 5,
        win: 28,
        successRate: '87.5%'
      }
    },
    {
      id: 'SP-002',
      fullName: 'Sarah M.',
      email: 'sarah.m@example.com',
      contact: '+1 (555) 234-5678',
      area: 'Europe',
      profileColor: 'bg-purple-500',
      initials: 'SM',
      joinDate: '2023-02-20',
      lastActive: '2024-01-15',
      status: 'active',
      manager: 'Sophia Williams',
      stats: {
        created: 67,
        accepted: 52,
        rejected: 10,
        pending: 5,
        win: 45,
        successRate: '86.5%'
      }
    },
    {
      id: 'SP-003',
      fullName: 'Mike R.',
      email: 'mike.r@example.com',
      contact: '+1 (555) 345-6789',
      area: 'Asia Pacific',
      profileColor: 'bg-green-500',
      initials: 'MR',
      joinDate: '2023-03-10',
      lastActive: '2024-01-14',
      status: 'active',
      manager: 'James Wilson',
      stats: {
        created: 38,
        accepted: 29,
        rejected: 6,
        pending: 3,
        win: 25,
        successRate: '86.2%'
      }
    },
    {
      id: 'SP-004',
      fullName: 'Emily T.',
      email: 'emily.t@example.com',
      contact: '+1 (555) 456-7890',
      area: 'South America',
      profileColor: 'bg-yellow-500',
      initials: 'ET',
      joinDate: '2023-04-05',
      lastActive: '2024-01-15',
      status: 'active',
      manager: 'Emma Rodriguez',
      stats: {
        created: 52,
        accepted: 38,
        rejected: 9,
        pending: 5,
        win: 35,
        successRate: '92.1%'
      }
    },
    {
      id: 'SP-005',
      fullName: 'David L.',
      email: 'david.l@example.com',
      contact: '+1 (555) 567-8901',
      area: 'Middle East',
      profileColor: 'bg-red-500',
      initials: 'DL',
      joinDate: '2023-05-12',
      lastActive: '2024-01-13',
      status: 'active',
      manager: 'Michael Brown',
      stats: {
        created: 29,
        accepted: 22,
        rejected: 5,
        pending: 2,
        win: 20,
        successRate: '90.9%'
      }
    },
    {
      id: 'SP-006',
      fullName: 'Lisa Park',
      email: 'lisa.park@example.com',
      contact: '+1 (555) 678-9012',
      area: 'East Asia',
      profileColor: 'bg-indigo-500',
      initials: 'LP',
      joinDate: '2023-06-18',
      lastActive: '2024-01-15',
      status: 'active',
      manager: 'Sophia Williams',
      stats: {
        created: 41,
        accepted: 34,
        rejected: 4,
        pending: 3,
        win: 30,
        successRate: '88.2%'
      }
    },
    {
      id: 'SP-007',
      fullName: 'Alex Turner',
      email: 'alex.turner@example.com',
      contact: '+1 (555) 789-0123',
      area: 'West Coast',
      profileColor: 'bg-teal-500',
      initials: 'AT',
      joinDate: '2023-07-22',
      lastActive: '2024-01-14',
      status: 'active',
      manager: 'James Wilson',
      stats: {
        created: 33,
        accepted: 26,
        rejected: 5,
        pending: 2,
        win: 24,
        successRate: '92.3%'
      }
    },
    {
      id: 'SP-008',
      fullName: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      contact: '+1 (555) 890-1234',
      area: 'Central Europe',
      profileColor: 'bg-pink-500',
      initials: 'MG',
      joinDate: '2023-08-30',
      lastActive: '2024-01-13',
      status: 'active',
      manager: 'Michael Brown',
      stats: {
        created: 27,
        accepted: 21,
        rejected: 4,
        pending: 2,
        win: 18,
        successRate: '85.7%'
      }
    },
  ];

  const filteredSalespersons = useMemo(() => {
    let result = [...salespersons];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(sp =>
        sp.fullName.toLowerCase().includes(query) ||
        sp.email.toLowerCase().includes(query) ||
        sp.area.toLowerCase().includes(query) ||
        sp.id.toLowerCase().includes(query) ||
        sp.manager.toLowerCase().includes(query)
      );
    }
    
    return result;
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Total Salespersons</p>
              <p className="text-2xl font-bold text-blue-400">{salespersons.length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Total Quotations Created</p>
              <p className="text-2xl font-bold text-green-400">
                {salespersons.reduce((sum, sp) => sum + sp.stats.created, 0)}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Total Wins</p>
              <p className="text-2xl font-bold text-yellow-400">
                {salespersons.reduce((sum, sp) => sum + sp.stats.win, 0)}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Avg Success Rate</p>
              <p className="text-2xl font-bold text-purple-400">
                {(
                  salespersons.reduce((sum, sp) => {
                    const rate = parseFloat(sp.stats.successRate);
                    return sum + rate;
                  }, 0) / salespersons.length
                ).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Salespersons Grid */}
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
                        Salesperson
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{sp.email}</p>
                    <p className="text-gray-500 text-xs mt-1">Manager: {sp.manager}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiPhone className="w-4 h-4" />
                    <span className="text-sm">{sp.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiMapPin className="w-4 h-4" />
                    <span className="text-sm">{sp.area}</span>
                  </div>
                </div>

                {/* Salesperson Stats */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiFileText className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Created</span>
                      </div>
                      <p className="font-bold text-lg">{sp.stats.created}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiCheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-400">Accepted</span>
                      </div>
                      <p className="font-bold text-lg">{sp.stats.accepted}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiXCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-gray-400">Rejected</span>
                      </div>
                      <p className="font-bold text-lg">{sp.stats.rejected}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiAward className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Win</span>
                      </div>
                      <p className="font-bold text-lg">{sp.stats.win}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-xs text-gray-400">Success Rate: </span>
                    <span className="text-xs font-bold text-green-400">{sp.stats.successRate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

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