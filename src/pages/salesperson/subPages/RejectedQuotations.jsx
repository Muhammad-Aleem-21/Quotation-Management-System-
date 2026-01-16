// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import SalespersonNavbar from "../../../components/SalespersonNavbar";

// const RejectedQuotations = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   // Dummy data for rejected quotations
//   const rejectedQuotations = [
//     {
//       id: 'QT-011',
//       customer: 'Sarah Johnson',
//       email: 'sarah@email.com',
//       service: 'E-commerce',
//       date: '2024-01-05',
//       amount: '$4,500',
//       rejectedDate: '2024-01-08',
//       rejectionReason: 'Budget exceeds client limit',
//       status: 'Rejected'
//     },
//     {
//       id: 'QT-017',
//       customer: 'Robert Davis',
//       email: 'robert@email.com',
//       service: 'Mobile App',
//       date: '2023-12-20',
//       amount: '$5,200',
//       rejectedDate: '2023-12-22',
//       rejectionReason: 'Requirements not feasible',
//       status: 'Rejected'
//     },
//     {
//       id: 'QT-022',
//       customer: 'Lisa Anderson',
//       email: 'lisa@email.com',
//       service: 'Web Development',
//       date: '2023-12-15',
//       amount: '$3,800',
//       rejectedDate: '2023-12-18',
//       rejectionReason: 'Timeline too short',
//       status: 'Rejected'
//     },
//     {
//       id: 'QT-025',
//       customer: 'James Wilson',
//       email: 'james@email.com',
//       service: 'SEO Optimization',
//       date: '2023-12-10',
//       amount: '$1,500',
//       rejectedDate: '2023-12-12',
//       rejectionReason: 'Scope mismatch',
//       status: 'Rejected'
//     },
//     {
//       id: 'QT-028',
//       customer: 'Maria Garcia',
//       email: 'maria@email.com',
//       service: 'UI/UX Design',
//       date: '2023-12-05',
//       amount: '$2,200',
//       rejectedDate: '2023-12-07',
//       rejectionReason: 'Client changed priorities',
//       status: 'Rejected'
//     },
//   ];

//   const getRejectionColor = (reason) => {
//     if (reason.toLowerCase().includes('budget')) return 'bg-red-500/20 text-red-300';
//     if (reason.toLowerCase().includes('timeline')) return 'bg-orange-500/20 text-orange-300';
//     if (reason.toLowerCase().includes('scope')) return 'bg-purple-500/20 text-purple-300';
//     if (reason.toLowerCase().includes('requirements')) return 'bg-yellow-500/20 text-yellow-300';
//     return 'bg-gray-500/20 text-gray-300';
//   };

//   return (
//     <div className="bg-gray-900 min-h-screen text-white">
//       {/* Navbar */}
//       <SalespersonNavbar open={sidebarOpen} setOpen={setSidebarOpen} />
      
//       {/* Main Content */}
//       <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
//         {/* Mobile Top Bar Spacer */}
//         <div className="h-16 lg:h-0"></div>
        
//         {/* Content Container */}
//         <div className="p-4 sm:p-6 lg:pt-2">
//           {/* Header */}
//           <div className="mb-6 lg:mb-4">
//             <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold">Rejected Quotations</h1>
//             <p className="text-gray-400 mt-1 text-sm sm:text-base lg:text-sm">List of all your rejected quotations</p>
//           </div>

//           {/* Table Container */}
//           <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 shadow-lg overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 {/* Mobile view - simplified table */}
//                 <thead className="bg-gray-700 hidden sm:table-header-group">
//                   <tr>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">ID</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Customer</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Service</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Date</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Rejected Date</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Amount</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Rejection Reason</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Actions</th>
//                   </tr>
//                 </thead>
                
//                 {/* Mobile Headers - visible only on mobile */}
//                 <thead className="bg-gray-700 sm:hidden">
//                   <tr>
//                     <th colSpan="2" className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
//                       Rejected Quotations
//                     </th>
//                   </tr>
//                 </thead>
                
//                 <tbody>
//                   {rejectedQuotations.map((quote) => (
//                     <>
//                       {/* Mobile View - Card Layout */}
//                       <tr key={`mobile-${quote.id}`} className="sm:hidden border-b border-gray-700">
//                         <td colSpan="2" className="p-4">
//                           <div className="space-y-3">
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <span className="font-bold text-red-400">{quote.id}</span>
//                                 <h3 className="font-semibold text-white mt-1">{quote.customer}</h3>
//                                 <p className="text-gray-400 text-sm">{quote.email}</p>
//                               </div>
//                               <span className={`px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300`}>
//                                 Rejected
//                               </span>
//                             </div>
                            
//                             <div className="grid grid-cols-2 gap-4">
//                               <div>
//                                 <p className="text-gray-400 text-xs">Service</p>
//                                 <p className="text-blue-400 text-sm">{quote.service}</p>
//                               </div>
//                               <div>
//                                 <p className="text-gray-400 text-xs">Amount</p>
//                                 <p className="font-bold text-white text-sm">{quote.amount}</p>
//                               </div>
//                             </div>
                            
//                             <div className="grid grid-cols-2 gap-4">
//                               <div>
//                                 <p className="text-gray-400 text-xs">Quotation Date</p>
//                                 <p className="text-gray-300 text-sm">{quote.date}</p>
//                               </div>
//                               <div>
//                                 <p className="text-gray-400 text-xs">Rejected Date</p>
//                                 <p className="text-red-300 text-sm font-medium">{quote.rejectedDate}</p>
//                               </div>
//                             </div>
                            
//                             {/* Rejection Reason - Mobile */}
//                             <div>
//                               <p className="text-gray-400 text-xs">Rejection Reason</p>
//                               <p className={`px-3 py-1 rounded text-sm mt-1 ${getRejectionColor(quote.rejectionReason)}`}>
//                                 {quote.rejectionReason}
//                               </p>
//                             </div>
                            
//                             <div className="flex gap-2 pt-2">
//                               <button 
//                                 onClick={() => navigate(`/quotation/${quote.id}`)}
//                                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition-colors"
//                               >
//                                 View
//                               </button>
//                               <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium transition-colors">
//                                 Resubmit
//                               </button>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
                      
//                       {/* Desktop/Tablet View - Table Layout */}
//                       <tr key={`desktop-${quote.id}`} className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
//                         <td className="px-4 py-3">
//                           <span className="font-bold text-red-400 text-sm">{quote.id}</span>
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="font-semibold text-white text-sm">{quote.customer}</div>
//                           <div className="text-xs text-gray-400">{quote.email}</div>
//                         </td>
//                         <td className="px-4 py-3">
//                           <span className="text-blue-400 font-medium text-sm">{quote.service}</span>
//                         </td>
//                         <td className="px-4 py-3 text-gray-300 text-sm">{quote.date}</td>
//                         <td className="px-4 py-3 text-red-300 text-sm font-medium">{quote.rejectedDate}</td>
//                         <td className="px-4 py-3 font-bold text-white text-sm">{quote.amount}</td>
//                         <td className="px-4 py-3">
//                           <span className={`px-3 py-1 rounded text-xs font-medium ${getRejectionColor(quote.rejectionReason)}`}>
//                             {quote.rejectionReason}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="flex gap-2">
//                             <button 
//                               onClick={() => navigate(`/quotation/${quote.id}`)}
//                               className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
//                             >
//                               View
//                             </button>
//                             <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
//                               Resubmit
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     </>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {rejectedQuotations.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="text-3xl mb-4">📄</div>
//                 <p className="text-gray-400">No rejected quotations found</p>
//                 <p className="text-gray-500 text-sm mt-2">All your rejected quotations will appear here</p>
//               </div>
//             )}
//           </div>

//           {/* Pagination */}
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
//             <p className="text-gray-400 text-sm">
//               Showing {rejectedQuotations.length} rejected quotations
//             </p>
//             <div className="flex gap-2">
//               <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm">
//                 Previous
//               </button>
//               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RejectedQuotations;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SalespersonNavbar from "../../../components/SalespersonNavbar";

const RejectedQuotations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Dummy data for rejected quotations
  const rejectedQuotations = [
    {
      id: 'QT-011',
      customer: 'Sarah Johnson',
      email: 'sarah@email.com',
      service: 'E-commerce',
      date: '2024-01-05',
      amount: '$4,500',
      rejectedDate: '2024-01-08',
      rejectionReason: 'Budget exceeds client limit',
      status: 'Rejected'
    },
    {
      id: 'QT-017',
      customer: 'Robert Davis',
      email: 'robert@email.com',
      service: 'Mobile App',
      date: '2023-12-20',
      amount: '$5,200',
      rejectedDate: '2023-12-22',
      rejectionReason: 'Requirements not feasible',
      status: 'Rejected'
    },
    {
      id: 'QT-022',
      customer: 'Lisa Anderson',
      email: 'lisa@email.com',
      service: 'Web Development',
      date: '2023-12-15',
      amount: '$3,800',
      rejectedDate: '2023-12-18',
      rejectionReason: 'Timeline too short',
      status: 'Rejected'
    },
    {
      id: 'QT-025',
      customer: 'James Wilson',
      email: 'james@email.com',
      service: 'SEO Optimization',
      date: '2023-12-10',
      amount: '$1,500',
      rejectedDate: '2023-12-12',
      rejectionReason: 'Scope mismatch',
      status: 'Rejected'
    },
    {
      id: 'QT-028',
      customer: 'Maria Garcia',
      email: 'maria@email.com',
      service: 'UI/UX Design',
      date: '2023-12-05',
      amount: '$2,200',
      rejectedDate: '2023-12-07',
      rejectionReason: 'Client changed priorities',
      status: 'Rejected'
    },
  ];

  const getRejectionColor = (reason) => {
    if (reason.toLowerCase().includes('budget')) return 'bg-red-500/20 text-red-300';
    if (reason.toLowerCase().includes('timeline')) return 'bg-orange-500/20 text-orange-300';
    if (reason.toLowerCase().includes('scope')) return 'bg-purple-500/20 text-purple-300';
    if (reason.toLowerCase().includes('requirements')) return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-gray-500/20 text-gray-300';
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <SalespersonNavbar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content - FIXED: Added negative margin on desktop */}
      <div className={`transition-all duration-300 lg:ml-64 lg:-mt-135 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
        {/* Mobile Top Bar Spacer */}
        <div className="h-16 lg:h-0"></div>
        
        {/* Content Container */}
        <div className={`p-4 sm:p-6 lg:pt-0 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
          {/* Header */}
          {/* <div className="mb-6 lg:mb-2">
            <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold">Rejected Quotations</h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base lg:text-sm">List of all your rejected quotations</p>
          </div> */}
          <div className="mb-6 lg:mb-4 flex items-center justify-between">
          {/* Left side: Header text */}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold">
              Rejected Quotations
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base lg:text-sm">
              List of all your rejected quotations
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
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Rejected Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Rejection Reason</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">Actions</th>
                  </tr>
                </thead>
                
                {/* Mobile Headers - visible only on mobile */}
                <thead className="bg-gray-700 sm:hidden">
                  <tr>
                    <th colSpan="2" className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Rejected Quotations
                    </th>
                  </tr>
                </thead>
                
                <tbody>
                  {rejectedQuotations.map((quote) => (
                    <>
                      {/* Mobile View - Card Layout */}
                      <tr key={`mobile-${quote.id}`} className="sm:hidden border-b border-gray-700">
                        <td colSpan="2" className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-red-400">{quote.id}</span>
                                <h3 className="font-semibold text-white mt-1">{quote.customer}</h3>
                                <p className="text-gray-400 text-sm">{quote.email}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300`}>
                                Rejected
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
                                <p className="text-gray-400 text-xs">Rejected Date</p>
                                <p className="text-red-300 text-sm font-medium">{quote.rejectedDate}</p>
                              </div>
                            </div>
                            
                            {/* Rejection Reason - Mobile */}
                            <div>
                              <p className="text-gray-400 text-xs">Rejection Reason</p>
                              <p className={`px-3 py-1 rounded text-sm mt-1 ${getRejectionColor(quote.rejectionReason)}`}>
                                {quote.rejectionReason}
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
                      
                      {/* Desktop/Tablet View - Table Layout */}
                      <tr key={`desktop-${quote.id}`} className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-4 py-3">
                          <span className="font-bold text-red-400 text-sm">{quote.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white text-sm">{quote.customer}</div>
                          <div className="text-xs text-gray-400">{quote.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-blue-400 font-medium text-sm">{quote.service}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-sm">{quote.date}</td>
                        <td className="px-4 py-3 text-red-300 text-sm font-medium">{quote.rejectedDate}</td>
                        <td className="px-4 py-3 font-bold text-white text-sm">{quote.amount}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${getRejectionColor(quote.rejectionReason)}`}>
                            {quote.rejectionReason}
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
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {rejectedQuotations.length === 0 && (
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
        </div>
      </div>
    </div>
  );
};

export default RejectedQuotations;