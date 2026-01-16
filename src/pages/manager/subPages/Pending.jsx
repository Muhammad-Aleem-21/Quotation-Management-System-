

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerNavbar from "../../../components/ManagerNavbar";
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const Pending = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    salesperson: 'all',
    priority: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const navigate = useNavigate();

  // Dummy data for pending quotations
  const pendingQuotations = [
    {
      id: 'QT-001',
      salesperson: 'John D.',
      salespersonId: 'SP-001',
      customer: 'TechCorp Solutions',
      email: 'contact@techcorp.com',
      service: 'Website Redesign Project',
      date: '2024-01-15',
      amount: '$15,200',
      submittedDate: '2024-01-15',
      daysPending: 2,
      priority: 'high',
      description: 'Complete website overhaul with new features'
    },
    {
      id: 'QT-002',
      salesperson: 'Sarah M.',
      salespersonId: 'SP-002',
      customer: 'Global Logistics Inc',
      email: 'procurement@globallogistics.com',
      service: 'CRM System Implementation',
      date: '2024-01-14',
      amount: '$8,500',
      submittedDate: '2024-01-14',
      daysPending: 3,
      priority: 'medium',
      description: 'Custom CRM solution for logistics tracking'
    },
    {
      id: 'QT-003',
      salesperson: 'Mike R.',
      salespersonId: 'SP-003',
      customer: 'MediCare Hospital',
      email: 'it@medicarehospital.com',
      service: 'Medical Equipment Supply',
      date: '2024-01-13',
      amount: '$22,000',
      submittedDate: '2024-01-13',
      daysPending: 4,
      priority: 'high',
      description: 'Medical devices and software integration'
    },
    {
      id: 'QT-004',
      salesperson: 'Emily T.',
      salespersonId: 'SP-004',
      customer: 'EduTech Innovations',
      email: 'admin@edutech.com',
      service: 'Learning Management System',
      date: '2024-01-12',
      amount: '$12,500',
      submittedDate: '2024-01-12',
      daysPending: 5,
      priority: 'low',
      description: 'Custom LMS platform with analytics'
    },
    {
      id: 'QT-005',
      salesperson: 'David L.',
      salespersonId: 'SP-005',
      customer: 'Green Energy Corp',
      email: 'sales@greenenergy.com',
      service: 'Solar Panel Installation',
      date: '2024-01-11',
      amount: '$18,300',
      submittedDate: '2024-01-11',
      daysPending: 6,
      priority: 'medium',
      description: 'Commercial solar power system'
    },
    {
      id: 'QT-006',
      salesperson: 'John D.',
      salespersonId: 'SP-001',
      customer: 'Retail Chain Stores',
      email: 'it@retailchain.com',
      service: 'POS System Upgrade',
      date: '2024-01-10',
      amount: '$30,000',
      submittedDate: '2024-01-10',
      daysPending: 7,
      priority: 'high',
      description: 'Enterprise POS system with inventory'
    },
    {
      id: 'QT-007',
      salesperson: 'Sarah M.',
      salespersonId: 'SP-002',
      customer: 'Food Delivery Network',
      email: 'tech@foodnetwork.com',
      service: 'Mobile App Development',
      date: '2024-01-09',
      amount: '$25,000',
      submittedDate: '2024-01-09',
      daysPending: 8,
      priority: 'high',
      description: 'Food delivery app for iOS & Android'
    },
    {
      id: 'QT-008',
      salesperson: 'Mike R.',
      salespersonId: 'SP-003',
      customer: 'Smart Home Solutions',
      email: 'info@smarthome.com',
      service: 'IoT Integration',
      date: '2024-01-08',
      amount: '$14,800',
      submittedDate: '2024-01-08',
      daysPending: 9,
      priority: 'medium',
      description: 'Smart home automation system'
    },
  ];

  // Get unique salespersons for filter
  const salespersons = useMemo(() => {
    const unique = [...new Set(pendingQuotations.map(q => q.salesperson))];
    return unique.map(name => ({
      value: name,
      label: name
    }));
  }, [pendingQuotations]);

  // Filter and sort quotations
  const filteredQuotations = useMemo(() => {
    let result = [...pendingQuotations];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(quote =>
        quote.customer.toLowerCase().includes(query) ||
        quote.id.toLowerCase().includes(query) ||
        quote.service.toLowerCase().includes(query) ||
        quote.salesperson.toLowerCase().includes(query) ||
        quote.description.toLowerCase().includes(query)
      );
    }
    
    // Apply salesperson filter
    if (filters.salesperson !== 'all') {
      result = result.filter(quote => quote.salesperson === filters.salesperson);
    }
    
    // Apply priority filter
    if (filters.priority !== 'all') {
      result = result.filter(quote => quote.priority === filters.priority);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(b.date) - new Date(a.date);
          break;
        case 'amount':
          comparison = parseFloat(b.amount.replace('$', '').replace(',', '')) - 
                     parseFloat(a.amount.replace('$', '').replace(',', ''));
          break;
        case 'salesperson':
          comparison = a.salesperson.localeCompare(b.salesperson);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'daysPending':
          comparison = b.daysPending - a.daysPending;
          break;
        default:
          comparison = new Date(b.date) - new Date(a.date);
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [pendingQuotations, searchQuery, filters]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getDaysPendingColor = (days) => {
    if (days > 7) return 'bg-red-500/20 text-red-300';
    if (days > 5) return 'bg-orange-500/20 text-orange-300';
    if (days > 3) return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-blue-500/20 text-blue-300';
  };

  // Priority options for filter
  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'salesperson', label: 'Salesperson' },
    { value: 'priority', label: 'Priority' },
    { value: 'daysPending', label: 'Days Pending' }
  ];

  // Handle approve action
  const handleApprove = (id) => {
    if (window.confirm(`Are you sure you want to approve quotation ${id}?`)) {
      alert(`Quotation ${id} has been approved!`);
      // In real app, make API call here
    }
  };

  // Handle reject action
  const handleReject = (id) => {
    if (window.confirm(`Are you sure you want to reject quotation ${id}?`)) {
      alert(`Quotation ${id} has been rejected!`);
      // In real app, make API call here
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      salesperson: 'all',
      priority: 'all',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  // Check if any filter is active
  const hasActiveFilters = searchQuery || filters.salesperson !== 'all' || filters.priority !== 'all' || filters.sortBy !== 'date';

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <ManagerNavbar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 lg:ml-64 lg:-mt-135 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
        {/* Mobile Top Bar Spacer */}
        <div className="h-16 lg:h-0"></div>
        
        {/* Content Container */}
        <div className={`p-4 sm:p-6 lg:pt-0 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
          
          <div className={`p-4 sm:p-6 lg:pt-0 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
                
                {/* Left Text */}
                <div className="mb-6 lg:mb-2">
                  <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold">Pending Approvals</h1>
                  <p className="text-gray-400 mt-1 text-sm sm:text-base lg:text-sm">Quotations awaiting manager approval</p>
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
                  placeholder="Search by customer, quotation ID, service, or salesperson..."
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
                  {/* Salesperson Filter */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Salesperson</label>
                    <select
                      value={filters.salesperson}
                      onChange={(e) => setFilters({...filters, salesperson: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">All Salespersons</option>
                      {salespersons.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Priority</label>
                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters({...filters, priority: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      {priorityOptions.map(option => (
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
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
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
                  
                  {filters.salesperson !== 'all' && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                      Salesperson: {filters.salesperson}
                      <button
                        onClick={() => setFilters({...filters, salesperson: 'all'})}
                        className="ml-2 text-purple-200 hover:text-white"
                      >
                        <FiX className="inline text-xs" />
                      </button>
                    </span>
                  )}
                  
                  {filters.priority !== 'all' && (
                    <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs">
                      Priority: {filters.priority}
                      <button
                        onClick={() => setFilters({...filters, priority: 'all'})}
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
              Showing {filteredQuotations.length} of {pendingQuotations.length} pending quotations
            </p>
            <div className="text-sm text-gray-400">
              {searchQuery && `Found ${filteredQuotations.length} results`}
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
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Service</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Salesperson</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Priority</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Days Pending</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Actions</th>
                  </tr>
                </thead>
                
                {/* Mobile Headers */}
                <thead className="bg-gray-700 sm:hidden">
                  <tr>
                    <th colSpan="2" className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Pending Quotations ({filteredQuotations.length})
                    </th>
                  </tr>
                </thead>
                
                <tbody>
                  {filteredQuotations.map((quote) => (
                    <>
                      {/* Mobile View - Card Layout */}
                      <tr key={`mobile-${quote.id}`} className="sm:hidden border-b border-gray-700">
                        <td colSpan="2" className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-blue-400">{quote.id}</span>
                                <h3 className="font-semibold text-white mt-1">{quote.customer}</h3>
                                <p className="text-gray-400 text-sm">{quote.email}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(quote.priority)}`}>
                                {quote.priority.charAt(0).toUpperCase() + quote.priority.slice(1)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Service</p>
                                <p className="text-green-400 text-sm">{quote.service}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Amount</p>
                                <p className="font-bold text-white text-sm">{quote.amount}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Salesperson</p>
                                <p className="text-purple-300 text-sm font-medium">{quote.salesperson}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Submitted</p>
                                <p className="text-gray-300 text-sm">{quote.submittedDate}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Description</p>
                                <p className="text-gray-300 text-xs mt-1">{quote.description}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Days Pending</p>
                                <p className={`px-2 py-1 rounded text-xs mt-1 ${getDaysPendingColor(quote.daysPending)}`}>
                                  {quote.daysPending} days
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 pt-2">
                              <button 
                                onClick={() => navigate(`/quotation/${quote.id}`)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition-colors"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => handleApprove(quote.id)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium transition-colors"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleReject(quote.id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-medium transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Desktop/Tablet View - Table Layout */}
                      <tr key={`desktop-${quote.id}`} className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-4 py-3">
                          <span className="font-bold text-blue-400 text-sm">{quote.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white text-sm">{quote.customer}</div>
                          <div className="text-xs text-gray-400">{quote.email}</div>
                          <div className="text-xs text-gray-500 mt-1">{quote.description}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-green-400 font-medium text-sm">{quote.service}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-purple-300 text-sm">{quote.salesperson}</div>
                          <div className="text-xs text-gray-400">{quote.salespersonId}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-sm">{quote.date}</td>
                        <td className="px-4 py-3 font-bold text-white text-sm">{quote.amount}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(quote.priority)}`}>
                            {quote.priority.charAt(0).toUpperCase() + quote.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${getDaysPendingColor(quote.daysPending)}`}>
                            {quote.daysPending} days
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => navigate(`/quotation/${quote.id}`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => handleApprove(quote.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReject(quote.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredQuotations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-3xl mb-4">📄</div>
                <p className="text-gray-400">No pending quotations found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : 'No quotations require approval at this time.'}
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

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="text-gray-400 text-sm">Total Pending</div>
              <div className="text-2xl font-bold text-yellow-400">{pendingQuotations.length}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="text-gray-400 text-sm">High Priority</div>
              <div className="text-2xl font-bold text-red-400">
                {pendingQuotations.filter(q => q.priority === 'high').length}
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="text-gray-400 text-sm">Average Days Pending</div>
              <div className="text-2xl font-bold text-blue-400">
                {(pendingQuotations.reduce((sum, q) => sum + q.daysPending, 0) / pendingQuotations.length).toFixed(1)}
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {filteredQuotations.length > 0 && (
            <div className="mt-6 bg-gray-800 p-4 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-3">Bulk Actions</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
                  Approve All Filtered ({filteredQuotations.length})
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
                  Reject All Filtered ({filteredQuotations.length})
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                  Download CSV Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pending;