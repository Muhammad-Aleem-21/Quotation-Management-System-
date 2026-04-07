import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { FiX, FiSave, FiAlertCircle, FiSearch } from 'react-icons/fi';
import { getQuotations, submitDraftQuotation, generateQuotationPdf, markQuotationAsSent } from '../../api/api';

// Format date + time for display (converts UTC from backend → local device time)
const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  // Backend sends UTC timestamps. If no timezone indicator (Z, +, -) is present,
  // append 'Z' so JavaScript interprets it as UTC before converting to local time.
  let normalized = String(dateStr).trim();
  if (!/Z|[+-]\d{2}:\d{2}$/.test(normalized)) {
    normalized = normalized.replace(' ', 'T') + 'Z';
  }
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const MyQuotations = () => {
  const navigate = useNavigate(); 
  const tableRef = useRef(null);
  const location = useLocation();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState(location.state?.filterStatus || 'all'); // 'all', 'approved', 'win', 'pending', 'rejected'
  const [searchQuery, setSearchQuery] = useState('');

  // Highlight support from notification click
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightId, setHighlightId] = useState(null);
  const highlightRowRef = useRef(null);

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
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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

      let myQuotes = rawData;
      if (currentUserId && rawData.length > 0) {
        myQuotes = rawData.filter(q => {
          const uid = String(q.user_id || q.salesperson_id || q.created_by || q.user?.id || "");
          return uid === currentUserId;
        });
        if (myQuotes.length === 0) myQuotes = rawData;
      }

      // Sort highlightId to the top
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
    if (location.state?.filterStatus && tableRef.current) {
      setTimeout(() => {
        tableRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.state]);

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

  const handleSendToClient = async (id) => {
    if (!window.confirm("Are you sure you want to send this quotation to the client?")) return;
    
    try {
      setSubmittingId(id);
      const res = await markQuotationAsSent(id);
      console.log("Mark sent response:", res);
      if (res.status === 200 || res.data?.success) {
        alert("Quotation sent to client successfully!");
        fetchQuotations(); // Refresh list
      } else {
        throw new Error(res.data?.message || "Action failed");
      }
    } catch (err) {
      console.error("Error sending to client:", err);
      alert("Failed to send quotation: " + (err.response?.data?.message || err.message));
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
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-300 text-sm sm:text-base">Service</th>
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
                  <td className="px-3 py-2 sm:px-4 sm:py-3">
                    <span className="text-green-400 font-medium text-sm sm:text-base">{quote.service_name || quote.service || 'N/A'}</span>
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-300 text-sm sm:text-base">
                    {formatDateTime(quote.quotation_date || quote.created_at)}
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
                        onClick={() => {
                          setSelectedQuotation(quote);
                          setShowDetailsModal(true);
                        }}
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
                      {quote.status?.toLowerCase() === 'approved' && (
                        <button
                          className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                          onClick={() => handleSendToClient(quote.id)}
                          disabled={submittingId === quote.id}
                        >
                          {submittingId === quote.id ? "Sending..." : "Send"}
                        </button>
                      )}
                      <button
                        className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 flex items-center gap-1"
                        onClick={() => handleViewPdf(quote.id)}
                        title="View PDF"
                      >
                        PDF
                      </button>
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
      
      {/* Quotation Details Modal */}
      {showDetailsModal && selectedQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <div className="pr-4">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                  Quotation Details <span className="text-blue-400 text-xs sm:text-sm font-mono bg-blue-400/10 px-2 py-0.5 rounded-md">#{selectedQuotation.id}</span>
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Submitted on {formatDateTime(selectedQuotation.quotation_date || selectedQuotation.created_at)}</p>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white shrink-0"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Client Info */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-[10px] sm:text-xs uppercase font-bold text-gray-500 tracking-wider">Client Information</h4>
                  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                    <p className="text-sm font-semibold text-white">{selectedQuotation.client_name || selectedQuotation.client?.name || selectedQuotation.customer || 'N/A'}</p>
                    <p className="text-xs text-gray-400 mt-1 break-all">{selectedQuotation.email || selectedQuotation.client?.email || 'N/A'}</p>
                  </div>
                </div>

                {/* Status Summary */}
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
                      <span className="text-base sm:text-lg font-bold text-white">Rs. {parseFloat(selectedQuotation.final_amount || selectedQuotation.total_amount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
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

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-700 bg-gray-800/50 flex flex-wrap gap-2 text-xs">
              <button 
                onClick={() => handleViewPdf(selectedQuotation.id)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-bold transition-all"
              >
                View PDF
              </button>
              {selectedQuotation.status?.toLowerCase() === 'rejected' && (
                <button 
                  onClick={() => handleResubmit(selectedQuotation)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold transition-all"
                >
                  Resubmit
                </button>
              )}
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

// const EditQuotationModal = ({ quotation, onClose, onSave }) => {
// ... removed ...
// };

export default MyQuotations;