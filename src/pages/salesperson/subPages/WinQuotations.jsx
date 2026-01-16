import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SalespersonNavbar from "../../../components/SalespersonNavbar";

const WinQuotations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Dummy data for win quotations (approved + payment completed)
  const winQuotations = [
    {
      id: 'QT-008',
      customer: 'Michael Brown',
      email: 'michael@email.com',
      service: 'Mobile App',
      date: '2024-01-08',
      amount: '$3,200',
      approvedDate: '2024-01-10',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2024-01-12',
      paymentStatus: 'Completed',
      projectStatus: 'Delivered'
    },
    {
      id: 'QT-015',
      customer: 'David Wilson',
      email: 'david@email.com',
      service: 'SEO Optimization',
      date: '2024-01-02',
      amount: '$1,200',
      approvedDate: '2024-01-04',
      paymentMethod: 'Cash',
      paymentDate: '2024-01-05',
      paymentStatus: 'Completed',
      projectStatus: 'Completed'
    },
    {
      id: 'QT-020',
      customer: 'Jessica Taylor',
      email: 'jessica@email.com',
      service: 'Web Development',
      date: '2023-12-20',
      amount: '$5,500',
      approvedDate: '2023-12-22',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2023-12-25',
      paymentStatus: 'Completed',
      projectStatus: 'In Progress'
    },
    {
      id: 'QT-024',
      customer: 'Brian Clark',
      email: 'brian@email.com',
      service: 'E-commerce Platform',
      date: '2023-12-15',
      amount: '$8,000',
      approvedDate: '2023-12-18',
      paymentMethod: 'Cash',
      paymentDate: '2023-12-20',
      paymentStatus: 'Completed',
      projectStatus: 'Completed'
    },
    {
      id: 'QT-027',
      customer: 'Olivia Martinez',
      email: 'olivia@email.com',
      service: 'UI/UX Design',
      date: '2023-12-10',
      amount: '$3,800',
      approvedDate: '2023-12-12',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2023-12-14',
      paymentStatus: 'Completed',
      projectStatus: 'Delivered'
    },
  ];

  // Calculate total win amount
  const calculateTotalWinAmount = () => {
    const total = winQuotations.reduce((sum, quote) => {
      const amount = parseFloat(quote.amount.replace('$', '').replace(',', ''));
      return sum + amount;
    }, 0);
    return total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'Bank Transfer':
        return 'bg-blue-500/20 text-blue-300';
      case 'Cash':
        return 'bg-green-500/20 text-green-300';
      case 'Cheque':
        return 'bg-purple-500/20 text-purple-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getProjectStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-300';
      case 'Delivered':
        return 'bg-teal-500/20 text-teal-300';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-300';
      case 'Planning':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <SalespersonNavbar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content - Fixed desktop spacing */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64 lg:-mt-135`}>
        {/* Mobile Top Bar Spacer */}
        <div className="h-16 lg:h-0"></div>
        
        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:pt-0">
          
          <div className="mb-6 lg:mb-4 flex items-center justify-between">
            {/* Left side: Header text */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold">
                Win Quotations
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base lg:text-sm">
                Approved quotations with completed payments
              </p>
            </div>

            {/* Right side: Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
          </div>


          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm sm:text-base">Total Wins</p>
                  <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2 text-teal-400">
                    {winQuotations.length}
                  </h2>
                  <p className="text-teal-400 text-xs sm:text-sm mt-1">Completed deals</p>
                </div>
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-teal-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-2xl">
                  🏆
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm sm:text-base">Total Revenue</p>
                  <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2 text-blue-400">
                    {calculateTotalWinAmount()}
                  </h2>
                  <p className="text-blue-400 text-xs sm:text-sm mt-1">Paid amount</p>
                </div>
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-2xl">
                  💰
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm sm:text-base">Avg. Win</p>
                  <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2 text-purple-400">
                    ${(winQuotations.reduce((sum, quote) => {
                      const amount = parseFloat(quote.amount.replace('$', '').replace(',', ''));
                      return sum + amount;
                    }, 0) / winQuotations.length).toFixed(0)}
                  </h2>
                  <p className="text-purple-400 text-xs sm:text-sm mt-1">Per deal</p>
                </div>
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-2xl">
                  📊
                </div>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Mobile view - simplified table */}
                <thead className="bg-gray-700 hidden sm:table-header-group">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Service</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Payment Method</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Payment Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Project Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Actions</th>
                  </tr>
                </thead>
                
                {/* Mobile Headers */}
                <thead className="bg-gray-700 sm:hidden">
                  <tr>
                    <th colSpan="2" className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Win Quotations ({winQuotations.length})
                    </th>
                  </tr>
                </thead>
                
                <tbody>
                  {winQuotations.map((quote) => (
                    <>
                      {/* Mobile View - Card Layout */}
                      <tr key={`mobile-${quote.id}`} className="sm:hidden border-b border-gray-700">
                        <td colSpan="2" className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-teal-400">{quote.id}</span>
                                <h3 className="font-semibold text-white mt-1">{quote.customer}</h3>
                                <p className="text-gray-400 text-sm">{quote.email}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-teal-500/20 text-teal-300`}>
                                Win
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Service</p>
                                <p className="text-blue-400 text-sm">{quote.service}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Amount</p>
                                <p className="font-bold text-white text-sm">{quote.amount}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Payment Method</p>
                                <p className={`px-2 py-1 rounded text-xs mt-1 ${getPaymentMethodColor(quote.paymentMethod)}`}>
                                  {quote.paymentMethod}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Payment Date</p>
                                <p className="text-green-300 text-sm font-medium">{quote.paymentDate}</p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-gray-400 text-xs">Project Status</p>
                              <p className={`px-3 py-1 rounded text-sm mt-1 ${getProjectStatusColor(quote.projectStatus)}`}>
                                {quote.projectStatus}
                              </p>
                            </div>
                            
                            <div className="flex gap-2 pt-2">
                              <button 
                                onClick={() => navigate(`/quotation/${quote.id}`)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition-colors"
                              >
                                View
                              </button>
                              <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded text-sm font-medium transition-colors">
                                Receipt
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Desktop/Tablet View - Table Layout */}
                      <tr key={`desktop-${quote.id}`} className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-4 py-3">
                          <span className="font-bold text-teal-400 text-sm">{quote.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white text-sm">{quote.customer}</div>
                          <div className="text-xs text-gray-400">{quote.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-blue-400 font-medium text-sm">{quote.service}</span>
                        </td>
                        <td className="px-4 py-3 font-bold text-white text-sm">{quote.amount}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${getPaymentMethodColor(quote.paymentMethod)}`}>
                            {quote.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-green-300 text-sm font-medium">{quote.paymentDate}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${getProjectStatusColor(quote.projectStatus)}`}>
                            {quote.projectStatus}
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
                            <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                              Receipt
                            </button>
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {winQuotations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-3xl mb-4">🏆</div>
                <p className="text-gray-400">No win quotations found</p>
                <p className="text-gray-500 text-sm mt-2">Approved quotations with completed payments will appear here</p>
                <p className="text-gray-500 text-xs mt-1">(Payments made outside the system via cash/bank)</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
            <p className="text-gray-400 text-sm">
              Showing {winQuotations.length} win quotations (payment completed)
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
        </div>
      </div>
    </div>
  );
};

export default WinQuotations;