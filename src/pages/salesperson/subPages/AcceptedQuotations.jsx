import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SalespersonNavbar from "../../../components/SalespersonNavbar";
import API from "../../../api/api";

const AcceptedQuotations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptedQuotations, setAcceptedQuotations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAcceptedQuotations();
  }, []);

  const fetchAcceptedQuotations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the salesperson ID from the profile
      const profileResponse = await API.get("/profile");
      if (profileResponse.data.success) {
        const salespersonId = profileResponse.data.profile.id;
        
        // Fetch approved quotations for this salesperson
        // const response = await API.get(`/quotations/${salespersonId}/approve`);
        const response = { data: { quotations: [] } };
        
        if (response.data) {
          // Handle different response structures
          const quotations = response.data.quotations || response.data.data || response.data || [];
          setAcceptedQuotations(Array.isArray(quotations) ? quotations : []);
        }
      }
    } catch (err) {
      console.error("Error fetching accepted quotations:", err);
      setError("Failed to load accepted quotations");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-300';
      case 'in progress':
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-300';
      case 'planning':
        return 'bg-purple-500/20 text-purple-300';
      case 'approved':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
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
                Approved Quotations
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base lg:text-sm">
                List of all your approved quotations
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
              <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
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
                        <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Approved Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Amount</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Status</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Actions</th>
                      </tr>
                    </thead>
                    
                    {/* Mobile Headers */}
                    <thead className="bg-gray-700 sm:hidden">
                      <tr>
                        <th colSpan="2" className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                          Approved Quotations
                        </th>
                      </tr>
                    </thead>
                    
                    <tbody>
                      {acceptedQuotations.map((quote) => (
                        <React.Fragment key={quote.id}>
                          {/* Mobile View - Card Layout */}
                          <tr className="sm:hidden border-b border-gray-700">
                            <td colSpan="2" className="p-4">
                              <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-bold text-green-400">QT-{quote.id}</span>
                                    <h3 className="font-semibold text-white mt-1">
                                      {quote.customer_name || quote.customer || 'N/A'}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                      {quote.customer_email || quote.email || 'N/A'}
                                    </p>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status || 'approved')}`}>
                                    {quote.status || 'Approved'}
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
                                    <p className="text-gray-400 text-xs">Approved Date</p>
                                    <p className="text-green-300 text-sm font-medium">
                                      {formatDate(quote.approved_at || quote.updated_at)}
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
                                </div>
                              </div>
                            </td>
                          </tr>
                          
                          {/* Desktop/Tablet View - Table Layout */}
                          <tr className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                            <td className="px-4 py-3">
                              <span className="font-bold text-green-400 text-sm">QT-{quote.id}</span>
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
                            <td className="px-4 py-3 text-green-300 text-sm font-medium">
                              {formatDate(quote.approved_at || quote.updated_at)}
                            </td>
                            <td className="px-4 py-3 font-bold text-white text-sm">
                              ${quote.total_amount || quote.amount || '0'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status || 'approved')}`}>
                                {quote.status || 'Approved'}
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
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {acceptedQuotations.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="text-3xl mb-4">📄</div>
                    <p className="text-gray-400">No approved quotations found</p>
                    <p className="text-gray-500 text-sm mt-2">All your approved quotations will appear here</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
                <p className="text-gray-400 text-sm">
                  Showing {acceptedQuotations.length} quotations
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

export default AcceptedQuotations;