import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SalespersonNavbar from "../../../components/SalespersonNavbar";

const PendingQuotations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Dummy data for pending quotations
  const pendingQuotations = [
    {
      id: 'QT-030',
      customer: 'Thomas Moore',
      email: 'thomas@email.com',
      service: 'Web Development',
      date: '2024-01-20',
      amount: '$3,500',
      submittedDate: '2024-01-20',
      expectedResponse: '2024-01-27',
      status: 'Pending'
    },
    {
      id: 'QT-031',
      customer: 'Jennifer Lee',
      email: 'jennifer@email.com',
      service: 'Mobile App',
      date: '2024-01-18',
      amount: '$4,800',
      submittedDate: '2024-01-18',
      expectedResponse: '2024-01-25',
      status: 'Pending'
    },
    {
      id: 'QT-032',
      customer: 'Christopher Taylor',
      email: 'chris@email.com',
      service: 'E-commerce Platform',
      date: '2024-01-15',
      amount: '$6,200',
      submittedDate: '2024-01-15',
      expectedResponse: '2024-01-22',
      status: 'Pending'
    },
    {
      id: 'QT-033',
      customer: 'Amanda Clark',
      email: 'amanda@email.com',
      service: 'UI/UX Design',
      date: '2024-01-12',
      amount: '$2,500',
      submittedDate: '2024-01-12',
      expectedResponse: '2024-01-19',
      status: 'Pending'
    },
    {
      id: 'QT-034',
      customer: 'Kevin Martinez',
      email: 'kevin@email.com',
      service: 'SEO Optimization',
      date: '2024-01-10',
      amount: '$1,800',
      submittedDate: '2024-01-10',
      expectedResponse: '2024-01-17',
      status: 'Pending'
    },
  ];

  // Calculate days remaining for expected response
  const calculateDaysRemaining = (expectedDate) => {
    const today = new Date();
    const expected = new Date(expectedDate);
    const diffTime = expected - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysColor = (days) => {
    if (days <= 1) return 'bg-red-500/20 text-red-300';
    if (days <= 3) return 'bg-orange-500/20 text-orange-300';
    if (days <= 5) return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-blue-500/20 text-blue-300';
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <SalespersonNavbar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content - Fixed desktop spacing */}
      <div className={`transition-all duration-300 lg:ml-64 lg:-mt-135 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
        {/* Mobile Top Bar Spacer */}
        <div className="h-16 lg:h-0"></div>
        
        {/* Content Container */}
        <div className={`p-4 sm:p-6 lg:pt-0 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
          
          <div className="mb-6 lg:mb-4 flex items-center justify-between">
            {/* Left side: Header text */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold">
                Pending Quotations
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base lg:text-sm">
                List of all your pending quotations under review
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


          {/* Table Container */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                {/* Mobile view - simplified table */}
                <thead className="bg-gray-700 hidden sm:table-header-group">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Service</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Submitted Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Expected Response</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Days Remaining</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Actions</th>
                  </tr>
                </thead>
                
                {/* Mobile Headers - visible only on mobile */}
                <thead className="bg-gray-700 sm:hidden">
                  <tr>
                    <th colSpan="2" className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Pending Quotations
                    </th>
                  </tr>
                </thead>
                
                <tbody>
                  {pendingQuotations.map((quote) => {
                    const daysRemaining = calculateDaysRemaining(quote.expectedResponse);
                    
                    return (
                      <>
                        {/* Mobile View - Card Layout */}
                        <tr key={`mobile-${quote.id}`} className="sm:hidden border-b border-gray-700">
                          <td colSpan="2" className="p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-bold text-yellow-400">{quote.id}</span>
                                  <h3 className="font-semibold text-white mt-1">{quote.customer}</h3>
                                  <p className="text-gray-400 text-sm">{quote.email}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300`}>
                                  Pending
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
                                  <p className="text-gray-400 text-xs">Submitted Date</p>
                                  <p className="text-gray-300 text-sm">{quote.submittedDate}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs">Expected Response</p>
                                  <p className="text-yellow-300 text-sm font-medium">{quote.expectedResponse}</p>
                                </div>
                              </div>
                              
                              {/* Days Remaining - Mobile */}
                              <div>
                                <p className="text-gray-400 text-xs">Days Remaining</p>
                                <p className={`px-3 py-1 rounded text-sm mt-1 ${getDaysColor(daysRemaining)}`}>
                                  {daysRemaining > 0 ? `${daysRemaining} days` : 'Due today'}
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
                                  Edit
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Desktop/Tablet View - Table Layout */}
                        <tr key={`desktop-${quote.id}`} className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                          <td className="px-4 py-3">
                            <span className="font-bold text-yellow-400 text-sm">{quote.id}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-white text-sm">{quote.customer}</div>
                            <div className="text-xs text-gray-400">{quote.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-blue-400 font-medium text-sm">{quote.service}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{quote.submittedDate}</td>
                          <td className="px-4 py-3 text-yellow-300 text-sm font-medium">{quote.expectedResponse}</td>
                          <td className="px-4 py-3 font-bold text-white text-sm">{quote.amount}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded text-xs font-medium ${getDaysColor(daysRemaining)}`}>
                              {daysRemaining > 0 ? `${daysRemaining} days` : 'Due today'}
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
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pendingQuotations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-3xl mb-4">📄</div>
                <p className="text-gray-400">No pending quotations found</p>
                <p className="text-gray-500 text-sm mt-2">All your pending quotations under review will appear here</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
            <p className="text-gray-400 text-sm">
              Showing {pendingQuotations.length} pending quotations
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

export default PendingQuotations;