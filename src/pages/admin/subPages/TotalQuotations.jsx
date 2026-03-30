import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from "../../../components/AdminNavbar";
import { FiSearch, FiX, FiFileText, FiUser, FiCheck, FiXCircle, FiClock } from 'react-icons/fi';
import API, { getQuotations, getTeamStats, generateQuotationPdf } from '../../../api/api';

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quotations, setQuotations] = useState([]);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = String(user.id || "");
  const userRole = (user.role || "").toLowerCase();

  // Modal States
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(null);

  // Action States
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);
  const [rejecting, setRejecting] = useState(false);

  // Safe access helper
  const getVal = (val, field) => {
    if (!val) return 'N/A';
    if (typeof val === 'object') return val[field] || 'N/A';
    return val;
  };

  const handleViewPdf = async (id) => {
    try {
      setDownloadingPdf(id);
      const response = await generateQuotationPdf(id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (err) {
      console.error("Error viewing PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloadingPdf(null);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm("Are you sure you want to approve this quotation?")) {
      try {
        const res = await API.post(`/quotations/${id}/approve`);
        if (res.data.success) {
          alert(`Quotation ${id} has been approved!`);
          fetchQuotations();
        }
      } catch (err) {
        console.error("Error approving quotation:", err);
        alert("Failed to approve quotation");
      }
    }
  };

  const handleReject = (id) => {
    setSelectedQuoteId(id);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      setRejecting(true);
      const res = await API.post(`/quotations/${selectedQuoteId}/reject`, { 
        rejection_reason: rejectionReason 
      });
      
      if (res.data.success) {
        alert(`Quotation ${selectedQuoteId} has been rejected.`);
        setShowRejectModal(false);
        fetchQuotations();
      }
    } catch (err) {
      console.error("Error rejecting quotation:", err);
      alert("Failed to reject quotation. Please try again.");
    } finally {
      setRejecting(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [quotesRes, statsRes] = await Promise.all([
        getQuotations(),
        getTeamStats()
      ]);

      if (quotesRes.data && statsRes.data) {
        const allQuotes = quotesRes.data.data || quotesRes.data.quotations || quotesRes.data || [];
        if (userRole === 'superadmin') {
          setQuotations(allQuotes);
        } else {
          const adminId = String(user.id);
          const allTeam = statsRes.data.dashboard_stats?.my_team || [];
          const teamMemberIds = allTeam.map(member => String(member.id));
          
          if (!teamMemberIds.includes(adminId)) {
            teamMemberIds.push(adminId);
          }

          const scopedQuotes = allQuotes.filter(quote => {
            const creatorId = String(quote.user_id || quote.salesperson_id || quote.created_by || quote.user?.id || "");
            return teamMemberIds.includes(creatorId) || creatorId === adminId;
          });
          setQuotations(scopedQuotes);
        }
      }
    } catch (err) {
      console.error("Error fetching quotations:", err);
      setError("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  const allQuotations = quotations;

  // Get unique salespersons for filter
  const salespersons = useMemo(() => {
    const names = allQuotations.map(q => getVal(q.user || q.salesperson, 'name'));
    const unique = [...new Set(names.filter(n => n !== 'N/A'))];
    return unique.sort().map(name => ({
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
        (quote.client_name || quote.customer || "").toLowerCase().includes(query) ||
        String(quote.id).toLowerCase().includes(query) ||
        (quote.service_name || quote.service || "").toLowerCase().includes(query) ||
        (quote.user?.name || quote.salesperson || "").toLowerCase().includes(query) ||
        (quote.client_email || quote.customerEmail || "").toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(quote => quote.status === filters.status);
    }
    
    // Apply salesperson filter
    if (filters.salesperson !== 'all') {
      result = result.filter(quote => getVal(quote.user || quote.salesperson, 'name') === filters.salesperson);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(b.date) - new Date(a.date);
          break;
        case 'amount':
          comparison = parseFloat(String(b.final_amount || b.total_amount || 0).replace('$', '').replace(',', '')) - 
                       parseFloat(String(a.final_amount || a.total_amount || 0).replace('$', '').replace(',', ''));
          break;
        case 'salesperson':
          comparison = getVal(a.user || a.salesperson, 'name').localeCompare(getVal(b.user || b.salesperson, 'name'));
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
    const isPending = (s) => ['pending', 'submitted', 'revised', 'received'].includes(s?.toLowerCase());
    const isApproved = (s) => ['approved', 'accepted', 'auto-approved', 'sent'].includes(s?.toLowerCase());
    const isRejected = (s) => s?.toLowerCase() === 'rejected';

    const approvedCount = allQuotations.filter(q => isApproved(q.status)).length;
    const pendingCount = allQuotations.filter(q => isPending(q.status)).length;
    const rejectedCount = allQuotations.filter(q => isRejected(q.status)).length;
    const totalAmountValue = allQuotations.reduce((sum, q) => sum + parseFloat(q.final_amount || q.total_amount || 0), 0);
    
    return {
      total,
      approved: approvedCount,
      pending: pendingCount,
      rejected: rejectedCount,
      totalAmount: `Rs. ${totalAmountValue.toLocaleString()}`
    };
  }, [allQuotations]);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <AdminNavbar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 lg:ml-64 lg:-mt-135 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
        <div className="h-16 lg:h-0"></div>
        <div className={`p-4 sm:p-6 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Loading quotations...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={fetchQuotations}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6 flex justify-between items-start">
                  
                  {/* Left Text */}
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Total Quotations</h1>
                    <p className="text-gray-400 mt-1">
                      {userRole === 'superadmin' ? 'all quotations in the system' : 'total quotations managed by you and your team'}
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
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Created By</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Customer</th>
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
                                <h3 className="font-semibold text-white mt-1">{getVal(quote.client || quote.customer, 'name') || quote.client_name || 'N/A'}</h3>
                                <p className="text-gray-400 text-sm">{getVal(quote.client || quote.customer, 'email') || quote.client_email || 'N/A'}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(quote.status)} flex items-center gap-1`}>
                                {getStatusIcon(quote.status)}
                                {quote.status}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <FiUser className="text-purple-300 text-xs" />
                              <p className="text-purple-300 text-sm font-medium">{getVal(quote.user || quote.salesperson, 'name')}</p>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <p className="font-bold text-white text-sm">Rs. {parseFloat(quote.final_amount || quote.total_amount || 0).toLocaleString()}</p>
                              <p className="text-gray-400">{quote.quotation_date || quote.created_at?.split('T')[0]}</p>
                            </div>
                            
                            <div className="pt-2">
                              <button 
                                onClick={() => {
                                  setSelectedQuotation(quote);
                                  setShowDetailsModal(true);
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition-colors"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Desktop/Tablet View - Table Layout */}
                      <tr key={`desktop-${quote.id}`} className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-4 py-3">
                          <span className="font-bold text-blue-400 text-sm">#{quote.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FiUser className="text-purple-300" />
                            <div>
                                <div className="text-purple-300 text-sm font-medium">{getVal(quote.user || quote.salesperson, 'name')}</div>
                                <div className="text-xs text-gray-400 font-mono">ID: #{quote.user_id || quote.salesperson_id || (typeof quote.user === 'object' ? quote.user.id : '')}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white text-sm">{getVal(quote.client || quote.customer, 'name') || quote.client_name || 'N/A'}</div>
                          <div className="text-xs text-gray-400 truncate max-w-[150px]">{getVal(quote.client || quote.customer, 'email') || quote.client_email || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-sm">
                          {quote.quotation_date || quote.created_at?.split('T')[0] || 'N/A'}
                        </td>
                        <td className="px-4 py-3 font-bold text-white text-sm">Rs. {parseFloat(quote.final_amount || quote.total_amount || 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(quote.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(quote.status)}
                            {quote.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button 
                                onClick={() => {
                                  setSelectedQuotation(quote);
                                  setShowDetailsModal(true);
                                }}
                                className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200"
                                title="View Details"
                            >
                                Details
                            </button>
                            <button 
                                onClick={() => handleViewPdf(quote.id)}
                                disabled={downloadingPdf === quote.id}
                                className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 flex items-center gap-1"
                                title="View PDF"
                            >
                                {downloadingPdf === quote.id ? (
                                  <div className="w-3 h-3 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                                ) : <FiFileText size={14} />}
                                PDF
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
            </>
          )}
        </div>
        {/* Quotation Details Modal */}
        {showDetailsModal && selectedQuotation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col">
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                <div className="pr-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                    Quotation Details <span className="text-blue-400 text-xs sm:text-sm font-mono bg-blue-400/10 px-2 py-0.5 rounded-md">#{selectedQuotation.id}</span>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Submitted on {selectedQuotation.quotation_date || getVal(selectedQuotation, 'created_at')?.split('T')[0]}</p>
                </div>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white shrink-0"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Client Info */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-[10px] sm:text-xs uppercase font-bold text-gray-500 tracking-wider">Client Information</h4>
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                      <p className="text-sm font-semibold text-white">{getVal(selectedQuotation.client || selectedQuotation.customer, 'name') || selectedQuotation.client_name || 'N/A'}</p>
                      <p className="text-xs text-gray-400 mt-1 break-all">{getVal(selectedQuotation.client || selectedQuotation.customer, 'email') || selectedQuotation.client_email || 'N/A'}</p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] sm:text-xs text-gray-500">
                        <FiUser size={12} className="shrink-0" />
                        <span className="truncate">Salesperson: {getVal(selectedQuotation.user || selectedQuotation.salesperson, 'name') || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Info */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-[10px] sm:text-xs uppercase font-bold text-gray-500 tracking-wider">Summary</h4>
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400 font-medium italic">Status</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(selectedQuotation.status)}`}>
                          {selectedQuotation.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400 font-medium italic">Discount</span>
                        <span className="text-sm font-semibold text-red-400">
                          - Rs. {parseFloat(selectedQuotation.total_discount || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-700/50 pt-2">
                        <span className="text-xs text-gray-400 font-medium italic">Final Total</span>
                        <span className="text-base sm:text-lg font-bold text-white">Rs. {parseFloat(selectedQuotation.final_amount || selectedQuotation.total_amount || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Specific Info */}
                {(selectedQuotation.status === 'rejected' || selectedQuotation.status === 'declined') && (
                    <div className="mt-4 sm:mt-6">
                        <h4 className="text-[10px] sm:text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">Rejection Reason</h4>
                        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl text-sm text-gray-300 italic">
                            "{selectedQuotation.rejection_reason || selectedQuotation.reason || 'No specific reason provided.'}"
                        </div>
                    </div>
                )}

                {(selectedQuotation.status === 'win' || selectedQuotation.status === 'won') && (
                    <div className="mt-4 sm:mt-6 bg-green-500/5 border border-green-500/20 p-4 rounded-xl flex justify-between items-center">
                        <span className="text-[10px] sm:text-xs text-gray-400 italic">Invoice Number</span>
                        <span className="text-xs sm:text-sm text-yellow-400 font-bold ml-1">{selectedQuotation.invoice_number || selectedQuotation.invoiceNumber || 'N/A'}</span>
                    </div>
                )}

                {/* Items List */}
                {selectedQuotation.items && Array.isArray(selectedQuotation.items) && selectedQuotation.items.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-4">Detailed Line Items</h4>
                    <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 divide-y divide-gray-800">
                      {selectedQuotation.items.map((item, idx) => (
                        <div key={idx} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
                          <div>
                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tight">{getVal(item, 'category_name') || 'Category'}</p>
                            <p className="text-sm font-bold text-white leading-tight">{getVal(item, 'product_name') || 'Product Name'}</p>
                            {item.core_name && (
                              <p className="text-[10px] text-purple-400 mt-0.5 bg-purple-400/10 px-1.5 py-0.5 rounded-md w-fit">Core: {item.core_name}</p>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 space-y-0.5">
                            <p>Qty: <span className="text-gray-200 font-mono">{Number(item.quantity || 0)}</span></p>
                            <p>Unit Price: <span className="text-gray-200 font-mono">Rs.{parseFloat(item.unit_price || item.price || 0).toLocaleString()}</span></p>
                            <p>Discount: <span className="text-red-400 font-mono">Rs.{parseFloat(item.discount || item.discount_amount || 0).toLocaleString()}</span></p>
                          </div>
                          <div className="sm:text-right">
                            <p className="text-[10px] text-gray-500 italic">Subtotal</p>
                            <p className="text-base font-bold text-white">
                              Rs. {(Number(item.quantity || 1) * parseFloat(item.unit_price || item.price || 0) - parseFloat(item.discount || item.discount_amount || 0)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-gray-700 bg-gray-800/50">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleViewPdf(selectedQuotation.id);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 order-2 sm:order-1"
                  >
                    <FiFileText size={16} />
                    View PDF
                  </button>
                  
                  <div className="hidden sm:block sm:flex-1 order-2"></div>

                  {['pending', 'submitted', 'revised'].includes(selectedQuotation.status?.toLowerCase()) ? (
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-3">
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleReject(selectedQuotation.id);
                        }}
                        className="w-full sm:w-auto px-6 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-xl font-semibold border border-red-600/20 transition-all text-center"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleApprove(selectedQuotation.id);
                        }}
                        className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg shadow-green-600/20 transition-all text-center"
                      >
                        Approve Quotation
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="w-full sm:w-auto px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all text-center order-1 sm:order-3"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center text-lg">❌</span>
                    Reject Quotation
                  </h3>
                  <button 
                    onClick={() => setShowRejectModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Reason for Rejection <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all min-h-[120px]"
                    placeholder="Please explain why this quotation is being rejected..."
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReject}
                    disabled={rejecting || !rejectionReason.trim()}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    {rejecting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : "Confirm Reject"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalQuotations;