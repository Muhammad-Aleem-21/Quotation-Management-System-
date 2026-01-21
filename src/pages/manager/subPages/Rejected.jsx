import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerNavbar from "../../../components/ManagerNavbar";
import { FiSearch, FiX, FiDownload } from 'react-icons/fi';

const Rejected = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    salesperson: 'all',
    reason: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const navigate = useNavigate();

  // Dummy data for rejected quotations
  const rejectedQuotations = useMemo(() => [
    {
      id: 'QT-101',
      salesperson: 'John D.',
      salespersonId: 'SP-001',
      customer: 'TechCorp Solutions',
      email: 'contact@techcorp.com',
      service: 'Website Redesign Project',
      date: '2024-01-20',
      rejectedDate: '2024-01-21',
      amount: '$15,200',
      rejectedBy: 'Manager A',
      reason: 'Budget too high',
      description: 'Client budget constraints, quoted amount exceeded their limit',
      daysAgo: 5
    },
    {
      id: 'QT-102',
      salesperson: 'Sarah M.',
      salespersonId: 'SP-002',
      customer: 'Global Logistics Inc',
      email: 'procurement@globallogistics.com',
      service: 'CRM System Implementation',
      date: '2024-01-18',
      rejectedDate: '2024-01-19',
      amount: '$8,500',
      rejectedBy: 'Manager B',
      reason: 'Requirements mismatch',
      description: 'Our solution did not meet specific client requirements',
      daysAgo: 7
    },
    {
      id: 'QT-103',
      salesperson: 'Mike R.',
      salespersonId: 'SP-003',
      customer: 'MediCare Hospital',
      email: 'it@medicarehospital.com',
      service: 'Medical Equipment Supply',
      date: '2024-01-15',
      rejectedDate: '2024-01-16',
      amount: '$22,000',
      rejectedBy: 'Manager A',
      reason: 'Technical limitations',
      description: 'Unable to meet specific technical specifications',
      daysAgo: 10
    },
    {
      id: 'QT-104',
      salesperson: 'Emily T.',
      salespersonId: 'SP-004',
      customer: 'EduTech Innovations',
      email: 'admin@edutech.com',
      service: 'Learning Management System',
      date: '2024-01-12',
      rejectedDate: '2024-01-13',
      amount: '$12,500',
      rejectedBy: 'Manager C',
      reason: 'Budget too high',
      description: 'Client found alternative provider at lower cost',
      daysAgo: 13
    },
    {
      id: 'QT-105',
      salesperson: 'David L.',
      salespersonId: 'SP-005',
      customer: 'Green Energy Corp',
      email: 'sales@greenenergy.com',
      service: 'Solar Panel Installation',
      date: '2024-01-10',
      rejectedDate: '2024-01-11',
      amount: '$18,300',
      rejectedBy: 'Manager A',
      reason: 'Scope too limited',
      description: 'Client wanted additional features not included in quote',
      daysAgo: 15
    },
    {
      id: 'QT-106',
      salesperson: 'John D.',
      salespersonId: 'SP-001',
      customer: 'Retail Chain Stores',
      email: 'it@retailchain.com',
      service: 'POS System Upgrade',
      date: '2024-01-08',
      rejectedDate: '2024-01-09',
      amount: '$30,000',
      rejectedBy: 'Manager B',
      reason: 'Timeline issues',
      description: 'Unable to meet client required delivery timeline',
      daysAgo: 17
    },
    {
      id: 'QT-107',
      salesperson: 'Sarah M.',
      salespersonId: 'SP-002',
      customer: 'Food Delivery Network',
      email: 'tech@foodnetwork.com',
      service: 'Mobile App Development',
      date: '2024-01-05',
      rejectedDate: '2024-01-06',
      amount: '$25,000',
      rejectedBy: 'Manager C',
      reason: 'Requirements mismatch',
      description: 'Client changed requirements after quote submission',
      daysAgo: 20
    },
    {
      id: 'QT-108',
      salesperson: 'Mike R.',
      salespersonId: 'SP-003',
      customer: 'Smart Home Solutions',
      email: 'info@smarthome.com',
      service: 'IoT Integration',
      date: '2024-01-02',
      rejectedDate: '2024-01-03',
      amount: '$14,800',
      rejectedBy: 'Manager A',
      reason: 'Technical limitations',
      description: 'Lack of technical expertise for specific integration',
      daysAgo: 23
    },
  ], []);

  // Get unique salespersons for filter
  const salespersons = useMemo(() => {
    const unique = [...new Set(rejectedQuotations.map(q => q.salesperson))];
    return unique.map(name => ({
      value: name,
      label: name
    }));
  }, [rejectedQuotations]);

  // Get unique rejection reasons for filter
  const rejectionReasons = useMemo(() => {
    const unique = [...new Set(rejectedQuotations.map(q => q.reason))];
    return unique.map(reason => ({
      value: reason,
      label: reason
    }));
  }, [rejectedQuotations]);

  // Filter and sort quotations
  const filteredQuotations = useMemo(() => {
    let result = [...rejectedQuotations];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(quote =>
        quote.customer.toLowerCase().includes(query) ||
        quote.id.toLowerCase().includes(query) ||
        quote.service.toLowerCase().includes(query) ||
        quote.salesperson.toLowerCase().includes(query) ||
        quote.rejectedBy.toLowerCase().includes(query)
      );
    }
    
    // Apply salesperson filter
    if (filters.salesperson !== 'all') {
      result = result.filter(quote => quote.salesperson === filters.salesperson);
    }
    
    // Apply reason filter
    if (filters.reason !== 'all') {
      result = result.filter(quote => quote.reason === filters.reason);
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
        case 'daysAgo':
          comparison = b.daysAgo - a.daysAgo;
          break;
        default:
          comparison = new Date(b.date) - new Date(a.date);
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [rejectedQuotations, searchQuery, filters]);

  const getReasonColor = (reason) => {
    switch (reason) {
      case 'Budget too high':
        return 'bg-red-500/20 text-red-300';
      case 'Requirements mismatch':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'Technical limitations':
        return 'bg-orange-500/20 text-orange-300';
      case 'Scope too limited':
        return 'bg-purple-500/20 text-purple-300';
      case 'Timeline issues':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getDaysAgoColor = (days) => {
    if (days > 20) return 'bg-gray-500/20 text-gray-300';
    if (days > 15) return 'bg-blue-500/20 text-blue-300';
    if (days > 10) return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-orange-500/20 text-orange-300';
  };

  // Sort options
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'salesperson', label: 'Salesperson' },
    { value: 'daysAgo', label: 'Days Ago' }
  ];

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      salesperson: 'all',
      reason: 'all',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  // Check if any filter is active
  const hasActiveFilters = searchQuery || filters.salesperson !== 'all' || filters.reason !== 'all' || filters.sortBy !== 'date';

  // Handle download report
  const handleDownloadReport = () => {
    alert('Downloading rejected quotations report...');
    // In real app, this would generate and download a CSV/PDF report
  };

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
          
          <div className={`p-4 sm:p-6 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
                
                {/* Left Text */}
                <div className="mb-6 lg:mb-2">
                  <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold">Rejected Quotations</h1>
                  <p className="text-gray-400 mt-1 text-sm sm:text-base lg:text-sm">Quotations that were rejected and the reasons</p>
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

                  {/* Rejection Reason Filter */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Rejection Reason</label>
                    <select
                      value={filters.reason}
                      onChange={(e) => setFilters({...filters, reason: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">All Reasons</option>
                      {rejectionReasons.map(option => (
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
                  <button
                    onClick={handleDownloadReport}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <FiDownload className="text-xs" />
                    Export
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
                  
                  {filters.reason !== 'all' && (
                    <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs">
                      Reason: {filters.reason}
                      <button
                        onClick={() => setFilters({...filters, reason: 'all'})}
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
              Showing {filteredQuotations.length} of {rejectedQuotations.length} rejected quotations
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
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Rejected By</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Reason</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Days Ago</th>
                  </tr>
                </thead>
                
                {/* Mobile Headers */}
                <thead className="bg-gray-700 sm:hidden">
                  <tr>
                    <th colSpan="2" className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Rejected Quotations ({filteredQuotations.length})
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
                                <span className="font-bold text-red-400">{quote.id}</span>
                                <h3 className="font-semibold text-white mt-1">{quote.customer}</h3>
                                <p className="text-gray-400 text-sm">{quote.email}</p>
                              </div>
                              <span className={`px-3 py-1 rounded text-xs font-medium ${getReasonColor(quote.reason)}`}>
                                {quote.reason}
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
                                <p className="text-gray-400 text-xs">Rejected By</p>
                                <p className="text-orange-300 text-sm">{quote.rejectedBy}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Date</p>
                                <p className="text-gray-300 text-sm">{quote.date}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Days Ago</p>
                                <p className={`px-2 py-1 rounded text-xs mt-1 ${getDaysAgoColor(quote.daysAgo)}`}>
                                  {quote.daysAgo} days
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-gray-400 text-xs">Reason Details</p>
                              <p className="text-gray-300 text-xs mt-1">{quote.description}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Desktop/Tablet View - Table Layout */}
                      <tr key={`desktop-${quote.id}`} className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-4 py-3">
                          <span className="font-bold text-red-400 text-sm">{quote.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white text-sm">{quote.customer}</div>
                          <div className="text-xs text-gray-400">{quote.email}</div>
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
                        <td className="px-4 py-3 text-orange-300 text-sm">{quote.rejectedBy}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`px-3 py-1 rounded text-xs font-medium ${getReasonColor(quote.reason)}`}>
                              {quote.reason}
                            </span>
                            <div className="text-xs text-gray-400 max-w-xs truncate">
                              {quote.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${getDaysAgoColor(quote.daysAgo)}`}>
                            {quote.daysAgo} days
                          </span>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredQuotations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-3xl mb-4">❌</div>
                <p className="text-gray-400">No rejected quotations found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : 'No quotations have been rejected.'}
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
              <div className="text-gray-400 text-sm">Total Rejected</div>
              <div className="text-2xl font-bold text-red-400">{rejectedQuotations.length}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="text-gray-400 text-sm">Top Reason</div>
              <div className="text-2xl font-bold text-yellow-400">
                Budget too high
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="text-gray-400 text-sm">Total Value Lost</div>
              <div className="text-2xl font-bold text-orange-400">
                $147,300
              </div>
            </div>
          </div>

          {/* Analysis Section */}
          <div className="mt-6 bg-gray-800 p-4 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Rejection Analysis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-2">Reasons Breakdown</p>
                <div className="space-y-2">
                  {rejectionReasons.map((reason) => {
                    const count = rejectedQuotations.filter(q => q.reason === reason.value).length;
                    const percentage = ((count / rejectedQuotations.length) * 100).toFixed(1);
                    return (
                      <div key={reason.value} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{reason.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Salesperson Performance</p>
                <div className="space-y-2">
                  {salespersons.map((salesperson) => {
                    const count = rejectedQuotations.filter(q => q.salesperson === salesperson.value).length;
                    return (
                      <div key={salesperson.value} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{salesperson.label}</span>
                        <span className="text-sm text-red-400">{count} rejected</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rejected;