import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerNavbar from "../../../components/ManagerNavbar";
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const TeamRevenue = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    salesperson: 'all',
    paymentMethod: 'all',
    sortBy: 'paymentDate',
    sortOrder: 'desc'
  });
  const navigate = useNavigate();

  // Dummy data for team revenue (approved and payment completed)
  const teamRevenueQuotations = [
    {
      id: 'QT-201',
      salesperson: 'John Smith',
      salespersonId: 'SP-001',
      customer: 'Tech Solutions Inc.',
      email: 'contact@techsolutions.com',
      service: 'Custom Software Development',
      amount: '$12,500',
      approvedDate: '2024-01-22',
      paymentDate: '2024-01-25',
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Completed',
      projectStatus: 'Delivered'
    },
    {
      id: 'QT-202',
      salesperson: 'Sarah Johnson',
      salespersonId: 'SP-002',
      customer: 'Retail Masters',
      email: 'procurement@retailmasters.com',
      service: 'E-commerce Platform',
      amount: '$8,200',
      approvedDate: '2024-01-19',
      paymentDate: '2024-01-22',
      paymentMethod: 'Cash',
      paymentStatus: 'Completed',
      projectStatus: 'Completed'
    },
    {
      id: 'QT-203',
      salesperson: 'Michael Brown',
      salespersonId: 'SP-003',
      customer: 'HealthCare Plus',
      email: 'it@healthcareplus.com',
      service: 'Medical Management System',
      amount: '$15,000',
      approvedDate: '2024-01-17',
      paymentDate: '2024-01-20',
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Completed',
      projectStatus: 'In Progress'
    },
    {
      id: 'QT-204',
      salesperson: 'Emily Davis',
      salespersonId: 'SP-004',
      customer: 'EduTech Innovations',
      email: 'admin@edutech.com',
      service: 'Learning Management System',
      amount: '$9,800',
      approvedDate: '2024-01-14',
      paymentDate: '2024-01-18',
      paymentMethod: 'Cash',
      paymentStatus: 'Completed',
      projectStatus: 'Delivered'
    },
    {
      id: 'QT-205',
      salesperson: 'Robert Wilson',
      salespersonId: 'SP-005',
      customer: 'Logistics Pro',
      email: 'sales@logisticspro.com',
      service: 'Supply Chain Management',
      amount: '$7,500',
      approvedDate: '2024-01-11',
      paymentDate: '2024-01-14',
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Completed',
      projectStatus: 'Completed'
    },
  ];

  // Get unique salespersons for filter
  const salespersons = useMemo(() => {
    const unique = [...new Set(teamRevenueQuotations.map(q => q.salesperson))];
    return unique.map(name => ({
      value: name,
      label: name
    }));
  }, [teamRevenueQuotations]);

  // Filter and sort quotations
  const filteredQuotations = useMemo(() => {
    let result = [...teamRevenueQuotations];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(quote =>
        quote.customer.toLowerCase().includes(query) ||
        quote.id.toLowerCase().includes(query) ||
        quote.service.toLowerCase().includes(query) ||
        quote.salesperson.toLowerCase().includes(query)
      );
    }
    
    // Apply salesperson filter
    if (filters.salesperson !== 'all') {
      result = result.filter(quote => quote.salesperson === filters.salesperson);
    }
    
    // Apply payment method filter
    if (filters.paymentMethod !== 'all') {
      result = result.filter(quote => quote.paymentMethod === filters.paymentMethod);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'paymentDate':
          comparison = new Date(b.paymentDate) - new Date(a.paymentDate);
          break;
        case 'amount':
          comparison = parseFloat(b.amount.replace('$', '')) - parseFloat(a.amount.replace('$', ''));
          break;
        case 'salesperson':
          comparison = a.salesperson.localeCompare(b.salesperson);
          break;
        case 'customer':
          comparison = a.customer.localeCompare(b.customer);
          break;
        default:
          comparison = new Date(b.paymentDate) - new Date(a.paymentDate);
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [teamRevenueQuotations, searchQuery, filters]);

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'Bank Transfer':
        return 'bg-blue-500/20 text-blue-300';
      case 'Cash':
        return 'bg-green-500/20 text-green-300';
      case 'Cheque':
        return 'bg-purple-500/20 text-purple-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getProjectStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-300';
      case 'Delivered':
        return 'bg-teal-500/20 text-teal-300';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  // Payment method options for filter
  const paymentMethodOptions = [
    { value: 'all', label: 'All Payment Methods' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Cheque', label: 'Cheque' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'paymentDate', label: 'Payment Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'salesperson', label: 'Salesperson' },
    { value: 'customer', label: 'Customer' }
  ];

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      salesperson: 'all',
      paymentMethod: 'all',
      sortBy: 'paymentDate',
      sortOrder: 'desc'
    });
  };

  // Check if any filter is active
  const hasActiveFilters = searchQuery || filters.salesperson !== 'all' || filters.paymentMethod !== 'all' || filters.sortBy !== 'paymentDate';

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
                  <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold">Team Revenue</h1>
                  <p className="text-gray-400 mt-1 text-sm sm:text-base lg:text-sm">Approved quotations with completed payments (won deals)</p>
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

                  {/* Payment Method Filter */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Payment Method</label>
                    <select
                      value={filters.paymentMethod}
                      onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      {paymentMethodOptions.map(option => (
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
                  
                  {filters.paymentMethod !== 'all' && (
                    <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs">
                      Payment: {filters.paymentMethod}
                      <button
                        onClick={() => setFilters({...filters, paymentMethod: 'all'})}
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
              Showing {filteredQuotations.length} of {teamRevenueQuotations.length} revenue quotations
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
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Payment Method</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Payment Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Project Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Actions</th>
                  </tr>
                </thead>
                
                {/* Mobile Headers */}
                <thead className="bg-gray-700 sm:hidden">
                  <tr>
                    <th colSpan="2" className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Team Revenue ({filteredQuotations.length})
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
                                <span className="font-bold text-green-400">{quote.id}</span>
                                <h3 className="font-semibold text-white mt-1">{quote.customer}</h3>
                                <p className="text-gray-400 text-sm">{quote.email}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300`}>
                                Paid
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Service</p>
                                <p className="text-blue-400 text-sm">{quote.service}</p>
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
                                <p className="text-gray-400 text-xs">Payment Method</p>
                                <p className={`px-2 py-1 rounded text-xs mt-1 ${getPaymentMethodColor(quote.paymentMethod)}`}>
                                  {quote.paymentMethod}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Payment Date</p>
                                <p className="text-green-300 text-sm font-medium">{quote.paymentDate}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Project Status</p>
                                <p className={`px-2 py-1 rounded text-xs mt-1 ${getProjectStatusColor(quote.projectStatus)}`}>
                                  {quote.projectStatus}
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
                              <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded text-sm font-medium transition-colors">
                                Receipt
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Desktop/Tablet View - Table Layout */}
                      <tr key={`desktop-${quote.id}`} className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-4 py-3">
                          <span className="font-bold text-green-400 text-sm">{quote.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white text-sm">{quote.customer}</div>
                          <div className="text-xs text-gray-400">{quote.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-blue-400 font-medium text-sm">{quote.service}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-purple-300 text-sm">{quote.salesperson}</div>
                          <div className="text-xs text-gray-400">{quote.salespersonId}</div>
                        </td>
                        <td className="px-4 py-3 font-bold text-white text-sm">{quote.amount}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${getPaymentMethodColor(quote.paymentMethod)}`}>
                            {quote.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-green-300 text-sm font-medium">{quote.paymentDate}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${getProjectStatusColor(quote.projectStatus)}`}>
                            {quote.projectStatus}
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
                            <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                              Receipt
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
                <div className="text-3xl mb-4">💰</div>
                <p className="text-gray-400">No revenue quotations found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : 'No completed payments found.'}
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
              Showing {filteredQuotations.length} revenue quotations
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

export default TeamRevenue;