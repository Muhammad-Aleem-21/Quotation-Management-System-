import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerNavbar from "../../components/ManagerNavbar";
import { FiFileText, FiX, FiCheck, FiAlertCircle, FiUser } from 'react-icons/fi';
import API, { getQuotations, getTeamStats, generateQuotationPdf } from '../../api/api';

const TeamQuotations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [downloadingPdf, setDownloadingPdf] = useState(null);
  const navigate = useNavigate();

  // Rejection Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);
  const [rejecting, setRejecting] = useState(false);

  // Safe access helper to prevent object rendering error
  const getVal = (val, field) => {
    if (!val) return 'N/A';
    if (typeof val === 'object') return val[field] || 'N/A';
    return val;
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = String(user.id || "");

  useEffect(() => {
    fetchTeamQuotations();
  }, []);

  const fetchTeamQuotations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [quotesRes, statsRes] = await Promise.all([
        getQuotations(),
        getTeamStats()
      ]);

      if (quotesRes.data) {
        let allQuotes = [];
        if (Array.isArray(quotesRes.data)) {
          allQuotes = quotesRes.data;
        } else if (quotesRes.data.data && Array.isArray(quotesRes.data.data)) {
          allQuotes = quotesRes.data.data;
        } else if (quotesRes.data.quotations && Array.isArray(quotesRes.data.quotations)) {
          allQuotes = quotesRes.data.quotations;
        }

        const myTeam = statsRes.data?.dashboard_stats?.my_team || [];
        
        // Get IDs of all salespersons in this manager's team
        const teamMemberIds = Array.isArray(myTeam) 
          ? myTeam
              .filter(member => String(member.manager_id) === userId || String(member.parent_id) === userId)
              .map(member => String(member.id))
          : [];
        
        // Always include manager's own quotations
        if (!teamMemberIds.includes(userId)) teamMemberIds.push(userId);

        // Filter quotations: created by a team member
        const teamQuotes = allQuotes.filter(quote => {
          const creatorId = String(quote.user_id || quote.salesperson_id || quote.user?.id || "");
          return teamMemberIds.includes(creatorId);
        });

        setQuotations(teamQuotes);
      }
    } catch (err) {
      console.error("Error fetching team quotations:", err);
      setError("Failed to load team quotations");
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF View in New Tab
  const handleViewPdf = async (id) => {
    try {
      setDownloadingPdf(id);
      const response = await generateQuotationPdf(id);
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Note: revoked on window close or handled by browser
    } catch (err) {
      console.error("Error viewing PDF:", err);
      alert("Failed to view PDF. Please try again.");
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
          fetchTeamQuotations();
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
        rejection_reason: rejectionReason 
      });
      
      if (res.data.success) {
        alert(`Quotation ${selectedQuoteId} has been rejected.`);
        setShowRejectModal(false);
        fetchTeamQuotations();
      }
    } catch (err) {
      console.error("Error rejecting quotation:", err);
      alert("Failed to reject quotation. Please try again.");
    } finally {
      setRejecting(false);
    }
  };

  const filteredQuotations = useMemo(() => {
    if (filterStatus === 'all') return quotations;
    if (filterStatus === 'pending') {
      return quotations.filter(q => ['pending', 'submitted'].includes(q.status?.toLowerCase()));
    }
    return quotations.filter(q => q.status?.toLowerCase() === filterStatus.toLowerCase());
  }, [quotations, filterStatus]);

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "approved":
      case "accepted":
      case "win":
        return "bg-green-500/20 text-green-300";
      case "rejected":
        return "bg-red-500/20 text-red-300";
      case "pending":
      case "submitted":
        return "bg-yellow-500/20 text-yellow-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold">Team Quotations</h1>
            {filterStatus !== 'all' && (
              <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold border border-blue-600/30 flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                Filtering: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                <button onClick={() => setFilterStatus('all')} className="hover:text-white transition-colors">
                  <FiX size={14} />
                </button>
              </span>
            )}
          </div>
          <p className="text-gray-400 mt-1">
            Monitor and manage all team quotation requests
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white flex gap-2 items-center transition-colors duration-200">
          Generate Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div 
          onClick={() => setFilterStatus('all')}
          className={`cursor-pointer transition-all duration-200 rounded-xl p-4 sm:p-6 border ${filterStatus === 'all' ? 'bg-blue-600/10 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}
        >
          <p className="text-gray-400 text-sm sm:text-base">Total Quotations</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {quotations.length}
          </h2>
        </div>
        <div 
          onClick={() => setFilterStatus('pending')}
          className={`cursor-pointer transition-all duration-200 rounded-xl p-4 sm:p-6 border ${filterStatus === 'pending' ? 'bg-yellow-600/10 border-yellow-600 shadow-[0_0_15px_rgba(202,138,4,0.1)]' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}
        >
          <p className="text-gray-400 text-sm sm:text-base">Pending</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {quotations.filter((q) => ['pending', 'submitted'].includes(q.status?.toLowerCase())).length}
          </h2>
        </div>
        <div 
          onClick={() => setFilterStatus('approved')}
          className={`cursor-pointer transition-all duration-200 rounded-xl p-4 sm:p-6 border ${filterStatus === 'approved' ? 'bg-green-600/10 border-green-600 shadow-[0_0_15px_rgba(22,163,74,0.1)]' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}
        >
          <p className="text-gray-400 text-sm sm:text-base">Approved</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {quotations.filter((q) => ['approved', 'accepted'].includes(q.status?.toLowerCase())).length}
          </h2>
        </div>
        <div 
          onClick={() => setFilterStatus('win')}
          className={`cursor-pointer transition-all duration-200 rounded-xl p-4 sm:p-6 border ${filterStatus === 'win' ? 'bg-green-600/10 border-green-600 shadow-[0_0_15px_rgba(22,163,74,0.1)]' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}
        >
          <p className="text-gray-400 text-sm sm:text-base">Team Revenue</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-green-400 mt-1 sm:mt-2 truncate">
            Rs. {quotations.filter(q => q.status?.toLowerCase() === 'win').reduce((sum, q) => sum + (parseFloat(q.final_amount || q.total_amount || 0) || 0), 0).toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Team Quotations Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Salesperson</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      <p>Loading quotations...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-red-400">{error}</td>
                </tr>
              ) : filteredQuotations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-400">No {filterStatus !== 'all' ? filterStatus : 'team'} quotations found</td>
                </tr>
              ) : (
                filteredQuotations.map((quote) => {
                  return (
                    <tr key={quote.id} className="hover:bg-gray-750 transition-colors duration-200">
                      <td className="px-4 py-3">
                        <span className="font-bold text-blue-400">#{quote.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-purple-300" />
                          <div>
                            <div className="text-purple-300 text-sm font-medium">
                              {getVal(quote.user || quote.salesperson, 'name')}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">
                              ID: #{quote.user_id || quote.salesperson_id || (typeof quote.user === 'object' ? quote.user.id : '')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">
                          {getVal(quote.client || quote.customer, 'name') || quote.client_name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400 truncate max-w-[150px]">
                          {getVal(quote.client || quote.customer, 'email') || quote.client_email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {quote.quotation_date || (quote.created_at ? quote.created_at.split('T')[0] : 'N/A')}
                      </td>
                      <td className="px-4 py-3 font-bold text-white">
                        Rs. {parseFloat(quote.final_amount || quote.total_amount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(quote.status)}`}>
                          {['pending', 'submitted'].includes(quote.status?.toLowerCase()) ? 'Pending' : (quote.status || 'Pending')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Review information before approval or rejection</p>
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
                        {typeof selectedQuotation.status === 'string' ? selectedQuotation.status : 'Pending'}
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

              {/* Items List (if available) */}
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

                {['pending', 'submitted'].includes(selectedQuotation.status?.toLowerCase()) ? (
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

export default TeamQuotations;
