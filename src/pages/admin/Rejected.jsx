import React from 'react';

const Rejected = () => {
  const rejectedQuotations = [
    {
      id: 'QT-003',
      customer: 'M Adnan',
      email: 'adnan@email.com',
      service: '3mm cable',
      date: '2025-01-13',
      amount: 'Rs.3,500',
      status: 'Rejected'
    }
  ];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white lg:ml-10 mt-14 lg:mt-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Rejected Quotations</h1>
          <p className="text-gray-400">Review all rejected quotation requests</p>
        </div>
        
        {/* <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold text-white flex gap-2 items-center">
          <span className="text-xl">+</span> New Quotation
        </button> */}
      </div>

      {/* Table Container */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Service</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-gray-700">
              {rejectedQuotations.map((quote) => (
                <tr 
                  key={quote.id} 
                  className="hover:bg-gray-750 transition-colors duration-200"
                >
                  <td className="px-4 py-3">
                    <span className="font-bold text-blue-400">{quote.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{quote.customer}</div>
                    <div className="text-sm text-gray-400">{quote.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-green-400 font-medium">{quote.service}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{quote.date}</td>
                  <td className="px-4 py-3 font-bold text-white">{quote.amount}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm font-medium">
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200">
                        View
                      </button>
                      <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {rejectedQuotations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No rejected quotations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rejected;