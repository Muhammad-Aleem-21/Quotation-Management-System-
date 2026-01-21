import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerNavbar from "../../../components/ManagerNavbar";
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const ActiveMembers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    performance: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const navigate = useNavigate();

  // Dummy data for active sales team members
  const activeMembers = useMemo(() => [
    {
      id: 'SP-001',
      name: 'John Smith',
      email: 'john@email.com',
      joinDate: '2023-01-15',
      lastActive: '2024-01-20',
      totalQuotations: 24,
      approvedQuotations: 18,
      pendingQuotations: 3,
      rejectedQuotations: 3,
      performance: 'Excellent'
    },
    {
      id: 'SP-002',
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      joinDate: '2023-03-10',
      lastActive: '2024-01-19',
      totalQuotations: 18,
      approvedQuotations: 12,
      pendingQuotations: 4,
      rejectedQuotations: 2,
      performance: 'Good'
    },
    {
      id: 'SP-003',
      name: 'Michael Brown',
      email: 'michael@email.com',
      joinDate: '2023-05-22',
      lastActive: '2024-01-20',
      totalQuotations: 15,
      approvedQuotations: 10,
      pendingQuotations: 3,
      rejectedQuotations: 2,
      performance: 'Good'
    },
    {
      id: 'SP-004',
      name: 'Emily Davis',
      email: 'emily@email.com',
      joinDate: '2023-08-05',
      lastActive: '2024-01-18',
      totalQuotations: 12,
      approvedQuotations: 8,
      pendingQuotations: 2,
      rejectedQuotations: 2,
      performance: 'Average'
    },
    {
      id: 'SP-005',
      name: 'Robert Wilson',
      email: 'robert@email.com',
      joinDate: '2023-11-30',
      lastActive: '2024-01-20',
      totalQuotations: 8,
      approvedQuotations: 5,
      pendingQuotations: 2,
      rejectedQuotations: 1,
      performance: 'Average'
    },
  ], []);

  // Filter and sort members based on search and filters
  const filteredMembers = useMemo(() => {
    let result = [...activeMembers];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(member =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.id.toLowerCase().includes(query)
      );
    }
    
    // Apply performance filter
    if (filters.performance !== 'all') {
      result = result.filter(member => member.performance === filters.performance);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'quotations':
          comparison = b.totalQuotations - a.totalQuotations;
          break;
        case 'approved':
          comparison = b.approvedQuotations - a.approvedQuotations;
          break;
        case 'joinDate':
          comparison = new Date(b.joinDate) - new Date(a.joinDate);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [activeMembers, searchQuery, filters]);

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Excellent':
        return 'bg-green-500/20 text-green-300';
      case 'Good':
        return 'bg-blue-500/20 text-blue-300';
      case 'Average':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'Poor':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  // Performance options for filter
  const performanceOptions = [
    { value: 'all', label: 'All Performance' },
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Average', label: 'Average' },
    { value: 'Poor', label: 'Poor' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'quotations', label: 'Total Quotations' },
    { value: 'approved', label: 'Approved Quotations' },
    { value: 'joinDate', label: 'Join Date' }
  ];

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      performance: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  // Check if any filter is active
  const hasActiveFilters = searchQuery || filters.performance !== 'all' || filters.sortBy !== 'name';

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <ManagerNavbar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content - Fixed desktop spacing */}
      <div className={`transition-all duration-300 lg:ml-64 lg:-mt-135 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
        {/* Mobile Top Bar Spacer */}
        <div className="h-16 lg:h-0"></div>
        
        {/* Content Container */}
        <div className={`p-4 sm:p-6 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
          
          <div className={`p-4 sm:p-6 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
                
                {/* Left Text */}
                <div className="mb-6 lg:mb-2">
                  <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold">Active Team Members</h1>
                  <p className="text-gray-400 mt-1 text-sm sm:text-base lg:text-sm">List of active sales team members</p>
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
                  placeholder="Search by name, email, or ID..."
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
                  {/* Performance Filter */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Performance</label>
                    <select
                      value={filters.performance}
                      onChange={(e) => setFilters({...filters, performance: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      {performanceOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
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
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
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

                {/* Filter Actions */}
                <div className="flex items-end gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <FiX className="text-xs" />
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <FiFilter className="text-xs" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>
              </div>

              {/* Active Filters Badge */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-700">
                  <span className="text-xs text-gray-400">Active filters:</span>
                  
                  {searchQuery && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                      Search: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-2 text-blue-200 hover:text-white"
                      >
                        <FiX className="inline text-xs" />
                      </button>
                    </span>
                  )}
                  
                  {filters.performance !== 'all' && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                      Performance: {filters.performance}
                      <button
                        onClick={() => setFilters({...filters, performance: 'all'})}
                        className="ml-2 text-purple-200 hover:text-white"
                      >
                        <FiX className="inline text-xs" />
                      </button>
                    </span>
                  )}
                  
                  {filters.sortBy !== 'name' && (
                    <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs">
                      Sorted by: {sortOptions.find(o => o.value === filters.sortBy)?.label} ({filters.sortOrder})
                      <button
                        onClick={() => setFilters({...filters, sortBy: 'name', sortOrder: 'asc'})}
                        className="ml-2 text-teal-200 hover:text-white"
                      >
                        <FiX className="inline text-xs" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              Showing {filteredMembers.length} of {activeMembers.length} active team members
            </p>
            <div className="text-sm text-gray-400">
              {searchQuery && `Found ${filteredMembers.length} results`}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                {/* Desktop Headers */}
                <thead className="bg-gray-700 hidden sm:table-header-group">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Member</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Join Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Last Active</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Total Quotations</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Approved</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Performance</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Actions</th>
                  </tr>
                </thead>
                
                {/* Mobile Headers */}
                <thead className="bg-gray-700 sm:hidden">
                  <tr>
                    <th colSpan="2" className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Active Team Members ({filteredMembers.length})
                    </th>
                  </tr>
                </thead>
                
                <tbody>
                  {filteredMembers.map((member) => (
                    <>
                      {/* Mobile View - Card Layout */}
                      <tr key={`mobile-${member.id}`} className="sm:hidden border-b border-gray-700">
                        <td colSpan="2" className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-blue-400">{member.id}</span>
                                <h3 className="font-semibold text-white mt-1">{member.name}</h3>
                                <p className="text-gray-400 text-sm">{member.email}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPerformanceColor(member.performance)}`}>
                                {member.performance}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Join Date</p>
                                <p className="text-gray-300 text-sm">{member.joinDate}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Last Active</p>
                                <p className="text-green-300 text-sm font-medium">{member.lastActive}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2">
                              <div className="text-center">
                                <p className="text-gray-400 text-xs">Total</p>
                                <p className="font-bold text-white text-sm">{member.totalQuotations}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-400 text-xs">Approved</p>
                                <p className="text-green-400 text-sm font-bold">{member.approvedQuotations}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-400 text-xs">Pending</p>
                                <p className="text-yellow-400 text-sm font-bold">{member.pendingQuotations}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-400 text-xs">Rejected</p>
                                <p className="text-red-400 text-sm font-bold">{member.rejectedQuotations}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 pt-2">
                              <button 
                                onClick={() => navigate(`/member/${member.id}`)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition-colors"
                              >
                                Profile
                              </button>
                              <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded text-sm font-medium transition-colors">
                                Performance
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Desktop/Tablet View - Table Layout */}
                      <tr key={`desktop-${member.id}`} className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-4 py-3">
                          <span className="font-bold text-blue-400 text-sm">{member.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white text-sm">{member.name}</div>
                          <div className="text-xs text-gray-400">{member.email}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-sm">{member.joinDate}</td>
                        <td className="px-4 py-3 text-green-300 text-sm font-medium">{member.lastActive}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-white text-sm">{member.totalQuotations}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-green-400 font-bold text-sm">{member.approvedQuotations}</span>
                            <div className="flex gap-1 mt-1">
                              <span className="text-xs text-yellow-400">P: {member.pendingQuotations}</span>
                              <span className="text-xs text-red-400">R: {member.rejectedQuotations}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPerformanceColor(member.performance)}`}>
                            {member.performance}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => navigate(`/member/${member.id}`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Profile
                            </button>
                            <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                              Performance
                            </button>
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-3xl mb-4">🔍</div>
                <p className="text-gray-400">No members found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : 'No active team members match your filters.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
            <p className="text-gray-400 text-sm">
              Showing {filteredMembers.length} active team members
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm">
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveMembers;