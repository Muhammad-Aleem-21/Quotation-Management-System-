import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminNavbar from "../../../components/SuperAdminNavbar";
import API from "../../../api/api";
import { FiSearch, FiFilter, FiX, FiUser, FiDollarSign, FiCalendar, FiXCircle, FiChevronRight, FiRefreshCw } from 'react-icons/fi';

const RejectedList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectedQuotations, setRejectedQuotations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    salesperson: 'all',
    area: 'all',
    rejectReason: 'all',
    sortBy: 'rejectDate',
    sortOrder: 'desc'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRejectedQuotations();
  }, []);

  const fetchRejectedQuotations = async () => {
    try {
      setLoading(true);
      setError(null);
      // const response = await API.get("/quotations/22/reject");
      const response = { data: { quotations: [] } };
      
      if (response.data) {
        const data = response.data.quotations || response.data.data || response.data || [];
        setRejectedQuotations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching rejected quotations:", err);
      setError("Failed to load rejected quotations from API");
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const salespersons = useMemo(() => {
    const unique = [...new Set(rejectedQuotations.map(q => q.salesperson || q.salesman?.name || 'N/A'))];
    return unique;
  }, [rejectedQuotations]);

  const areas = useMemo(() => {
    const unique = [...new Set(rejectedQuotations.map(q => q.area || q.salesman?.area || 'N/A'))];
    return unique;
  }, [rejectedQuotations]);

  const rejectReasons = [
    { value: 'all', label: 'All Reasons' },
    { value: 'budget_constraints', label: 'Budget Constraints' },
    { value: 'competitor_lower_price', label: 'Competitor Lower Price' },
    { value: 'scope_mismatch', label: 'Scope Mismatch' },
    { value: 'timeline_issues', label: 'Timeline Issues' },
    { value: 'requirements_changed', label: 'Requirements Changed' },
    { value: 'other', label: 'Other' },
  ];

  // Filter and sort quotations
  const filteredQuotations = useMemo(() => {
    let result = [...rejectedQuotations];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(quote =>
        (quote.customer_name || quote.customer || '').toLowerCase().includes(query) ||
        quote.id.toString().includes(query) ||
        (quote.salesperson || quote.salesman?.name || '').toLowerCase().includes(query) ||
        (quote.service || quote.title || '').toLowerCase().includes(query)
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
    
    // Apply reject reason filter
    if (filters.rejectReason !== 'all') {
      result = result.filter(quote => quote.rejectReason === filters.rejectReason);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'rejectDate':
          comparison = new Date(b.rejectDate) - new Date(a.rejectDate);
          break;
        case 'date':
          comparison = new Date(b.date) - new Date(a.date);
          break;
        case 'amount':
          comparison = (b.total_amount || b.amount || 0) - (a.total_amount || a.amount || 0);
          break;
        case 'salesperson':
          comparison = a.salesperson.localeCompare(b.salesperson);
          break;
        case 'customer':
          comparison = a.customer.localeCompare(b.customer);
          break;
        default:
          comparison = new Date(b.rejectDate) - new Date(a.date);
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [rejectedQuotations, searchQuery, filters]);

  const handleQuotationClick = (quotation) => {
    setSelectedQuotation(quotation);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'revised':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'resubmitted':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getReasonColor = (reason) => {
    switch(reason) {
      case 'budget_constraints':
        return 'bg-red-500/20 text-red-300';
      case 'competitor_lower_price':
        return 'bg-orange-500/20 text-orange-300';
      case 'scope_mismatch':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'timeline_issues':
        return 'bg-blue-500/20 text-blue-300';
      case 'requirements_changed':
        return 'bg-purple-500/20 text-purple-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getReasonLabel = (reason) => {
    if (!reason) return 'N/A';
    const reasonObj = rejectReasons.find(r => r.value === reason);
    return reasonObj ? reasonObj.label : reason.replace('_', ' ');
  };

  const handleRevise = (id) => {
    if (window.confirm(`Create a revised version of quotation ${id}?`)) {
      alert(`Revised quotation created from ${id}!`);
      // In real app, make API call here
    }
  };

  const handleResubmit = (id) => {
    if (window.confirm(`Resubmit quotation ${id} for approval?`)) {
      alert(`Quotation ${id} has been resubmitted!`);
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
          {/* Header */}
         
          <div className={`p-4 sm:p-6 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
                
                {/* Left Text */}
                <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Rejected Quotations</h1>
                <p className="text-gray-400 mt-1">
                    Review rejected quotations and manage revisions
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

                  {/* Reject Reason Filter */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Reject Reason</label>
                    <select
                      value={filters.rejectReason}
                      onChange={(e) => setFilters({...filters, rejectReason: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      {rejectReasons.map(reason => (
                        <option key={reason.value} value={reason.value}>{reason.label}</option>
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
                      <option value="rejectDate">Reject Date</option>
                      <option value="date">Created Date</option>
                      <option value="amount">Amount</option>
                      <option value="salesperson">Salesperson</option>
                      <option value="customer">Customer</option>
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
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-red-900/30 to-rose-900/30 p-4 rounded-xl border border-red-700/30">
              <p className="text-gray-400 text-sm">Total Rejected</p>
              <p className="text-2xl font-bold text-red-400">{rejectedQuotations.length}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 p-4 rounded-xl border border-orange-700/30">
              <p className="text-gray-400 text-sm">Budget Issues</p>
              <p className="text-2xl font-bold text-orange-400">
                {rejectedQuotations.filter(q => q.rejectReason === 'budget_constraints').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 p-4 rounded-xl border border-yellow-700/30">
              <p className="text-gray-400 text-sm">Can Be Revised</p>
              <p className="text-2xl font-bold text-yellow-400">
                {rejectedQuotations.filter(q => q.canBeRevised).length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-4 rounded-xl border border-blue-700/30">
              <p className="text-gray-400 text-sm">Total Lost Revenue</p>
              <p className="text-2xl font-bold text-blue-400">
                ${rejectedQuotations.reduce((sum, q) => sum + parseFloat(q.total_amount || q.amount || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              Showing {filteredQuotations.length} of {rejectedQuotations.length} rejected quotations
            </p>
            {error && <span className="text-red-400 text-sm">⚠️ {error}</span>}
            {loading && <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>}
            <div className="text-sm text-gray-400">
              {rejectedQuotations.filter(q => q.canBeRevised).length} can be revised
            </div>
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
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Reject Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Reason</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm"></th>
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
                    <React.Fragment key={quote.id}>
                      {/* Mobile View - Card Layout */}
                      <tr className="sm:hidden border-b border-gray-700 hover:bg-gray-750 transition-colors duration-200">
                        <td colSpan="2" className="p-4">
                          <div 
                            className="space-y-3 cursor-pointer"
                            onClick={() => handleQuotationClick(quote)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-red-400">QT-{quote.id}</h3>
                                <h4 className="font-semibold text-white mt-1">{quote.customer_name || quote.customer || 'N/A'}</h4>
                                <p className="text-gray-400 text-sm">{quote.service || quote.title || 'N/A'}</p>
                              </div>
                              <FiChevronRight className="text-gray-400" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Salesperson</p>
                                <p className="text-purple-300 text-sm">{quote.salesperson || quote.salesman?.name || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Reject Date</p>
                                <p className="text-gray-300 text-sm">{formatDate(quote.rejected_at || quote.updated_at)}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Amount</p>
                                <p className="font-bold text-white text-sm">${quote.total_amount || quote.amount || '0'}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Reason</p>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getReasonColor(quote.rejectReason || 'budget_constraints')}`}>
                                  {getReasonLabel(quote.rejectReason || quote.rejection_reason || 'Other')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Desktop/Tablet View - Table Layout */}
                      <tr className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div 
                            className="font-bold text-red-400 cursor-pointer hover:text-red-300 transition-colors"
                            onClick={() => handleQuotationClick(quote)}
                          >
                            QT-{quote.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div 
                            className="font-semibold text-white cursor-pointer hover:text-blue-300 transition-colors"
                            onClick={() => handleQuotationClick(quote)}
                          >
                            {quote.customer_name || quote.customer || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{quote.customer_email || quote.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-400 font-medium text-sm">{quote.service || quote.title || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiUser className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-300 text-sm">{quote.salesperson || quote.salesman?.name || 'N/A'}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{quote.area || quote.salesman?.area || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4 text-red-400" />
                            <div>
                              <div className="text-gray-300 text-sm">{formatDate(quote.rejected_at || quote.updated_at)}</div>
                              <div className="text-xs text-gray-500">By: {quote.rejected_by_name || 'System'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiDollarSign className="w-4 h-4 text-yellow-400" />
                            <span className="font-bold text-white">${quote.total_amount || quote.amount || '0'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${getReasonColor(quote.rejectReason || 'budget_constraints')}`}>
                            {getReasonLabel(quote.rejectReason || quote.rejection_reason || 'Other')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {quote.canBeRevised && (
                              <button 
                                onClick={() => handleRevise(quote.id)}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                              >
                                <FiRefreshCw className="w-3 h-3" />
                                Revise
                              </button>
                            )}
                            <button 
                                onClick={() => handleQuotationClick(quote)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FiChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredQuotations.length === 0 && !loading && (
              <div className="text-center py-12">
                <FiXCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No rejected quotations found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : 'No rejected quotations in the system.'}
                </p>
              </div>
            )}
            {loading && (
              <div className="text-center py-20 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 animate-pulse">Fetching rejected quotations...</p>
              </div>
            )}
          </div>

          {/* Analysis & Actions */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rejection Reasons Analysis */}
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-3">Rejection Reasons Analysis</h3>
              <div className="space-y-3">
                {rejectReasons
                  .filter(reason => reason.value !== 'all')
                  .map(reason => {
                    const count = rejectedQuotations.filter(q => q.rejectReason === reason.value).length;
                    const percentage = (count / rejectedQuotations.length) * 100;
                    return (
                      <div key={reason.value} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">{reason.label}</span>
                          <span className="text-gray-400">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Recovery Actions */}
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-3">Recovery Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors">
                  Create Revised Versions for All Revisable
                </button>
                <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                  Export Rejection Analysis Report
                </button>
                <button className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
                  Review Sales Training Needs
                </button>
              </div>
            </div>
          </div>

          {/* Quotation Details Modal */}
          {showDetailsModal && selectedQuotation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiXCircle className="w-8 h-8 text-red-400" />
                      <div>
                        <h2 className="text-2xl font-bold text-red-400">{selectedQuotation.id}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedQuotation.status)}`}>
                            REJECTED
                          </span>
                          <span className={`px-3 py-1 rounded text-xs font-medium ${getReasonColor(selectedQuotation.rejectReason)}`}>
                            {getReasonLabel(selectedQuotation.rejectReason)}
                          </span>
                          {selectedQuotation.canBeRevised && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                              Can Be Revised
                            </span>
                          )}
                        </div>
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
                        <p className="font-medium text-lg">{selectedQuotation.customer_name || selectedQuotation.customer || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{selectedQuotation.customer_email || selectedQuotation.email}</p>
                      </div>
                      <div className="p-4 bg-gray-750 rounded-lg">
                        <p className="text-sm text-gray-400">Salesperson</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FiUser className="w-4 h-4 text-purple-400" />
                          <p className="font-medium">{selectedQuotation.salesperson || selectedQuotation.salesman?.name || 'N/A'}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{selectedQuotation.area || selectedQuotation.salesman?.area || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-gray-750 rounded-lg">
                        <p className="text-sm text-gray-400">Service</p>
                        <p className="font-medium text-green-400">{selectedQuotation.service || selectedQuotation.title || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-gray-750 rounded-lg">
                        <p className="text-sm text-gray-400">Amount</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FiDollarSign className="w-5 h-5 text-yellow-400" />
                          <p className="font-bold text-2xl">${selectedQuotation.total_amount || selectedQuotation.amount || '0'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Details */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Rejection Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-red-900/20 rounded-lg border border-red-700/30">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-sm text-gray-400">Rejected By</p>
                            <p className="font-medium">{selectedQuotation.rejected_by_name || 'System'}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Date: {formatDate(selectedQuotation.rejected_at || selectedQuotation.updated_at)}</p>
                      </div>
                      <div className="p-4 bg-red-900/20 rounded-lg border border-red-700/30">
                        <p className="text-sm text-gray-400">Rejection Reason</p>
                        <p className="font-medium text-red-300 text-lg mt-1">{getReasonLabel(selectedQuotation.rejectReason || selectedQuotation.rejection_reason || 'Other')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Rejection Notes</h3>
                    <div className="p-4 bg-red-900/10 rounded-lg border border-red-700/20">
                      <p className="text-gray-300">{selectedQuotation.notes}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Original Description</h3>
                    <div className="p-4 bg-gray-750 rounded-lg">
                      <p className="text-gray-300">{selectedQuotation.description}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedQuotation.canBeRevised && (
                      <button 
                        onClick={() => {
                          handleRevise(selectedQuotation.id);
                          setShowDetailsModal(false);
                        }}
                        className="p-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <FiRefreshCw className="w-4 h-4" />
                        Create Revised Version
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        handleResubmit(selectedQuotation.id);
                        setShowDetailsModal(false);
                      }}
                      className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                    >
                      Resubmit for Approval
                    </button>
                    <button className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
                      View Full Details
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
                    Edit Record
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

export default RejectedList;