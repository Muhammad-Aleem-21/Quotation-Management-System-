import React from "react";

const TeamQuotations = () => {
  const teamQuotations = [
    {
      id: "QT-101",
      salesperson: "John Doe",
      customer: "Tech Solutions Inc.",
      service: "Web Development",
      date: "2024-01-20",
      amount: "$5,000",
      status: "Pending",
    },
    {
      id: "QT-102",
      salesperson: "Sarah Wilson",
      customer: "Marketing Pro",
      service: "SEO Services",
      date: "2024-01-19",
      amount: "$2,500",
      status: "Approved",
    },
    {
      id: "QT-103",
      salesperson: "Mike Johnson",
      customer: "StartUp Ventures",
      service: "Mobile App",
      date: "2024-01-18",
      amount: "$8,000",
      status: "Rejected",
    },
    {
      id: "QT-104",
      salesperson: "Emily Davis",
      customer: "Enterprise Corp",
      service: "CRM Implementation",
      date: "2024-01-17",
      amount: "$12,000",
      status: "Pending",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/20 text-green-300";
      case "Rejected":
        return "bg-red-500/20 text-red-300";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Team Quotations</h1>
          <p className="text-gray-400 mt-1">
            Monitor and manage all team quotation requests
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white flex gap-2 items-center transition-colors duration-200">
          Generate Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base">Total Quotations</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {teamQuotations.length}
          </h2>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base">Pending</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {teamQuotations.filter((q) => q.status === "Pending").length}
          </h2>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base">Approved</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {teamQuotations.filter((q) => q.status === "Approved").length}
          </h2>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base">Team Revenue</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            $27.5K
          </h2>
        </div>
      </div>

      {/* Team Quotations Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">
                  ID
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">
                  Salesperson
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">
                  Customer
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">
                  Service
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">
                  Amount
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {teamQuotations.map((quote) => (
                <tr
                  key={quote.id}
                  className="hover:bg-gray-750 transition-colors duration-200"
                >
                  <td className="px-4 py-3">
                    <span className="font-bold text-blue-400">{quote.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">
                      {quote.salesperson}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">
                      {quote.customer}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-green-400 font-medium">
                      {quote.service}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{quote.date}</td>
                  <td className="px-4 py-3 font-bold text-white">
                    {quote.amount}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}
                    >
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200">
                        View
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200">
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamQuotations;
