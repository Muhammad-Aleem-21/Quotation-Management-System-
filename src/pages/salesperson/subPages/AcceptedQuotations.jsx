import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SalespersonNavbar from "../../../components/SalespersonNavbar";

const AcceptedQuotations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Dummy data for accepted quotations
  const acceptedQuotations = [
    {
      id: 'QT-001',
      customer: 'John Smith',
      email: 'john@email.com',
      service: 'Web Development',
      date: '2024-01-15',
      amount: '$1,500',
      acceptedDate: '2024-01-18',
      projectStatus: 'In Progress'
    },
    {
      id: 'QT-008',
      customer: 'Michael Brown',
      email: 'michael@email.com',
      service: 'Mobile App',
      date: '2024-01-08',
      amount: '$3,200',
      acceptedDate: '2024-01-10',
      projectStatus: 'Completed'
    },
    {
      id: 'QT-012',
      customer: 'Emily Johnson',
      email: 'emily@email.com',
      service: 'E-commerce Website',
      date: '2024-01-05',
      amount: '$4,500',
      acceptedDate: '2024-01-07',
      projectStatus: 'In Progress'
    },
    {
      id: 'QT-015',
      customer: 'David Wilson',
      email: 'david@email.com',
      service: 'SEO Optimization',
      date: '2024-01-02',
      amount: '$1,200',
      acceptedDate: '2024-01-04',
      projectStatus: 'Planning'
    },
    {
      id: 'QT-019',
      customer: 'Sarah Miller',
      email: 'sarah@email.com',
      service: 'UI/UX Design',
      date: '2023-12-28',
      amount: '$2,800',
      acceptedDate: '2023-12-30',
      projectStatus: 'Completed'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-300';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-300';
      case 'Planning':
        return 'bg-purple-500/20 text-purple-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <SalespersonNavbar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content - FIXED: Reduced top spacing on desktop */}
      <div className={`transition-all duration-300 lg:ml-64 lg:-mt-135 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
        {/* Mobile Top Bar Spacer - Only on mobile */}
        <div className="h-16 lg:h-0"></div> {/* Changed: lg:h-0 */}
        
        {/* Content Container - Reduced top padding on desktop */}
        <div className="p-4 sm:p-6 lg:pt-2"> {/* Changed: Added lg:pt-2 */}
          {/* Header - Reduced bottom margin on desktop */}
          {/* <div className="mb-6 lg:mb-4"> 
            <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold">Accepted Quotations</h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base lg:text-sm">List of all your approved quotations</p>
          </div> */}
          <div className="mb-6 lg:mb-4 flex items-center justify-between">
            {/* Left side: Header text */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold">
                Accepted Quotations
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base lg:text-sm">
                List of all your approved quotations
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


          {/* Table Container - No changes */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                {/* Mobile view - simplified table */}
                <thead className="bg-gray-700 hidden sm:table-header-group">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Service</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Accepted Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Actions</th>
                  </tr>
                </thead>
                
                {/* Mobile Headers - visible only on mobile */}
                <thead className="bg-gray-700 sm:hidden">
                  <tr>
                    <th colSpan="2" className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Accepted Quotations
                    </th>
                  </tr>
                </thead>
                
                <tbody>
                  {acceptedQuotations.map((quote) => (
                    <>
                      {/* Mobile View - Card Layout */}
                      <tr key={`mobile-${quote.id}`} className="sm:hidden border-b border-gray-700">
                        <td colSpan="2" className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-green-400">{quote.id}</span>
                                <h3 className="font-semibold text-white mt-1">{quote.customer}</h3>
                                <p className="text-gray-400 text-sm">{quote.email}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.projectStatus)}`}>
                                {quote.projectStatus}
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
                                <p className="text-gray-400 text-xs">Quotation Date</p>
                                <p className="text-gray-300 text-sm">{quote.date}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Accepted Date</p>
                                <p className="text-green-300 text-sm font-medium">{quote.acceptedDate}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 pt-2">
                              <button 
                                onClick={() => navigate(`/quotation/${quote.id}`)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition-colors"
                              >
                                View
                              </button>
                              <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded text-sm font-medium transition-colors">
                                Update
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Desktop/Tablet View - Table Layout */}
                      <tr key={`desktop-${quote.id}`} className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-4 py-3">
                          <span className="font-bold text-green-400 text-sm">{quote.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white text-sm">{quote.customer}</div>
                          <div className="text-xs text-gray-400">{quote.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-blue-400 font-medium text-sm">{quote.service}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-sm">{quote.date}</td>
                        <td className="px-4 py-3 text-green-300 text-sm font-medium">{quote.acceptedDate}</td>
                        <td className="px-4 py-3 font-bold text-white text-sm">{quote.amount}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.projectStatus)}`}>
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
                              Update
                            </button>
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {acceptedQuotations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-3xl mb-4">📄</div>
                <p className="text-gray-400">No accepted quotations found</p>
                <p className="text-gray-500 text-sm mt-2">All your approved quotations will appear here</p>
              </div>
            )}
          </div>

          {/* Pagination - No changes */}
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
        </div>
      </div>
    </div>
  );
};

export default AcceptedQuotations;