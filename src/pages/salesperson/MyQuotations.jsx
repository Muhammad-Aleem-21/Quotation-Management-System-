
// import React from 'react';
// import { useNavigate } from 'react-router-dom'; // Add this import

// const MyQuotations = () => {
//   const navigate = useNavigate(); 
//   const myQuotations = [
//     {
//       id: 'QT-001',
//       customer: 'John Smith',
//       email: 'john@email.com',
//       service: 'Web Development',
//       date: '2024-01-15',
//       amount: '$1,500',
//       status: 'Pending'
//     },
//     {
//       id: 'QT-008',
//       customer: 'Michael Brown',
//       email: 'michael@email.com',
//       service: 'Mobile App',
//       date: '2024-01-08',
//       amount: '$3,200',
//       status: 'Approved'
//     },
//     {
//       id: 'QT-011',
//       customer: 'Sarah Johnson',
//       email: 'sarah@email.com',
//       service: 'E-commerce',
//       date: '2024-01-05',
//       amount: '$4,500',
//       status: 'Rejected'
//     },
//     {
//       id: 'QT-015',
//       customer: 'David Wilson',
//       email: 'david@email.com',
//       service: 'SEO Optimization',
//       date: '2024-01-02',
//       amount: '$1,200',
//       status: 'Approved'
//     }
//   ];

//   // Calculate total sales from approved quotations
//   const calculateTotalSales = () => {
//     const approvedQuotations = myQuotations.filter(q => q.status === 'Approved');
//     const total = approvedQuotations.reduce((sum, quote) => {
//       const amount = parseFloat(quote.amount.replace('$', '').replace(',', ''));
//       return sum + amount;
//     }, 0);
//     return total.toLocaleString('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     });
//   };

//   // Calculate win rate (Approved / Total)
//   const calculateWinRate = () => {
//     const approvedCount = myQuotations.filter(q => q.status === 'Approved').length;
//     const totalCount = myQuotations.length;
//     return totalCount > 0 ? ((approvedCount / totalCount) * 100).toFixed(1) : '0.0';
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Approved':
//         return 'bg-green-500/20 text-green-300';
//       case 'Rejected':
//         return 'bg-red-500/20 text-red-300';
//       case 'Pending':
//         return 'bg-yellow-500/20 text-yellow-300';
//       default:
//         return 'bg-gray-500/20 text-gray-300';
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl sm:text-3xl font-bold">My Quotations</h1>
//         <p className="text-gray-400 mt-1">Manage and track all your quotation requests</p>
//       </div>

//       {/* Stats Summary - 3 cards per line (2 lines) */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
//         {/* First Row - 3 cards */}
        
//         {/* Total Quotations Card */}
//         <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-400 text-sm sm:text-base">Total</p>
//               <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{myQuotations.length}</h2>
//               <p className="text-blue-400 text-xs sm:text-sm mt-1">All quotations</p>
//             </div>
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
//               📄
//             </div>
//           </div>
//         </div>
        
//         {/* Total Sales Card */}
//         <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-400 text-sm sm:text-base">Total Sales</p>
//               <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
//                 {calculateTotalSales()}
//               </h2>
//               <p className="text-purple-400 text-xs sm:text-sm mt-1">Approved only</p>
//             </div>
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
//               💰
//             </div>
//           </div>
//         </div>
        
//         {/* Approved Card */}
        
//         <div 
//           className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700 hover:border-green-500 transition-colors duration-200 cursor-pointer"
//           onClick={() => navigate('/accepted-quotations')} // Add this onClick
//         >
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-400 text-sm sm:text-base">Approved</p>
//               <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
//                 {myQuotations.filter(q => q.status === 'Approved').length}
//               </h2>
//               <p className="text-green-400 text-xs sm:text-sm mt-1">Click to view →</p> {/* Changed text */}
//             </div>
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
//               ✓
//             </div>
//           </div>
//         </div>

//         {/* Second Row - 3 cards */}
        
//         {/* Win Quotations Card */}
//         <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-400 text-sm sm:text-base">Win Rate</p>
//               <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
//                 {calculateWinRate()}%
//               </h2>
//               <p className="text-teal-400 text-xs sm:text-sm mt-1">Success rate</p>
//             </div>
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
//               🏆
//             </div>
//           </div>
//         </div>
        
//         {/* Pending Card */}
        
//         <div 
//           className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700 hover:border-yellow-500 transition-colors duration-200 cursor-pointer"
//           onClick={() => navigate('/pending-quotations')}
//         >
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-400 text-sm sm:text-base">Pending</p>
//               <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
//                 {myQuotations.filter(q => q.status === 'Pending').length}
//               </h2>
//               <p className="text-yellow-400 text-xs sm:text-sm mt-1">Click to view →</p>
//             </div>
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
//               ⏳
//             </div>
//           </div>
//         </div>
        
//         {/* Rejected Card */}
        
//         <div 
//           className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700 hover:border-red-500 transition-colors duration-200 cursor-pointer"
//           onClick={() => navigate('/rejected-quotations')}
//         >
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-400 text-sm sm:text-base">Rejected</p>
//               <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
//                 {myQuotations.filter(q => q.status === 'Rejected').length}
//               </h2>
//               <p className="text-red-400 text-xs sm:text-sm mt-1">Click to view →</p>
//             </div>
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
//               ✗
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table Container */}
//       <div className="bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[600px]">
//             {/* Table Header */}
//             <thead className="bg-gray-700">
//               <tr>
//                 <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-300 text-sm sm:text-base">ID</th>
//                 <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-300 text-sm sm:text-base">Customer</th>
//                 <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-300 text-sm sm:text-base">Service</th>
//                 <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-300 text-sm sm:text-base">Date</th>
//                 <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-300 text-sm sm:text-base">Amount</th>
//                 <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-300 text-sm sm:text-base">Status</th>
//                 <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-300 text-sm sm:text-base">Actions</th>
//               </tr>
//             </thead>
            
//             {/* Table Body */}
//             <tbody className="divide-y divide-gray-700">
//               {myQuotations.map((quote) => (
//                 <tr 
//                   key={quote.id} 
//                   className="hover:bg-gray-750 transition-colors duration-200"
//                 >
//                   <td className="px-3 py-2 sm:px-4 sm:py-3">
//                     <span className="font-bold text-blue-400 text-sm sm:text-base">{quote.id}</span>
//                   </td>
//                   <td className="px-3 py-2 sm:px-4 sm:py-3">
//                     <div className="font-semibold text-white text-sm sm:text-base">{quote.customer}</div>
//                     <div className="text-xs sm:text-sm text-gray-400">{quote.email}</div>
//                   </td>
//                   <td className="px-3 py-2 sm:px-4 sm-py-3">
//                     <span className="text-green-400 font-medium text-sm sm:text-base">{quote.service}</span>
//                   </td>
//                   <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-300 text-sm sm:text-base">{quote.date}</td>
//                   <td className="px-3 py-2 sm:px-4 sm:py-3 font-bold text-white text-sm sm:text-base">{quote.amount}</td>
//                   <td className="px-3 py-2 sm:px-4 sm:py-3">
//                     <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(quote.status)}`}>
//                       {quote.status}
//                     </span>
//                   </td>
//                   <td className="px-3 py-2 sm:px-4 sm:py-3">
//                     <div className="flex flex-wrap gap-1 sm:gap-2">
//                       <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200">
//                         View
//                       </button>
//                       <button className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200">
//                         Edit
//                       </button>
//                       {quote.status === 'Rejected' && (
//                         <button className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200">
//                           Resubmit
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Empty State */}
//         {myQuotations.length === 0 && (
//           <div className="text-center py-8 sm:py-12">
//             <p className="text-gray-400 text-base sm:text-lg">No quotations found</p>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 sm:mt-6">
//         <p className="text-gray-400 text-sm sm:text-base">Showing {myQuotations.length} of {myQuotations.length} quotations</p>
//         <div className="flex space-x-2">
//           <button className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm">
//             Previous
//           </button>
//           <button className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyQuotations;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const MyQuotations = () => {
  const navigate = useNavigate(); 
   const tableRef = useRef(null);
  const myQuotations = [
    {
      id: 'QT-001',
      customer: 'John Smith',
      email: 'john@email.com',
      service: 'Web Development',
      date: '2024-01-15',
      amount: '$1,500',
      status: 'Pending'
    },
    {
      id: 'QT-008',
      customer: 'Michael Brown',
      email: 'michael@email.com',
      service: 'Mobile App',
      date: '2024-01-08',
      amount: '$3,200',
      status: 'Approved'
    },
    {
      id: 'QT-011',
      customer: 'Sarah Johnson',
      email: 'sarah@email.com',
      service: 'E-commerce',
      date: '2024-01-05',
      amount: '$4,500',
      status: 'Rejected'
    },
    {
      id: 'QT-015',
      customer: 'David Wilson',
      email: 'david@email.com',
      service: 'SEO Optimization',
      date: '2024-01-02',
      amount: '$1,200',
      status: 'Approved'
    }
  ];

  // Calculate total sales from approved quotations
  const calculateTotalSales = () => {
    const approvedQuotations = myQuotations.filter(q => q.status === 'Approved');
    const total = approvedQuotations.reduce((sum, quote) => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500/20 text-green-300';
      case 'Rejected':
        return 'bg-red-500/20 text-red-300';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

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
          className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700 hover:border-blue-500 transition-colors duration-200 cursor-pointer"
          onClick={() => {
            if (tableRef.current) {
              tableRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Total</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{myQuotations.length}</h2>
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
        <div 
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
        </div>
        
        {/* Approved Card */}
        <div 
          className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700 hover:border-green-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/accepted-quotations')}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Approved</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                {myQuotations.filter(q => q.status === 'Approved').length}
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
          className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700 hover:border-teal-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/win-quotations')}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Win Quotations</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                0
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
          className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700 hover:border-yellow-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/pending-quotations')}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Pending</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                {myQuotations.filter(q => q.status === 'Pending').length}
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
          className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700 hover:border-red-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/rejected-quotations')}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Rejected</p>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                {myQuotations.filter(q => q.status === 'Rejected').length}
              </h2>
              <p className="text-red-400 text-xs sm:text-sm mt-1">Click to view →</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              ✗
            </div>
          </div>
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
              {myQuotations.map((quote) => (
                <tr 
                  key={quote.id} 
                  className="hover:bg-gray-750 transition-colors duration-200"
                >
                  <td className="px-3 py-2 sm:px-4 sm:py-3">
                    <span className="font-bold text-blue-400 text-sm sm:text-base">{quote.id}</span>
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3">
                    <div className="font-semibold text-white text-sm sm:text-base">{quote.customer}</div>
                    <div className="text-xs sm:text-sm text-gray-400">{quote.email}</div>
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm-py-3">
                    <span className="text-green-400 font-medium text-sm sm:text-base">{quote.service}</span>
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-300 text-sm sm:text-base">{quote.date}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 font-bold text-white text-sm sm:text-base">{quote.amount}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3">
                    <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200">
                        View
                      </button>
                      <button className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200">
                        Edit
                      </button>
                      {quote.status === 'Rejected' && (
                        <button className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200">
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

        {/* Empty State */}
        {myQuotations.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 text-base sm:text-lg">No quotations found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 sm:mt-6">
        <p className="text-gray-400 text-sm sm:text-base">Showing {myQuotations.length} of {myQuotations.length} quotations</p>
        <div className="flex space-x-2">
          <button className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm">
            Previous
          </button>
          <button className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyQuotations;