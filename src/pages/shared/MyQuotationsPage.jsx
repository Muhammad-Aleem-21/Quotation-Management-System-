import { useRef, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiX, FiSearch, FiSend } from 'react-icons/fi';
import { getQuotations } from '../../api/api';

const MyQuotationsPage = () => {
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sendingId, setSendingId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightId, setHighlightId] = useState(null);
  const highlightRowRef = useRef(null);

  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
    if (highlightId && highlightRowRef.current) {
      setTimeout(() => {
        highlightRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [highlightId, quotations]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getQuotations();

      if (!res || !res.data) {
        throw new Error("Invalid API response structure.");
      }

      let rawData = [];
      if (Array.isArray(res.data)) {
        rawData = res.data;
      } else if (res.data.data && Array.isArray(res.data.data)) {
        rawData = res.data.data;
      } else if (res.data.quotations && Array.isArray(res.data.quotations)) {
        rawData = res.data.quotations;
      } else {
        const arrayKey = Object.keys(res.data).find(k => Array.isArray(res.data[k]));
        if (arrayKey) rawData = res.data[arrayKey];
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const currentUserId = String(user?.id ?? "").trim();
      const currentRole = user?.role ?? "";
      const normalizedCurrentRole = currentRole === "super-admin" ? "super_admin" : currentRole;

      const myQuotes = rawData.filter(q => {
        const createdBy = String(q.created_by ?? "").trim();
        const createdByRole = (q.created_by_role ?? "").trim();
        
        const normalizedCurrentRole = currentRole === "super-admin" ? "super_admin" : currentRole;
        const normalizedCreatedByRole = createdByRole === "super-admin" ? "super_admin" : createdByRole;

        return createdBy === currentUserId && normalizedCreatedByRole === normalizedCurrentRole;
      });

      if (highlightId) {
        myQuotes.sort((a, b) => {
          if (String(a.id) === highlightId) return -1;
          if (String(b.id) === highlightId) return 1;
          return 0;
        });
      }

      setQuotations(myQuotes);
    } catch (err) {
      console.error("Error fetching quotations:", err);
      setError("Could not load quotations.");
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

  useEffect(() => {
    fetchQuotations();
  }, []);

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-500/20 text-gray-300';
    const s = (status || "").toLowerCase();
    switch (s) {
      case 'approved':
      case 'accepted':
      case 'win':
      case 'created':
        return 'bg-green-500/20 text-green-300';
      case 'rejected':
        return 'bg-red-500/20 text-red-300';
      case 'pending':
      case 'submitted':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'sent':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const handleViewPdf = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/quotations/${id}/generate-pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("PDF generation failed:", res.status, errorText);
        alert("Failed to generate PDF. Server returned status " + res.status + ": " + errorText);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF: " + err.message);
    }
  };

  const handleSendQuotation = async (quote) => {
    // Check if quotation has already been sent
    if (quote.status?.toLowerCase() === 'sent') {
      alert('This quotation has already been sent to the client.');
      return;
    }

    // Confirm before sending
    const confirmSend = window.confirm(
      `Are you sure you want to send quotation #${quote.id} to ${quote.client_name || quote.client?.name || quote.customer}?`
    );
    
    if (!confirmSend) return;

    setSendingId(quote.id);
    
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Prepare the data to send
      const sendData = {
        quotation_id: quote.id,
        client_email: quote.email || quote.client?.email,
        client_name: quote.client_name || quote.client?.name || quote.customer,
        subject: `Quotation #${quote.id} from ${user?.name || 'Our Company'}`,
        message: `Dear ${quote.client_name || quote.client?.name || quote.customer},\n\nPlease find attached quotation #${quote.id} for your review.\n\nTotal Amount: Rs. ${parseFloat(quote.final_amount || quote.total_amount || quote.amount || 0).toLocaleString()}\n\nThank you for your business.\n\nBest regards,\n${user?.name || 'Sales Team'}`
      };

      const response = await fetch(`/api/quotations/${quote.id}/mark-sent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send quotation');
      }

      const result = await response.json();
      
      // Update the quotation status in the local state
      setQuotations(prevQuotes => 
        prevQuotes.map(q => 
          q.id === quote.id 
            ? { ...q, status: 'sent', sent_at: new Date().toISOString() }
            : q
        )
      );
      
      alert(`Quotation #${quote.id} has been sent successfully!`);
      
      // Refresh quotations to get updated status
      fetchQuotations();
      
    } catch (err) {
      console.error("Error sending quotation:", err);
      alert(`Failed to send quotation: ${err.message}`);
    } finally {
      setSendingId(null);
    }
  };

  const filteredQuotations = quotations.filter(quote => {
    const s = (quote.status || '').toLowerCase();
    let statusMatch = true;
    if (filterStatus === 'approved') statusMatch = ['approved', 'accepted'].includes(s);
    else if (filterStatus === 'win') statusMatch = s === 'win';

    if (!statusMatch) return false;

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const idMatch = String(quote.id).toLowerCase().includes(query);
      const nameMatch = (quote.client_name || quote.client?.name || quote.customer || '').toLowerCase().includes(query);
      const emailMatch = (quote.email || quote.client?.email || '').toLowerCase().includes(query);
      const amountMatch = String(parseFloat(quote.final_amount || quote.total_amount || quote.amount || 0)).includes(query);
      return idMatch || nameMatch || emailMatch || amountMatch;
    }

    return true;
  });

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">My Quotations</h1>
        <p className="text-gray-400 mt-1">Quotations created by you</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div
          className={`bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${filterStatus === 'all' ? 'border-blue-500' : 'border-gray-700'} hover:border-blue-500 transition-colors duration-200 cursor-pointer`}
          onClick={() => { setFilterStatus('all'); tableRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Total</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{quotations.length}</h2>
              <p className="text-blue-400 text-xs sm:text-sm mt-1">Click to view →</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">📄</div>
          </div>
        </div>

        <div
          className={`bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${filterStatus === 'approved' ? 'border-green-500' : 'border-gray-700'} hover:border-green-500 transition-colors duration-200 cursor-pointer`}
          onClick={() => { setFilterStatus('approved'); tableRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Approved</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                {quotations.filter(q => ['approved', 'accepted'].includes((q.status || '').toLowerCase())).length}
              </h2>
              <p className="text-green-400 text-xs sm:text-sm mt-1">Click to view →</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">✓</div>
          </div>
        </div>

        <div
          className={`bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${filterStatus === 'win' ? 'border-teal-500' : 'border-gray-700'} hover:border-teal-500 transition-colors duration-200 cursor-pointer`}
          onClick={() => { setFilterStatus('win'); tableRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Win</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                {quotations.filter(q => (q.status || '').toLowerCase() === 'win').length}
              </h2>
              <p className="text-teal-400 text-xs sm:text-sm mt-1">Click to view →</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">🏆</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, Customer Name, Email, or Amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors duration-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 shadow-lg overflow-hidden" ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-300 text-sm sm:text-base">ID</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-300 text-sm sm:text-base">Customer</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-300 text-sm sm:text-base">Date</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-300 text-sm sm:text-base">Amount</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-300 text-sm sm:text-base">Status</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-300 text-sm sm:text-base">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredQuotations.map((quote) => (
                <tr
                  key={quote.id}
                  className={`hover:bg-gray-750 transition-colors duration-200 ${String(quote.id) === highlightId ? 'quotation-highlight' : ''}`}
                  ref={String(quote.id) === highlightId ? highlightRowRef : null}
                >
                  <td className="px-3 py-2 sm:px-4 sm:py-3">
                    <span className="font-bold text-blue-400 text-sm sm:text-base">{quote.id}</span>
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3">
                    <div className="font-semibold text-white text-sm sm:text-base">
                      {quote.client_name || quote.client?.name || quote.customer || 'No Name'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">
                      {quote.email || quote.client?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-300 text-sm sm:text-base">
                    {quote.quotation_date || quote.created_at?.split('T')[0] || 'N/A'}
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 font-bold text-white text-sm sm:text-base">
                    Rs. {parseFloat(quote.final_amount || quote.total_amount || quote.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3">
                    <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium w-fit ${getStatusColor(quote.status)}`}>
                      {['pending', 'submitted'].includes(quote.status?.toLowerCase()) ? 'Pending' : 
                       quote.status?.toLowerCase() === 'sent' ? 'Sent' : 
                       (quote.status || 'Pending')}
                    </span>
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                        onClick={() => { setSelectedQuotation(quote); setShowDetailsModal(true); }}
                      >
                        View
                      </button>
                      <button
                        className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 flex items-center gap-1"
                        onClick={() => handleViewPdf(quote.id)}
                        title="View PDF"
                      >
                        PDF
                      </button>
                      <button
                        className={`${
                          quote.status?.toLowerCase() === 'sent' 
                            ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed' 
                            : 'bg-green-600/20 hover:bg-green-600/40 text-green-400'
                        } px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 flex items-center gap-1`}
                        onClick={() => handleSendQuotation(quote)}
                        disabled={sendingId === quote.id || quote.status?.toLowerCase() === 'sent'}
                        title={quote.status?.toLowerCase() === 'sent' ? 'Already sent' : 'Send to client'}
                      >
                        {sendingId === quote.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-400"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <FiSend size={12} />
                            <span>Send</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading quotations...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredQuotations.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 text-base sm:text-lg">No quotations found</p>
            <p className="text-gray-500 text-sm mt-2">Quotations you create will appear here</p>
          </div>
        ) : null}
      </div>

      {!loading && !error && quotations.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 sm:mt-6">
          <p className="text-gray-400 text-sm sm:text-base">
            Showing {filteredQuotations.length} of {quotations.length} total quotations
          </p>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 sm:p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <div className="pr-4">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                  Quotation Details
                  <span className="text-blue-400 text-xs sm:text-sm font-mono bg-blue-400/10 px-2 py-0.5 rounded-md">#{selectedQuotation.id}</span>
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                  Submitted on {selectedQuotation.quotation_date || selectedQuotation.created_at?.split('T')[0]}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white shrink-0"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-[10px] sm:text-xs uppercase font-bold text-gray-500 tracking-wider">Client Information</h4>
                  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                    <p className="text-sm font-semibold text-white">
                      {selectedQuotation.client_name || selectedQuotation.client?.name || selectedQuotation.customer || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 break-all">
                      {selectedQuotation.email || selectedQuotation.client?.email || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-[10px] sm:text-xs uppercase font-bold text-gray-500 tracking-wider">Status Summary</h4>
                  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 font-medium italic">Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(selectedQuotation.status)}`}>
                        {selectedQuotation.status || 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-700/50 pt-2">
                      <span className="text-xs text-gray-400 font-medium italic">Amount</span>
                      <span className="text-base sm:text-lg font-bold text-white">
                        Rs. {parseFloat(selectedQuotation.final_amount || selectedQuotation.total_amount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedQuotation.items && Array.isArray(selectedQuotation.items) && selectedQuotation.items.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-4">Line Items</h4>
                  <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 divide-y divide-gray-800">
                    {selectedQuotation.items.map((item, idx) => (
                      <div key={idx} className="p-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{item.product_name || 'Product'}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-white">Rs. {parseFloat(item.total_amount || 0).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-700 bg-gray-800/50 flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => handleViewPdf(selectedQuotation.id)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-bold transition-all"
              >
                View PDF
              </button>
              <button
                onClick={() => handleSendQuotation(selectedQuotation)}
                disabled={selectedQuotation.status?.toLowerCase() === 'sent' || sendingId === selectedQuotation.id}
                className={`flex-1 ${
                  selectedQuotation.status?.toLowerCase() === 'sent' 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2`}
              >
                {sendingId === selectedQuotation.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FiSend size={16} />
                    <span>Send to Client</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyQuotationsPage;