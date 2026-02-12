import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SalespersonNavbar from "../../../components/SalespersonNavbar";
import API from "../../../api/api";

const RejectedQuotations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectedQuotations, setRejectedQuotations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRejectedQuotations();
  }, []);

  const fetchRejectedQuotations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the salesperson ID from the profile
      const profileResponse = await API.get("/profile");
      if (profileResponse.data.success) {
        const salespersonId = profileResponse.data.profile.id;
        
        // Fetch rejected quotations
        // const response = await API.get(`/quotations/${salespersonId}/reject`);
        const response = { data: { quotations: [] } };
        
        if (response.data) {
          const quotations = response.data.quotations || response.data.data || response.data || [];
          setRejectedQuotations(Array.isArray(quotations) ? quotations : []);
        }
      }
    } catch (err) {
      console.error("Error fetching rejected quotations:", err);
      setError("Failed to load rejected quotations");
    } finally {
      setLoading(false);
    }
  };

  const getRejectionColor = (reason) => {
    if (!reason) return 'bg-gray-500/20 text-gray-300';
    const r = reason.toLowerCase();
    if (r.includes('budget')) return 'bg-red-500/20 text-red-300';
    if (r.includes('timeline')) return 'bg-orange-500/20 text-orange-300';
    if (r.includes('scope')) return 'bg-purple-500/20 text-purple-300';
    if (r.includes('requirements')) return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-gray-500/20 text-gray-300';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <SalespersonNavbar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 lg:ml-64 lg:-mt-135 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
        {/* Mobile Top Bar Spacer */}
        <div className="h-16 lg:h-0"></div>
        
        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:pt-2">
          {/* Header */}
          <div className="mb-6 lg:mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold">
                Rejected Quotations
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base lg:text-sm">
                List of all your rejected quotations
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400">
              ⚠️ {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Table Container */}
              <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead className="bg-gray-700 hidden sm:table-header-group">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">ID</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Customer</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Service</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Rejected Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Amount</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Reason</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Actions</th>
                      </tr>
                    </thead>
                    
                    <thead className="bg-gray-700 sm:hidden">
                      <tr>
                        <th colSpan="2" className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                          Rejected Quotations
                        </th>
                      </tr>
                    </thead>
                    
                    <tbody>
                      {rejectedQuotations.map((quote) => (
                        <React.Fragment key={quote.id}>
                          {/* Mobile View */}
                          <tr className="sm:hidden border-b border-gray-700">
                            <td colSpan="2" className="p-4">
                              <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-bold text-red-400">QT-{quote.id}</span>
                                    <h3 className="font-semibold text-white mt-1">
                                      {quote.customer_name || quote.customer || 'N/A'}
                                    </h3>
                                  </div>
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                                    Rejected
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-gray-400 text-xs">Service</p>
                                    <p className="text-blue-400 text-sm">{quote.service || quote.title || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400 text-xs">Amount</p>
                                    <p className="font-bold text-white text-sm">
                                      ${quote.total_amount || quote.amount || '0'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-gray-400 text-xs">Quotation Date</p>
                                    <p className="text-gray-300 text-sm">{formatDate(quote.created_at)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400 text-xs">Rejected Date</p>
                                    <p className="text-red-300 text-sm font-medium">
                                      {formatDate(quote.rejected_at || quote.updated_at)}
                                    </p>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-gray-400 text-xs">Reason</p>
                                  <p className={`px-3 py-1 rounded text-sm mt-1 ${getRejectionColor(quote.rejection_reason || quote.reason)}`}>
                                    {quote.rejection_reason || quote.reason || 'No reason provided'}
                                  </p>
                                </div>
                                
                                <div className="flex gap-2 pt-2">
                                  <button 
                                    onClick={() => navigate(`/quotation/${quote.id}`)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition-colors"
                                  >
                                    View
                                  </button>
                                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium transition-colors">
                                    Resubmit
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                          
                          {/* Desktop View */}
                          <tr className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                            <td className="px-4 py-3">
                              <span className="font-bold text-red-400 text-sm">QT-{quote.id}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-semibold text-white text-sm">
                                {quote.customer_name || quote.customer || 'N/A'}
                              </div>
                              <div className="text-xs text-gray-400">
                                {quote.customer_email || quote.email || 'N/A'}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-blue-400 font-medium text-sm">
                                {quote.service || quote.title || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-300 text-sm">
                              {formatDate(quote.created_at)}
                            </td>
                            <td className="px-4 py-3 text-red-300 text-sm font-medium">
                              {formatDate(quote.rejected_at || quote.updated_at)}
                            </td>
                            <td className="px-4 py-3 font-bold text-white text-sm">
                              ${quote.total_amount || quote.amount || '0'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded text-xs font-medium ${getRejectionColor(quote.rejection_reason || quote.reason)}`}>
                                {quote.rejection_reason || quote.reason || 'No reason provided'}
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
                                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                                  Resubmit
                                </button>
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {rejectedQuotations.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="text-3xl mb-4">📄</div>
                    <p className="text-gray-400">No rejected quotations found</p>
                    <p className="text-gray-500 text-sm mt-2">All your rejected quotations will appear here</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
                <p className="text-gray-400 text-sm">
                  Showing {rejectedQuotations.length} rejected quotations
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
      </div>
    </div>
  );
};

export default RejectedQuotations;