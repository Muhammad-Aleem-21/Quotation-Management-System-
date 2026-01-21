import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminNavbar from "../../../components/SuperAdminNavbar";
import { FiSearch, FiFilter, FiX, FiUser, FiDollarSign, FiCalendar, FiClock, FiChevronRight, FiAlertCircle } from 'react-icons/fi';

const PendingList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    salesperson: 'all',
    area: 'all',
    daysPending: 'all',
    sortBy: 'daysPending',
    sortOrder: 'desc'
  });
  const navigate = useNavigate();

  // Dummy data for pending quotations
  const pendingQuotations = useMemo(() => [
    {
      id: 'QT-P101',
      customer: 'Retail Chain Stores',
      salesperson: 'John Doe',
      area: 'North America',
      service: 'POS System Upgrade',
      date: '2024-01-10',
      daysPending: 7,
      amount: '$30,000',
      priority: 'high',
      lastFollowUp: '2024-01-14',
      status: 'awaiting_approval',
      description: 'Enterprise POS system with inventory management',
      managerAssigned: 'Emma Rodriguez'
    },
    {
      id: 'QT-P102',
      customer: 'Food Delivery Network',
      salesperson: 'Sarah M.',
      area: 'Europe',
      service: 'Mobile App Development',
      date: '2024-01-09',
      daysPending: 8,
      amount: '$25,000',
      priority: 'high',
      lastFollowUp: '2024-01-15',
      status: 'awaiting_approval',
      description: 'Food delivery app for iOS & Android platforms',
      managerAssigned: 'Sophia Williams'
    },
    {
      id: 'QT-P103',
      customer: 'Smart Home Solutions',
      salesperson: 'Mike R.',
      area: 'Asia Pacific',
      service: 'IoT Integration',
      date: '2024-01-08',
      daysPending: 9,
      amount: '$14,800',
      priority: 'medium',
      lastFollowUp: '2024-01-13',
      status: 'awaiting_approval',
      description: 'Smart home automation system integration',
      managerAssigned: 'James Wilson'
    },
    {
      id: 'QT-P104',
      customer: 'Digital Marketing Agency',
      salesperson: 'Emily T.',
      area: 'South America',
      service: 'SEO Campaign',
      date: '2024-01-12',
      daysPending: 5,
      amount: '$8,000',
      priority: 'low',
      lastFollowUp: '2024-01-14',
      status: 'awaiting_approval',
      description: '6-month SEO optimization campaign',
      managerAssigned: 'Emma Rodriguez'
    },
    {
      id: 'QT-P105',
      customer: 'Cloud Services Inc',
      salesperson: 'David L.',
      area: 'Middle East',
      service: 'Cloud Migration',
      date: '2024-01-11',
      daysPending: 6,
      amount: '$35,000',
      priority: 'high',
      lastFollowUp: '2024-01-15',
      status: 'awaiting_approval',
      description: 'Full infrastructure migration to cloud',
      managerAssigned: 'Michael Brown'
    },
  ], []);

  // Get unique values for filters
  const salespersons = useMemo(() => {
    const unique = [...new Set(pendingQuotations.map(q => q.salesperson))];
    return unique;
  }, [pendingQuotations]);

  const areas = useMemo(() => {
    const unique = [...new Set(pendingQuotations.map(q => q.area))];
    return unique;
  }, [pendingQuotations]);

  const daysOptions = [
    { value: 'all', label: 'All Days' },
    { value: 'overdue', label: 'Overdue (>7 days)' },
    { value: '5-7', label: '5-7 days' },
    { value: '1-4', label: '1-4 days' },
  ];

  // Filter and sort quotations
  const filteredQuotations = useMemo(() => {
    let result = [...pendingQuotations];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(quote =>
        quote.customer.toLowerCase().includes(query) ||
        quote.id.toLowerCase().includes(query) ||
        quote.salesperson.toLowerCase().includes(query) ||
        quote.service.toLowerCase().includes(query) ||
        quote.managerAssigned.toLowerCase().includes(query)
      );
    }
    
    // Apply salesperson filter
    if (filters.salesperson !== 'all') {
      result = result.filter(quote => quote.salesperson === filters.salesperson);
    }
    
    // Apply area filter
    if (filters.area !== 'all') {
      result = result.filter(quote => quote.area === filters.area);
    }
    
    // Apply days pending filter
    if (filters.daysPending !== 'all') {
      switch(filters.daysPending) {
        case 'overdue':
          result = result.filter(quote => quote.daysPending > 7);
          break;
        case '5-7':
          result = result.filter(quote => quote.daysPending >= 5 && quote.daysPending <= 7);
          break;
        case '1-4':
          result = result.filter(quote => quote.daysPending >= 1 && quote.daysPending <= 4);
          break;
      }
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'daysPending':
          comparison = b.daysPending - a.daysPending;
          break;
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
          {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          }
          break;
        default:
          comparison = b.daysPending - a.daysPending;
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [pendingQuotations, searchQuery, filters]);

  const handleQuotationClick = (quotation) => {
    setSelectedQuotation(quotation);
    setShowDetailsModal(true);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
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

  const getDaysColor = (days) => {
    if (days > 7) return 'bg-red-500/20 text-red-300';
    if (days > 5) return 'bg-orange-500/20 text-orange-300';
    if (days > 3) return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-blue-500/20 text-blue-300';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'awaiting_approval':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'under_review':
        return 'bg-blue-500/20 text-blue-300';
      case 'pending_documents':
        return 'bg-orange-500/20 text-orange-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const handleApprove = (id) => {
    if (window.confirm(`Are you sure you want to approve quotation ${id}?`)) {
      alert(`Quotation ${id} has been approved!`);
      // In real app, make API call here
    }
  };

  const handleReject = (id) => {
    if (window.confirm(`Are you sure you want to reject quotation ${id}?`)) {
      alert(`Quotation ${id} has been rejected!`);
      // In real app, make API call here
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
                <h1 className="text-2xl sm:text-3xl font-bold">Pending Quotations</h1>
                <p className="text-gray-400 mt-1">
                    Quotations awaiting approval or follow-up
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


          {/* Search and Filter Bar */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-4 mb-6">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer, quotation ID, or salesperson..."
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
                      {salespersons.map(sp => (
                        <option key={sp} value={sp}>{sp}</option>
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

                  {/* Days Pending Filter */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Days Pending</label>
                    <select
                      value={filters.daysPending}
                      onChange={(e) => setFilters({...filters, daysPending: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      {daysOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
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
                      <option value="daysPending">Days Pending</option>
                      <option value="priority">Priority</option>
                      <option value="date">Date</option>
                      <option value="amount">Amount</option>
                      <option value="salesperson">Salesperson</option>
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
                      <option value="desc">Highest First</option>
                      <option value="asc">Lowest First</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 p-4 rounded-xl border border-yellow-700/30">
              <p className="text-gray-400 text-sm">Total Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{pendingQuotations.length}</p>
            </div>
            <div className="bg-gradient-to-br from-red-900/30 to-rose-900/30 p-4 rounded-xl border border-red-700/30">
              <p className="text-gray-400 text-sm">High Priority</p>
              <p className="text-2xl font-bold text-red-400">
                {pendingQuotations.filter(q => q.priority === 'high').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-4 rounded-xl border border-blue-700/30">
              <p className="text-gray-400 text-sm">Overdue (7 days)</p>
              <p className="text-2xl font-bold text-blue-400">
                {pendingQuotations.filter(q => q.daysPending > 7).length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-4 rounded-xl border border-purple-700/30">
              <p className="text-gray-400 text-sm">Avg. Days Pending</p>
              <p className="text-2xl font-bold text-purple-400">
                {(pendingQuotations.reduce((sum, q) => sum + q.daysPending, 0) / pendingQuotations.length).toFixed(1)}
              </p>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              Showing {filteredQuotations.length} of {pendingQuotations.length} pending quotations
            </p>
            {filteredQuotations.some(q => q.daysPending > 7) && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <FiAlertCircle className="w-4 h-4" />
                <span>Some quotations are overdue!</span>
              </div>
            )}
          </div>

          {/* Quotations Table */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                {/* Desktop Headers */}
                <thead className="bg-gray-700 hidden sm:table-header-group">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Quotation ID</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Customer</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Service</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Salesperson</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Days Pending</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Priority</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm"></th>
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
                      <tr key={`mobile-${quote.id}`} className="sm:hidden border-b border-gray-700 hover:bg-gray-750 transition-colors duration-200">
                        <td colSpan="2" className="p-4">
                          <div 
                            className="space-y-3 cursor-pointer"
                            onClick={() => handleQuotationClick(quote)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-yellow-400">{quote.id}</h3>
                                <h4 className="font-semibold text-white mt-1">{quote.customer}</h4>
                                <p className="text-gray-400 text-sm">{quote.service}</p>
                              </div>
                              <FiChevronRight className="text-gray-400" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Salesperson</p>
                                <p className="text-purple-300 text-sm">{quote.salesperson}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Days Pending</p>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getDaysColor(quote.daysPending)}`}>
                                  {quote.daysPending} days
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Amount</p>
                                <p className="font-bold text-white text-sm">{quote.amount}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Priority</p>
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(quote.priority)}`}>
                                  {quote.priority}
                                </span>
                              </div>
                            </div>
                            
                            <div className="pt-2 flex gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApprove(quote.id);
                                }}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium transition-colors"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReject(quote.id);
                                }}
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
                        <td className="px-6 py-4">
                          <div 
                            className="font-bold text-yellow-400 cursor-pointer hover:text-yellow-300 transition-colors"
                            onClick={() => handleQuotationClick(quote)}
                          >
                            {quote.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div 
                            className="font-semibold text-white cursor-pointer hover:text-blue-300 transition-colors"
                            onClick={() => handleQuotationClick(quote)}
                          >
                            {quote.customer}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{quote.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-400 font-medium text-sm">{quote.service}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiUser className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-300 text-sm">{quote.salesperson}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{quote.area}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiClock className={`w-4 h-4 ${quote.daysPending > 7 ? 'text-red-400' : 'text-yellow-400'}`} />
                            <span className={`px-3 py-1 rounded text-xs font-medium ${getDaysColor(quote.daysPending)}`}>
                              {quote.daysPending} days
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Since: {quote.date}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiDollarSign className="w-4 h-4 text-yellow-400" />
                            <span className="font-bold text-white">{quote.amount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(quote.priority)}`}>
                            {quote.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleApprove(quote.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleQuotationClick(quote)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <FiChevronRight className="w-5 h-5" />
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
                <FiClock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No pending quotations found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : 'No pending quotations in the system.'}
                </p>
              </div>
            )}
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
                  Send Follow-up Reminders
                </button>
              </div>
            </div>
          )}

          {/* Quotation Details Modal */}
          {showDetailsModal && selectedQuotation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-yellow-400">{selectedQuotation.id}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedQuotation.priority)}`}>
                          {selectedQuotation.priority} Priority
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedQuotation.status)}`}>
                          {selectedQuotation.status.replace('_', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded text-xs font-medium ${getDaysColor(selectedQuotation.daysPending)}`}>
                          {selectedQuotation.daysPending} days pending
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
                  {/* Quotation Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Quotation Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-750 rounded-lg">
                        <p className="text-sm text-gray-400">Customer</p>
                        <p className="font-medium text-lg">{selectedQuotation.customer}</p>
                      </div>
                      <div className="p-4 bg-gray-750 rounded-lg">
                        <p className="text-sm text-gray-400">Salesperson</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FiUser className="w-4 h-4 text-purple-400" />
                          <p className="font-medium">{selectedQuotation.salesperson}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{selectedQuotation.area}</p>
                      </div>
                      <div className="p-4 bg-gray-750 rounded-lg">
                        <p className="text-sm text-gray-400">Service</p>
                        <p className="font-medium text-green-400">{selectedQuotation.service}</p>
                      </div>
                      <div className="p-4 bg-gray-750 rounded-lg">
                        <p className="text-sm text-gray-400">Amount</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FiDollarSign className="w-5 h-5 text-yellow-400" />
                          <p className="font-bold text-2xl">{selectedQuotation.amount}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline & Status */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Status & Timeline</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-700/30">
                        <div className="flex items-center gap-3">
                          <FiCalendar className="w-5 h-5 text-yellow-400" />
                          <div>
                            <p className="text-sm text-gray-400">Created Date</p>
                            <p className="font-medium">{selectedQuotation.date}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
                        <div className="flex items-center gap-3">
                          <FiClock className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-sm text-gray-400">Last Follow-up</p>
                            <p className="font-medium">{selectedQuotation.lastFollowUp}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-750 rounded-lg">
                        <p className="text-sm text-gray-400">Manager Assigned</p>
                        <p className="font-medium text-purple-400">{selectedQuotation.managerAssigned}</p>
                      </div>
                      <div className="p-4 bg-gray-750 rounded-lg">
                        <p className="text-sm text-gray-400">Days in Pending</p>
                        <p className={`font-bold text-2xl ${selectedQuotation.daysPending > 7 ? 'text-red-400' : 'text-yellow-400'}`}>
                          {selectedQuotation.daysPending} days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Description</h3>
                    <div className="p-4 bg-gray-750 rounded-lg">
                      <p className="text-gray-300">{selectedQuotation.description}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                      onClick={() => {
                        handleApprove(selectedQuotation.id);
                        setShowDetailsModal(false);
                      }}
                      className="p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
                    >
                      Approve Quotation
                    </button>
                    <button 
                      onClick={() => {
                        handleReject(selectedQuotation.id);
                        setShowDetailsModal(false);
                      }}
                      className="p-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
                    >
                      Reject Quotation
                    </button>
                    <button className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                      Request More Info
                    </button>
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
                    Edit Quotation
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

export default PendingList;