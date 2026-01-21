import React, { useState, useMemo,} from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminNavbar from "../../../components/SuperAdminNavbar";
import { FiSearch, FiFilter, FiX, FiUser, FiDollarSign, FiCalendar, FiCheckCircle, FiChevronRight } from 'react-icons/fi';

const AcceptedList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    salesperson: 'all',
    area: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const navigate = useNavigate();

  // Dummy data for accepted quotations
  const acceptedQuotations = useMemo(() => [
    {
      id: 'QT-101',
      customer: 'TechCorp Solutions',
      salesperson: 'John Doe',
      area: 'North America',
      service: 'Website Redesign Project',
      date: '2024-01-15',
      acceptedDate: '2024-01-16',
      amount: '$15,200',
      paymentStatus: 'paid',
      status: 'completed',
      description: 'Complete website overhaul with new features'
    },
    {
      id: 'QT-102',
      customer: 'Global Logistics Inc',
      salesperson: 'Sarah M.',
      area: 'Europe',
      service: 'CRM System Implementation',
      date: '2024-01-14',
      acceptedDate: '2024-01-15',
      amount: '$8,500',
      paymentStatus: 'paid',
      status: 'completed',
      description: 'Custom CRM solution for logistics tracking'
    },
    {
      id: 'QT-103',
      customer: 'MediCare Hospital',
      salesperson: 'Mike R.',
      area: 'Asia Pacific',
      service: 'Medical Equipment Supply',
      date: '2024-01-13',
      acceptedDate: '2024-01-14',
      amount: '$22,000',
      paymentStatus: 'paid',
      status: 'completed',
      description: 'Medical devices and software integration'
    },
    {
      id: 'QT-104',
      customer: 'EduTech Innovations',
      salesperson: 'Emily T.',
      area: 'South America',
      service: 'Learning Management System',
      date: '2024-01-12',
      acceptedDate: '2024-01-13',
      amount: '$12,500',
      paymentStatus: 'paid',
      status: 'completed',
      description: 'Custom LMS platform with analytics'
    },
    {
      id: 'QT-105',
      customer: 'Green Energy Corp',
      salesperson: 'David L.',
      area: 'Middle East',
      service: 'Solar Panel Installation',
      date: '2024-01-11',
      acceptedDate: '2024-01-12',
      amount: '$18,300',
      paymentStatus: 'paid',
      status: 'completed',
      description: 'Commercial solar power system'
    },
  ], []);

  // Get unique values for filters
  const salespersons = useMemo(() => {
    const unique = [...new Set(acceptedQuotations.map(q => q.salesperson))];
    return unique;
  }, [acceptedQuotations]);

  const areas = useMemo(() => {
    const unique = [...new Set(acceptedQuotations.map(q => q.area))];
    return unique;
  }, [acceptedQuotations]);

  // Filter and sort quotations
  const filteredQuotations = useMemo(() => {
    let result = [...acceptedQuotations];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(quote =>
        quote.customer.toLowerCase().includes(query) ||
        quote.id.toLowerCase().includes(query) ||
        quote.salesperson.toLowerCase().includes(query) ||
        quote.service.toLowerCase().includes(query)
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
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(b.date) - new Date(a.date);
          break;
        case 'amount':
          comparison = parseFloat(b.amount.replace('$', '').replace(',', '')) - 
                     parseFloat(a.amount.replace('$', '').replace(',', ''));
          break;
        case 'salesperson':
          comparison = a.salesperson.localeCompare(b.salesperson);
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
  }, [acceptedQuotations, searchQuery, filters]);

  const handleQuotationClick = (quotation) => {
    setSelectedQuotation(quotation);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPaymentColor = (status) => {
    switch(status) {
      case 'paid':
        return 'bg-green-500/20 text-green-300';
      case 'unpaid':
        return 'bg-red-500/20 text-red-300';
      case 'partial':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
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
          
          {/* <div className="mb-6 flex justify-between items-start">
            
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Approved Quotations</h1>
                <p className="text-gray-400">Review all approved quotations in the system</p>
              </div>
              <button
                onClick={() => navigate(-1)} // or navigate('/admin-dashboard') if you want specific route
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>
          </div> */}
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Approved Quotations</h1>
                <p className="text-gray-400">Review all approved quotations in the system</p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors whitespace-nowrap"
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

                  {/* Sort By */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Sort By</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option value="date">Date</option>
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
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Total Accepted</p>
              <p className="text-2xl font-bold text-green-400">{acceptedQuotations.length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-blue-400">
                ${acceptedQuotations.reduce((sum, q) => sum + parseFloat(q.amount.replace('$', '').replace(',', '')), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Avg. Amount</p>
              <p className="text-2xl font-bold text-yellow-400">
                ${(acceptedQuotations.reduce((sum, q) => sum + parseFloat(q.amount.replace('$', '').replace(',', '')), 0) / acceptedQuotations.length).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Paid Quotations</p>
              <p className="text-2xl font-bold text-purple-400">
                {acceptedQuotations.filter(q => q.paymentStatus === 'paid').length}
              </p>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              Showing {filteredQuotations.length} of {acceptedQuotations.length} accepted quotations
            </p>
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
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm">Payment</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-300 text-sm"></th>
                  </tr>
                </thead>
                
                {/* Mobile Headers */}
                <thead className="bg-gray-700 sm:hidden">
                  <tr>
                    <th colSpan="2" className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Accepted Quotations ({filteredQuotations.length})
                    </th>
                  </tr>
                </thead>
                
                <tbody>
                  {filteredQuotations.map((quote) => (
                    <>
                      {/* Mobile View - Card Layout */}
                      <tr key={`mobile-${quote.id}`} className="sm:hidden border-b border-gray-700 hover:bg-gray-750 transition-colors duration-200">
                        <td colSpan="2" className="p-4">
                          <div 
                            className="space-y-3 cursor-pointer"
                            onClick={() => handleQuotationClick(quote)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-blue-400">{quote.id}</h3>
                                <h4 className="font-semibold text-white mt-1">{quote.customer}</h4>
                                <p className="text-gray-400 text-sm">{quote.service}</p>
                              </div>
                              <FiChevronRight className="text-gray-400" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Salesperson</p>
                                <p className="text-purple-300 text-sm">{quote.salesperson}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Date</p>
                                <p className="text-gray-300 text-sm">{quote.date}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Amount</p>
                                <p className="font-bold text-white text-sm">{quote.amount}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Payment</p>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentColor(quote.paymentStatus)}`}>
                                  {quote.paymentStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Desktop/Tablet View - Table Layout */}
                      <tr key={`desktop-${quote.id}`} className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div 
                            className="font-bold text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
                            onClick={() => handleQuotationClick(quote)}
                          >
                            {quote.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div 
                            className="font-semibold text-white cursor-pointer hover:text-blue-300 transition-colors"
                            onClick={() => handleQuotationClick(quote)}
                          >
                            {quote.customer}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{quote.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-400 font-medium text-sm">{quote.service}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiUser className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-300 text-sm">{quote.salesperson}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{quote.area}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-300 text-sm">{quote.date}</div>
                          <div className="text-xs text-gray-500">Accepted: {quote.acceptedDate}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiDollarSign className="w-4 h-4 text-yellow-400" />
                            <span className="font-bold text-white">{quote.amount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentColor(quote.paymentStatus)}`}>
                            {quote.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleQuotationClick(quote)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <FiChevronRight className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredQuotations.length === 0 && (
              <div className="text-center py-12">
                <FiCheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No accepted quotations found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : 'No accepted quotations in the system.'}
                </p>
              </div>
            )}
          </div>

          {/* Quotation Details Modal */}
          {showDetailsModal && selectedQuotation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedQuotation.id}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedQuotation.status)}`}>
                          {selectedQuotation.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentColor(selectedQuotation.paymentStatus)}`}>
                          {selectedQuotation.paymentStatus}
                        </span>
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
                        <p className="font-medium text-lg">{selectedQuotation.customer}</p>
                      </div>
                      <div className="p-4 bg-gray-750 rounded-lg">
                        <p className="text-sm text-gray-400">Salesperson</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FiUser className="w-4 h-4 text-purple-400" />
                          <p className="font-medium">{selectedQuotation.salesperson}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{selectedQuotation.area}</p>
                      </div>
                      <div className="p-4 bg-gray-750 rounded-lg">
                        <p className="text-sm text-gray-400">Service</p>
                        <p className="font-medium text-green-400">{selectedQuotation.service}</p>
                      </div>
                      <div className="p-4 bg-gray-750 rounded-lg">
                        <p className="text-sm text-gray-400">Amount</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FiDollarSign className="w-5 h-5 text-yellow-400" />
                          <p className="font-bold text-2xl">{selectedQuotation.amount}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dates and Status */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Timeline</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-750 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FiCalendar className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-sm text-gray-400">Created Date</p>
                            <p className="font-medium">{selectedQuotation.date}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-750 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FiCheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-sm text-gray-400">Accepted Date</p>
                            <p className="font-medium">{selectedQuotation.acceptedDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Description</h3>
                    <div className="p-4 bg-gray-750 rounded-lg">
                      <p className="text-gray-300">{selectedQuotation.description}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                      View Full Details
                    </button>
                    <button className="p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors">
                      Download PDF
                    </button>
                    <button className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
                      View Payment History
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
                    Edit Quotation
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

export default AcceptedList;