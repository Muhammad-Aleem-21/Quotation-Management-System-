import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiSave, FiAlertCircle, FiSearch } from 'react-icons/fi';
import { getQuotations, submitDraftQuotation, generateQuotationPdf } from '../../api/api';

const MyQuotations = () => {
  const navigate = useNavigate(); 
  const tableRef = useRef(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'approved', 'win', 'pending', 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
//   const [selectedQuotation, setSelectedQuotation] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Attempting to fetch quotations...");
      const res = await getQuotations();
      console.log("API Response received:", res);

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
      
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const currentUserId = user ? String(user.id || user.ID || "") : "";

      if (currentUserId && rawData.length > 0) {
        const filtered = rawData.filter(q => {
          const uid = String(q.user_id || q.salesperson_id || q.created_by || q.user?.id || "");
          return uid === currentUserId;
        });
        setQuotations(filtered.length === 0 ? rawData : filtered);
      } else {
        setQuotations(rawData);
      }
    } catch (err) {
      console.error("Error fetching quotations:", err);
      setError("Could not load quotations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // Calculate total sales from approved quotations
  const calculateTotalSales = () => {
    const approvedQuotations = quotations.filter(q => q.status === 'Approved' || q.status === 'accepted' || q.status === 'win');
    const total = approvedQuotations.reduce((sum, quote) => {
      const amount = parseFloat(quote.final_amount || quote.total_amount || 0) || 0;
      return sum + amount;
    }, 0);
    return total.toLocaleString('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

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
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const handleEdit = (quote) => {
    navigate('/create-quotation', { state: { editQuotation: quote } });
  };

  const handleResubmit = (quote) => {
    navigate('/create-quotation', { state: { editQuotation: quote, isResubmit: true } });
  };

  const handleSubmitDraft = async (id) => {
    if (!window.confirm("Are you sure you want to submit this draft quotation?")) return;
    
    try {
      setSubmittingId(id);
      const res = await submitDraftQuotation(id, { status: 'pending' });
      if (res.status === 200 || res.data?.success) {
        alert("Quotation submitted successfully!");
        fetchQuotations(); // Refresh list
      } else {
        throw new Error(res.data?.message || "Submission failed");
      }
    } catch (err) {
      console.error("Error submitting draft:", err);
      alert("Failed to submit quotation: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingId(null);
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

      console.log("PDF response status:", res.status);
      console.log("PDF response content-type:", res.headers.get('content-type'));

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

//   const handleCloseModal = () => {
//     setIsEditModalOpen(false);
//     setSelectedQuotation(null);
//   };

  const filteredQuotations = quotations.filter(quote => {
    // 1. Status Filter
    const s = (quote.status || '').toLowerCase();
    let statusMatch = true;
    if (filterStatus === 'approved') statusMatch = ['approved', 'accepted'].includes(s);
    else if (filterStatus === 'win') statusMatch = s === 'win';
    else if (filterStatus === 'pending') statusMatch = ['pending', 'submitted'].includes(s);
    else if (filterStatus === 'rejected') statusMatch = s === 'rejected';

    if (!statusMatch) return false;

    // 2. Search Query Filter
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
        <p className="text-gray-400 mt-1">Manage and track all your quotation requests</p>
      </div>

      {/* Stats Summary - 3 cards per line (2 lines) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* First Row - 3 cards */}
        
        {/* Total Quotations Card */}
        
        <div 
          className={`bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${filterStatus === 'all' ? 'border-blue-500 bg-gray-750' : 'border-gray-700'} hover:border-blue-500 transition-colors duration-200 cursor-pointer`}
          onClick={() => {
            setFilterStatus('all');
            if (tableRef.current) {
              tableRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Total</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{quotations.length}</h2>
              <p className="text-blue-400 text-xs sm:text-sm mt-1">Click to view list →</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              📄
            </div>
          </div>
        </div>
        
        {/* Total Sales Card */}
        {/* <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Total Sales</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                {calculateTotalSales()}
              </h2>
              <p className="text-purple-400 text-xs sm:text-sm mt-1">Approved only</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              💰
            </div>
          </div>
        </div> */}
        {/* ////// */}
        {/* <div 
          className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700 hover:border-purple-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/win-quotations')}
         >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Total Sales</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                {calculateTotalSales()}
              </h2>
              <p className="text-purple-400 text-xs sm:text-sm mt-1">Click to view win →</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              💰
            </div>
          </div>
        </div> */}
        
        {/* Approved Card */}
        <div 
          className={`bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${filterStatus === 'approved' ? 'border-green-500 bg-gray-750' : 'border-gray-700'} hover:border-green-500 transition-colors duration-200 cursor-pointer`}
          onClick={() => {
            setFilterStatus('approved');
            if (tableRef.current) {
              tableRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Approved</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                {quotations.filter(q => ['approved', 'accepted'].includes((q.status || '').toLowerCase())).length}
              </h2>
              <p className="text-green-400 text-xs sm:text-sm mt-1">Click to view →</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              ✓
            </div>
          </div>
        </div>

        {/* Second Row - 3 cards */}
        
        {/* Win Quotations Card - Simple Card */}
        {/* <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Win Quotations</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                0
              </h2>
              <p className="text-teal-400 text-xs sm:text-sm mt-1">Coming soon</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              🏆
            </div>
          </div>
        </div> */}
        <div 
          className={`bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${filterStatus === 'win' ? 'border-teal-500 bg-gray-750' : 'border-gray-700'} hover:border-teal-500 transition-colors duration-200 cursor-pointer`}
          onClick={() => {
            setFilterStatus('win');
            if (tableRef.current) {
              tableRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Win Quotations</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                {quotations.filter(q => (q.status || '').toLowerCase() === 'win').length}
              </h2>
              <p className="text-teal-400 text-xs sm:text-sm mt-1">Click to view →</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              🏆
            </div>
          </div>
        </div>
        
        {/* Pending Card */}
        <div 
          className={`bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${filterStatus === 'pending' ? 'border-yellow-500 bg-gray-750' : 'border-gray-700'} hover:border-yellow-500 transition-colors duration-200 cursor-pointer`}
          onClick={() => {
            setFilterStatus('pending');
            if (tableRef.current) {
              tableRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Pending</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                {quotations.filter(q => ['pending', 'submitted'].includes((q.status || '').toLowerCase())).length}
              </h2>
              <p className="text-yellow-400 text-xs sm:text-sm mt-1">Click to view →</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              ⏳
            </div>
          </div>
        </div>
        
        {/* Rejected Card */}
        <div 
          className={`bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${filterStatus === 'rejected' ? 'border-red-500 bg-gray-750' : 'border-gray-700'} hover:border-red-500 transition-colors duration-200 cursor-pointer`}
          onClick={() => {
            setFilterStatus('rejected');
            if (tableRef.current) {
              tableRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Rejected</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                {quotations.filter(q => (q.status || '').toLowerCase() === 'rejected').length}
              </h2>
              <p className="text-red-400 text-xs sm:text-sm mt-1">Click to view →</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              ✗
            </div>
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

      {/* Table Container */}
      <div className="bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 shadow-lg overflow-hidden"
           ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">

            {/* Table Header */}
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
            
            {/* Table Body */}
            <tbody className="divide-y divide-gray-700">
              {filteredQuotations.map((quote) => (
                <tr 
                  key={quote.id} 
                  className="hover:bg-gray-750 transition-colors duration-200"
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
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium w-fit ${getStatusColor(quote.status)}`}>
                        {['pending', 'submitted'].includes(quote.status?.toLowerCase()) ? 'Pending' : (quote.status || 'Pending')}
                      </span>
                      {quote.status?.toLowerCase() === 'pending' && quote.rejection_history?.length > 0 && (
                        <span className="text-[10px] sm:text-xs text-blue-400 font-bold ml-1 animate-pulse">
                          (Revised)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                        onClick={() => handleViewPdf(quote.id)}
                      >
                        View
                      </button>
                      {quote.status?.toLowerCase() === 'draft' && (
                        <div className="flex gap-2">
                          <button 
                            className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                            onClick={() => handleEdit(quote)}
                            disabled={submittingId === quote.id}
                          >
                            Edit
                          </button>
                          <button 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                            onClick={() => handleSubmitDraft(quote.id)}
                            disabled={submittingId === quote.id}
                          >
                            {submittingId === quote.id ? "Submitting..." : "Submit"}
                          </button>
                        </div>
                      )}
                      {quote.status?.toLowerCase() === 'rejected' && (
                        <button 
                          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                          onClick={() => handleResubmit(quote)}
                        >
                          Resubmit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Loading/Error/Empty State */}
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading quotations...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : quotations.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 text-base sm:text-lg">No quotations found</p>
          </div>
        ) : null}
      </div>

      {/* Pagination */}
      {!loading && !error && quotations.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 sm:mt-6">
          <p className="text-gray-400 text-sm sm:text-base">
            Showing {filteredQuotations.length} of {quotations.length} total quotations
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm">
              Previous
            </button>
            <button className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Edit Quotation Modal removed - navigating to /create-quotation instead */}
    </div>
  );
};

// const EditQuotationModal = ({ quotation, onClose, onSave }) => {
// ... removed ...
// };

export default MyQuotations;