import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from "../../../components/AdminNavbar";
import { FiSearch, FiX, FiFileText, FiUser, FiCheck, FiXCircle, FiClock } from 'react-icons/fi';

const TotalQuotations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    salesperson: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const navigate = useNavigate();

  // Sample data for all quotations under the manager
  const allQuotations = useMemo(() => [
    {
      id: 'QT-1001',
      salesperson: 'John D.',
      salespersonId: 'SP-001',
      customer: 'TechCorp Solutions',
      customerEmail: 'contact@techcorp.com',
      service: 'Website Redesign',
      date: '2024-01-20',
      amount: '$15,200',
      status: 'approved',
      approvedDate: '2024-01-21',
      approvedBy: 'Manager A',
      daysSince: 5
    },
    {
      id: 'QT-1002',
      salesperson: 'Sarah M.',
      salespersonId: 'SP-002',
      customer: 'Global Logistics Inc',
      customerEmail: 'procurement@globallogistics.com',
      service: 'CRM Implementation',
      date: '2024-01-18',
      amount: '$8,500',
      status: 'pending',
      submittedDate: '2024-01-18',
      daysSince: 7
    },
    {
      id: 'QT-1003',
      salesperson: 'Mike R.',
      salespersonId: 'SP-003',
      customer: 'MediCare Hospital',
      customerEmail: 'it@medicarehospital.com',
      service: 'Medical Equipment',
      date: '2024-01-15',
      amount: '$22,000',
      status: 'rejected',
      rejectedDate: '2024-01-16',
      rejectedBy: 'Manager B',
      reason: 'Budget too high',
      daysSince: 10
    },
    {
      id: 'QT-1004',
      salesperson: 'Emily T.',
      salespersonId: 'SP-004',
      customer: 'EduTech Innovations',
      customerEmail: 'admin@edutech.com',
      service: 'LMS Platform',
      date: '2024-01-12',
      amount: '$12,500',
      status: 'approved',
      approvedDate: '2024-01-13',
      approvedBy: 'Manager C',
      daysSince: 13
    },
    {
      id: 'QT-1005',
      salesperson: 'David L.',
      salespersonId: 'SP-005',
      customer: 'Green Energy Corp',
      customerEmail: 'sales@greenenergy.com',
      service: 'Solar Panel Installation',
      date: '2024-01-10',
      amount: '$18,300',
      status: 'pending',
      submittedDate: '2024-01-10',
      daysSince: 15
    },
    {
      id: 'QT-1006',
      salesperson: 'John D.',
      salespersonId: 'SP-001',
      customer: 'Retail Chain Stores',
      customerEmail: 'it@retailchain.com',
      service: 'POS System Upgrade',
      date: '2024-01-08',
      amount: '$30,000',
      status: 'approved',
      approvedDate: '2024-01-09',
      approvedBy: 'Manager A',
      daysSince: 17
    },
    {
      id: 'QT-1007',
      salesperson: 'Sarah M.',
      salespersonId: 'SP-002',
      customer: 'Food Delivery Network',
      customerEmail: 'tech@foodnetwork.com',
      service: 'Mobile App Development',
      date: '2024-01-05',
      amount: '$25,000',
      status: 'approved',
      approvedDate: '2024-01-06',
      approvedBy: 'Manager B',
      daysSince: 20
    },
    {
      id: 'QT-1008',
      salesperson: 'Mike R.',
      salespersonId: 'SP-003',
      customer: 'Smart Home Solutions',
      customerEmail: 'info@smarthome.com',
      service: 'IoT Integration',
      date: '2024-01-02',
      amount: '$14,800',
      status: 'rejected',
      rejectedDate: '2024-01-03',
      rejectedBy: 'Manager A',
      reason: 'Requirements mismatch',
      daysSince: 23
    },
    {
      id: 'QT-1009',
      salesperson: 'Emily T.',
      salespersonId: 'SP-004',
      customer: 'Finance Solutions Ltd',
      customerEmail: 'info@finance.com',
      service: 'Financial Dashboard',
      date: '2023-12-28',
      amount: '$9,500',
      status: 'approved',
      approvedDate: '2023-12-29',
      approvedBy: 'Manager C',
      daysSince: 27
    },
    {
      id: 'QT-1010',
      salesperson: 'David L.',
      salespersonId: 'SP-005',
      customer: 'Manufacturing Corp',
      customerEmail: 'purchase@manufacturing.com',
      service: 'Inventory System',
      date: '2023-12-25',
      amount: '$16,800',
      status: 'pending',
      submittedDate: '2023-12-25',
      daysSince: 30
    },
    {
      id: 'QT-1011',
      salesperson: 'John D.',
      salespersonId: 'SP-001',
      customer: 'Healthcare Plus',
      customerEmail: 'admin@healthcareplus.com',
      service: 'Patient Management',
      date: '2023-12-20',
      amount: '$21,300',
      status: 'approved',
      approvedDate: '2023-12-21',
      approvedBy: 'Manager A',
      daysSince: 35
    },
    {
      id: 'QT-1012',
      salesperson: 'Sarah M.',
      salespersonId: 'SP-002',
      customer: 'E-commerce Store',
      customerEmail: 'support@estore.com',
      service: 'Online Platform',
      date: '2023-12-15',
      amount: '$11,200',
      status: 'rejected',
      rejectedDate: '2023-12-16',
      rejectedBy: 'Manager B',
      reason: 'Technical limitations',
      daysSince: 40
    }
  ], []);

  // Get unique salespersons for filter
  const salespersons = useMemo(() => {
    const unique = [...new Set(allQuotations.map(q => q.salesperson))];
    return unique.map(name => ({
      value: name,
      label: name
    }));
  }, [allQuotations]);

  // Filter and sort quotations
  const filteredQuotations = useMemo(() => {
    let result = [...allQuotations];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(quote =>
        quote.customer.toLowerCase().includes(query) ||
        quote.id.toLowerCase().includes(query) ||
        quote.service.toLowerCase().includes(query) ||
        quote.salesperson.toLowerCase().includes(query) ||
        quote.customerEmail.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(quote => quote.status === filters.status);
    }
    
    // Apply salesperson filter
    if (filters.salesperson !== 'all') {
      result = result.filter(quote => quote.salesperson === filters.salesperson);
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
        case 'customer':
          comparison = a.customer.localeCompare(b.customer);
          break;
        default:
          comparison = new Date(b.date) - new Date(a.date);
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [allQuotations, searchQuery, filters]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FiCheck className="text-green-400" />;
      case 'pending':
        return <FiClock className="text-yellow-400" />;
      case 'rejected':
        return <FiXCircle className="text-red-400" />;
      default:
        return <FiFileText className="text-gray-400" />;
    }
  };

  // Status options for filter
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'salesperson', label: 'Salesperson' },
    { value: 'customer', label: 'Customer' }
  ];

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      status: 'all',
      salesperson: 'all',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  // Check if any filter is active
  const hasActiveFilters = searchQuery || filters.status !== 'all' || filters.salesperson !== 'all' || filters.sortBy !== 'date';

  // Summary stats
  const summaryStats = useMemo(() => {
    const total = allQuotations.length;
    const approved = allQuotations.filter(q => q.status === 'approved').length;
    const pending = allQuotations.filter(q => q.status === 'pending').length;
    const rejected = allQuotations.filter(q => q.status === 'rejected').length;
    const totalAmount = allQuotations.reduce((sum, q) => sum + parseFloat(q.amount.replace('$', '').replace(',', '')), 0);
    
    return {
      total,
      approved,
      pending,
      rejected,
      totalAmount: `$${totalAmount.toLocaleString()}`
    };
  }, [allQuotations]);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <AdminNavbar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 lg:ml-64 lg:-mt-135 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
        {/* <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-60 mt-14 lg:mt-135`}> */}
        {/* Content Container */}
        {/* Mobile Top Spacer */}
        <div className="h-16 lg:h-0"></div>
        <div className={`p-4 sm:p-6 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
          <div className={`p-4 sm:p-6 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
                
                {/* Left Text */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Total Quotations</h1>
                  <p className="text-gray-400 mt-1">
                    total quotations managed by you and your team
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

          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">Total Quotations</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">{summaryStats.total}</h2>
              <p className="text-blue-400 text-xs sm:text-sm mt-1">All time</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">Approved</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">{summaryStats.approved}</h2>
              <p className="text-green-400 text-xs sm:text-sm mt-1">{((summaryStats.approved / summaryStats.total) * 100).toFixed(1)}% of total</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">Pending</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">{summaryStats.pending}</h2>
              <p className="text-yellow-400 text-xs sm:text-sm mt-1">{((summaryStats.pending / summaryStats.total) * 100).toFixed(1)}% of total</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">Total Value</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">{summaryStats.totalAmount}</h2>
              <p className="text-purple-400 text-xs sm:text-sm mt-1">All quotations</p>
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
                  {/* Status Filter */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

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
                  
                  {filters.status !== 'all' && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                      Status: {filters.status}
                      <button
                        onClick={() => setFilters({...filters, status: 'all'})}
                        className="ml-2 text-purple-200 hover:text-white"
                      >
                        <FiX className="inline text-xs" />
                      </button>
                    </span>
                  )}
                  
                  {filters.salesperson !== 'all' && (
                    <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs">
                      Salesperson: {filters.salesperson}
                      <button
                        onClick={() => setFilters({...filters, salesperson: 'all'})}
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
              Showing {filteredQuotations.length} of {allQuotations.length} quotations
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
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Quotation ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Service</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Salesperson</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Actions</th>
                  </tr>
                </thead>
                
                {/* Mobile Headers */}
                <thead className="bg-gray-700 sm:hidden">
                  <tr>
                    <th colSpan="2" className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      All Quotations ({filteredQuotations.length})
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
                                <p className="text-gray-400 text-sm">{quote.customerEmail}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)} flex items-center gap-1`}>
                                {getStatusIcon(quote.status)}
                                {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
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
                                <div className="flex items-center gap-2">
                                  <FiUser className="text-purple-300 text-xs" />
                                  <p className="text-purple-300 text-sm font-medium">{quote.salesperson}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Date</p>
                                <p className="text-gray-300 text-sm">{quote.date}</p>
                              </div>
                            </div>
                            
                            <div className="pt-2">
                              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition-colors">
                                View Details
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Desktop/Tablet View - Table Layout */}
                      <tr key={`desktop-${quote.id}`} className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FiFileText className="text-blue-400" />
                            <span className="font-bold text-blue-400 text-sm">{quote.id}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white text-sm">{quote.customer}</div>
                          <div className="text-xs text-gray-400">{quote.customerEmail}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-green-400 font-medium text-sm">{quote.service}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FiUser className="text-purple-300" />
                            <div>
                              <div className="text-purple-300 text-sm">{quote.salesperson}</div>
                              <div className="text-xs text-gray-400">{quote.salespersonId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-sm">{quote.date}</td>
                        <td className="px-4 py-3 font-bold text-white text-sm">{quote.amount}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(quote.status)}
                            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                            View Details
                          </button>
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
                <p className="text-gray-400">No quotations found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : 'No quotations have been created yet.'}
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
              Showing {filteredQuotations.length} quotations
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

export default TotalQuotations;