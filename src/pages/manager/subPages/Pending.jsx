

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerNavbar from "../../../components/ManagerNavbar";
import { FiSearch, FiFilter, FiX, FiFileText } from 'react-icons/fi';
import API, { getQuotations, getTeamStats, generateQuotationPdf } from '../../../api/api';

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [downloadingPdf, setDownloadingPdf] = useState(null);
  
  // Rejection Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);
  const [rejecting, setRejecting] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = String(user.id || "");

  useEffect(() => {
    fetchPendingQuotations();
  }, []);

  const fetchPendingQuotations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [quotesRes, statsRes] = await Promise.all([
        getQuotations(),
        getTeamStats()
      ]);

      if (quotesRes.data && statsRes.data) {
        const allQuotes = quotesRes.data.data || quotesRes.data.quotations || quotesRes.data || [];
        const myTeam = statsRes.data.dashboard_stats?.my_team || [];
        
        // Get IDs of all salespersons in this manager's team (including the manager themselves)
        const teamMemberIds = myTeam
          .filter(member => String(member.manager_id) === userId || String(member.parent_id) === userId || String(member.id) === userId)
          .map(member => String(member.id));
        
        if (!teamMemberIds.includes(userId)) teamMemberIds.push(userId);

        // Filter quotations: created by a team member AND status is pending
        const pendingQuotes = allQuotes.filter(quote => {
          const creatorId = String(quote.user_id || quote.salesperson_id || quote.user?.id || "");
          const status = (quote.status || "").toLowerCase();
          return teamMemberIds.includes(creatorId) && (status === 'pending' || status === 'submitted');
        });

        setQuotations(pendingQuotes);
      }
    } catch (err) {
      console.error("Error fetching pending quotations:", err);
      setError("Failed to load pending quotations");
    } finally {
      setLoading(false);
    }
  };

  const pendingQuotations = quotations;

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
        (quote.client_name || quote.customer || "").toLowerCase().includes(query) ||
        String(quote.id).toLowerCase().includes(query) ||
        (quote.service_name || quote.service || "").toLowerCase().includes(query) ||
        (quote.user?.name || quote.salesperson || "").toLowerCase().includes(query) ||
        (quote.description || "").toLowerCase().includes(query)
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
          {
            comparison = parseFloat(String(b.final_amount || b.total_amount || 0).replace('$', '').replace(',', '')) - 
                         parseFloat(String(a.final_amount || a.total_amount || 0).replace('$', '').replace(',', ''));
          }
          break;
        case 'salesperson':
          comparison = a.salesperson.localeCompare(b.salesperson);
          break;
        case 'priority':
          {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            const priorityA = (a.priority || 'medium').toLowerCase();
            const priorityB = (b.priority || 'medium').toLowerCase();
            comparison = (priorityOrder[priorityB] || 0) - (priorityOrder[priorityA] || 0);
          }
          break;
          {
            const dateB = new Date(b.created_at || b.date);
            const dateA = new Date(a.created_at || a.date);
            comparison = Math.floor((new Date() - dateB) / (1000 * 60 * 60 * 24)) - 
                         Math.floor((new Date() - dateA) / (1000 * 60 * 60 * 24));
          }
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

  // Handle PDF Download
  const handleDownloadPdf = async (id) => {
    try {
      setDownloadingPdf(id);
      const response = await generateQuotationPdf(id);
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Quotation-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloadingPdf(null);
    }
  };

  // Handle approve action
  const handleApprove = async (id) => {
    if (window.confirm(`Are you sure you want to approve quotation ${id}?`)) {
      try {
        const res = await API.post(`/quotations/${id}/approve`);
        if (res.data.success) {
          alert(`Quotation ${id} has been approved!`);
          fetchPendingQuotations();
        }
      } catch (err) {
        console.error("Error approving quotation:", err);
        alert("Failed to approve quotation");
      }
    }
  };

  // Handle reject action (Open Modal)
  const handleReject = (id) => {
    setSelectedQuoteId(id);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  // Confirm rejection with reason
  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      setRejecting(true);
      const res = await API.post(`/quotations/${selectedQuoteId}/reject`, { 
        status: 'rejected',
        rejection_reason: rejectionReason 
      });
      
      if (res.data.success) {
        alert(`Quotation ${selectedQuoteId} has been rejected.`);
        setShowRejectModal(false);
        fetchPendingQuotations();
      }
    } catch (err) {
      console.error("Error rejecting quotation:", err);
      alert("Failed to reject quotation. Please try again.");
    } finally {
      setRejecting(false);
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
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Salesperson</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Service</th>
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
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(quote.priority || 'medium')}`}>
                                {(quote.priority || 'medium').charAt(0).toUpperCase() + (quote.priority || 'medium').slice(1)}
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
                                onClick={() => navigate(`/create-quotation`, { state: { editQuotation: quote } })}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-xs font-medium transition-colors text-center"
                              >
                                Edit/View
                              </button>
                              <button 
                                onClick={() => handleDownloadPdf(quote.id)}
                                disabled={downloadingPdf === quote.id}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                              >
                                {downloadingPdf === quote.id ? (
                                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : <FiFileText className="text-sm" />}
                                PDF
                              </button>
                              <button 
                                onClick={() => handleApprove(quote.id)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-xs font-medium transition-colors"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleReject(quote.id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-xs font-medium transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Desktop/Tablet View - Table Layout */}
                      {/* Desktop/Tablet View - Table Layout */}
                      <tr key={`desktop-${quote.id}`} className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-4 py-3">
                          <span className="font-bold text-blue-400 text-sm">{quote.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FiUser className="text-purple-300" />
                            <div>
                              <div className="text-purple-300 text-sm font-medium">{quote.user?.name || quote.salesperson || 'N/A'}</div>
                              <div className="text-xs text-gray-400">ID: #{quote.user_id || quote.salesperson_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white text-sm">{quote.client_name || quote.customer}</div>
                          <div className="text-xs text-gray-400">{quote.client_email || quote.email}</div>
                          {quote.description && <div className="text-xs text-gray-500 mt-1">{quote.description}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-green-400 font-medium text-sm">{quote.service_name || quote.service || 'N/A'}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-sm">
                          {quote.quotation_date || quote.created_at?.split('T')[0] || 'N/A'}
                        </td>
                        <td className="px-4 py-3 font-bold text-white text-sm">Rs. {parseFloat(quote.final_amount || quote.total_amount || 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className="px-3 py-1 rounded-full text-xs font-medium border bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                              Pending
                            </span>
                            {quote.rejection_history?.length > 0 && (
                              <span className="text-[10px] text-blue-400 font-bold ml-1 animate-pulse">
                                (Revised)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button 
                                onClick={() => handleApprove(quote.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                                title="Approve Quotation"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleReject(quote.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                                title="Reject Quotation"
                              >
                                Reject
                              </button>
                            <button 
                              onClick={() => handleDownloadPdf(quote.id)}
                              disabled={downloadingPdf === quote.id}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1"
                              title="Download PDF"
                            >
                              {downloadingPdf === quote.id ? (
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : <FiFileText />}
                              PDF
                            </button>
                            <button 
                              onClick={() => navigate(`/create-quotation`, { state: { editQuotation: quote } })}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Edit/View Details"
                            >
                              View
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
                {pendingQuotations.length > 0 
                  ? (pendingQuotations.reduce((sum, q) => {
                      const days = Math.floor((new Date() - new Date(q.created_at || new Date())) / (1000 * 60 * 60 * 24));
                      return sum + days;
                    }, 0) / pendingQuotations.length).toFixed(1)
                  : "0.0"}
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
      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
                <p className="text-xs text-gray-500 mt-2">
                  This reason will be visible to the salesperson.
                </p>
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
  );
};

export default Pending;