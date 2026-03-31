import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SuperAdminNavbar from "../../../components/SuperAdminNavbar";
import {
  FiSearch,
  FiX,
  FiFileText,
  FiUser,
  FiClock,
  FiAlertCircle,
  FiCheck,
  FiCheckCircle,
} from "react-icons/fi";
import API, { getQuotations, generateQuotationPdf } from "../../../api/api";

const AcceptedList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  // Modal States
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(null);

  // Highlight support from notification click
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightId, setHighlightId] = useState(null);
  const highlightRef = useRef(null);

  useEffect(() => {
    const hId = searchParams.get('highlight');
    if (hId) {
      setHighlightId(String(hId));
      searchParams.delete('highlight');
      setSearchParams(searchParams, { replace: true });
      const timer = setTimeout(() => setHighlightId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (highlightId && highlightRef.current) {
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [highlightId, quotations]);

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

  useEffect(() => {
    fetchApprovedQuotations();
  }, []);

  const fetchApprovedQuotations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const quotesRes = await getQuotations();

      if (quotesRes.data) {
        const allQuotes = quotesRes.data.data || quotesRes.data.quotations || quotesRes.data || [];
        setTotalCount(allQuotes.length);
        
        // Filter for approved status
        let approvedQuotes = allQuotes.filter(quote => {
          const status = (quote.status || "").toLowerCase();
          return status === 'approved' || status === 'accepted' || status === 'win';
        });

        // Sort highlightId to the top
        if (highlightId) {
          approvedQuotes.sort((a, b) => {
            if (String(a.id) === highlightId) return -1;
            if (String(b.id) === highlightId) return 1;
            return 0;
          });
        }

        setQuotations(approvedQuotes);
      }
    } catch (err) {
      console.error("Error fetching approved quotations:", err);
      setError("Failed to load approved quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (highlightId && quotations.length > 0 && !showDetailsModal) {
      const targetQuote = quotations.find(q => String(q.id) === highlightId);
      if (targetQuote) {
        setSelectedQuotation(targetQuote);
        setShowDetailsModal(true);
      }
    }
  }, [highlightId, quotations]);

  const approvedQuotations = quotations;

  // Filter quotations based on search
  const filteredQuotations = useMemo(() => {
    if (!searchQuery) return approvedQuotations;

    const query = searchQuery.toLowerCase();
    return approvedQuotations.filter((quote) => {
      const customerName = getVal(quote.client || quote.customer, 'name') || quote.client_name || '';
      const customerEmail = getVal(quote.client || quote.customer, 'email') || quote.client_email || '';
      const salesperson = getVal(quote.user || quote.salesperson, 'name') || '';

      return (
        customerName.toLowerCase().includes(query) ||
        customerEmail.toLowerCase().includes(query) ||
        salesperson.toLowerCase().includes(query) ||
        String(quote.id).includes(query)
      );
    });
  }, [approvedQuotations, searchQuery]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <SuperAdminNavbar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 lg:ml-64 lg:-mt-135 ${sidebarOpen ? "overflow-hidden" : ""}`}
      >
        {/* Mobile Top Spacer */}
        <div className="h-16 lg:h-0"></div>

        {/* Content Container */}
        <div className={`p-4 sm:p-6 lg:pt-0 ${sidebarOpen ? "overflow-hidden" : ""}`}>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Loading approved quotations...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={fetchApprovedQuotations}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
              {/* Left Text */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-green-400">Approved Quotations</h1>
                <p className="text-gray-400 mt-1">
                  Review all quotations that have been approved by the management
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
              <p className="text-gray-400 text-sm sm:text-base">Total Approved</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-green-400 mt-1 sm:mt-2">{approvedQuotations.length}</h2>
              <p className="text-green-500 text-xs sm:text-sm mt-1 flex items-center gap-1"><FiCheck /> Fully vetted</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">High Priority</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                {approvedQuotations.filter(q => (q.priority || "").toLowerCase() === 'high').length}
              </h2>
              <p className="text-red-400 text-xs sm:text-sm mt-1">Key accounts</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">Total Value</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                Rs. {approvedQuotations.reduce((sum, q) => sum + parseFloat(q.final_amount || q.total_amount || 0), 0).toLocaleString()}
              </h2>
              <p className="text-purple-400 text-xs sm:text-sm mt-1">Approved amount</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">Approval Rate</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                {quotations.length > 0 && totalCount > 0 
                  ? `${((quotations.length / totalCount) * 100).toFixed(1)}%` 
                  : "0.0%"}
              </h2>
              <p className="text-blue-400 text-xs sm:text-sm mt-1">Of total submissions</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-4 mb-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search approved quotations by customer, ID, service, or salesperson..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm">
              Showing {filteredQuotations.length} of {approvedQuotations.length}{" "}
              approved quotations
            </p>
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
                    <th
                      colSpan="2"
                      className="px-4 py-3 text-left font-semibold text-gray-300 text-sm"
                    >
                      Approved Quotations ({filteredQuotations.length})
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredQuotations.map((quote) => (
                    <React.Fragment key={quote.id}>
                      {/* Mobile View - Card Layout */}
                      <tr className={`sm:hidden border-b border-gray-700 ${String(quote.id) === highlightId ? 'quotation-highlight' : ''}`} ref={String(quote.id) === highlightId ? highlightRef : null}>
                        <td colSpan="2" className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-blue-400">{quote.id}</span>
                                <h3 className="font-semibold text-white mt-1">{getVal(quote.client || quote.customer, 'name') || quote.client_name || 'N/A'}</h3>
                                <p className="text-gray-400 text-sm">{getVal(quote.client || quote.customer, 'email') || quote.client_email || 'N/A'}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(quote.priority || 'medium')} flex items-center gap-1`}>
                                {(quote.priority || 'medium').charAt(0).toUpperCase() + (quote.priority || 'medium').slice(1)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <FiUser className="text-purple-300 text-xs" />
                              <p className="text-purple-300 text-sm font-medium">{getVal(quote.user || quote.salesperson, 'name')}</p>
                            </div>

                            <div className="flex justify-between items-center">
                              <p className="font-bold text-white text-sm">Rs. {parseFloat(quote.final_amount || quote.total_amount || 0).toLocaleString()}</p>
                              <p className="text-green-400 text-xs flex items-center gap-1">
                                <FiCheck size={12} /> Approved
                              </p>
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
                      <tr className={`hidden sm:table-row hover:bg-gray-750 transition-colors duration-200 ${String(quote.id) === highlightId ? 'quotation-highlight' : ''}`} ref={String(quote.id) === highlightId ? highlightRef : null}>
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
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20 w-fit flex items-center gap-1">
                            <FiCheck size={10} /> Approved
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
                            >
                                Details
                            </button>
                            <button 
                                onClick={() => handleViewPdf(quote.id)}
                                disabled={downloadingPdf === quote.id}
                                className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 flex items-center gap-1"
                            >
                                {downloadingPdf === quote.id ? (
                                  <div className="w-3 h-3 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                                ) : <FiFileText size={14} />}
                                PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredQuotations.length === 0 && (
              <div className="text-center py-12">
                <FiCheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No approved quotations found</p>
              </div>
            )}
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
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                          {selectedQuotation.status || 'Approved'}
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
                <div className="flex justify-end">
                  <button
                    onClick={() => handleViewPdf(selectedQuotation.id)}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <FiFileText size={16} />
                    Download PDF
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

export default AcceptedList;