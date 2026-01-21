import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../components/AdminNavbar";
import {
  FiSearch,
  FiX,
  FiFileText,
  FiUser,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

const Pending = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Dummy data for pending quotations (max 2 as requested)
  const pendingQuotations = useMemo(
    () => [
      {
        id: "QT-1002",
        salesperson: "Sarah M.",
        salespersonId: "SP-002",
        customer: "Global Logistics Inc",
        customerEmail: "procurement@globallogistics.com",
        service: "CRM Implementation",
        date: "2024-01-18",
        amount: "$8,500",
        submittedDate: "2024-01-18",
        daysPending: 7,
        priority: "medium",
      },
      {
        id: "QT-1005",
        salesperson: "David L.",
        salespersonId: "SP-005",
        customer: "Green Energy Corp",
        customerEmail: "sales@greenenergy.com",
        service: "Solar Panel Installation",
        date: "2024-01-10",
        amount: "$18,300",
        submittedDate: "2024-01-10",
        daysPending: 15,
        priority: "high",
      },
    ],
    [],
  );

  // Filter quotations based on search
  const filteredQuotations = useMemo(() => {
    if (!searchQuery) return pendingQuotations;

    const query = searchQuery.toLowerCase();
    return pendingQuotations.filter(
      (quote) =>
        quote.customer.toLowerCase().includes(query) ||
        quote.id.toLowerCase().includes(query) ||
        quote.service.toLowerCase().includes(query) ||
        quote.salesperson.toLowerCase().includes(query) ||
        quote.customerEmail.toLowerCase().includes(query),
    );
  }, [pendingQuotations, searchQuery]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getDaysPendingColor = (days) => {
    if (days > 10) return "bg-red-500/20 text-red-300";
    if (days > 5) return "bg-orange-500/20 text-orange-300";
    return "bg-yellow-500/20 text-yellow-300";
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <AdminNavbar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 lg:ml-64 lg:-mt-135 ${sidebarOpen ? "overflow-hidden" : ""}`}
      >
        {/* Mobile Top Spacer */}
        <div className="h-16 lg:h-0"></div>

        {/* Content Container */}
        <div
          className={`p-4 sm:p-6 lg:pt-0 ${sidebarOpen ? "overflow-hidden" : ""}`}
        >
          {/* Header (Hidden on mobile, shown on desktop) */}

          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
              {/* Left Text */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Pending Quotations
                </h1>
                <p className="text-gray-400 mt-1">
                  Quotations awaiting approval from managers
                </p>
              </div>

              {/* Right Button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">
                Total Pending
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                {pendingQuotations.length}
              </h2>
              <p className="text-yellow-400 text-xs sm:text-sm mt-1">
                Awaiting approval
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">
                High Priority
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                {pendingQuotations.filter((q) => q.priority === "high").length}
              </h2>
              <p className="text-red-400 text-xs sm:text-sm mt-1">
                Requires attention
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">Total Value</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                $
                {pendingQuotations
                  .reduce(
                    (sum, q) =>
                      sum +
                      parseFloat(q.amount.replace("$", "").replace(",", "")),
                    0,
                  )
                  .toLocaleString()}
              </h2>
              <p className="text-purple-400 text-xs sm:text-sm mt-1">
                Pending amount
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">
                Avg Days Pending
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                {(
                  pendingQuotations.reduce((sum, q) => sum + q.daysPending, 0) /
                  pendingQuotations.length
                ).toFixed(1)}
              </h2>
              <p className="text-blue-400 text-xs sm:text-sm mt-1">
                Days average
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-4 mb-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pending quotations by customer, ID, service, or salesperson..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FiX />
                  </button>
                )}
              </div>

              {/* Search Results Info */}
              {searchQuery && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                  <span className="text-xs text-gray-400">
                    Found {filteredQuotations.length} result
                    {filteredQuotations.length !== 1 ? "s" : ""} for "
                    {searchQuery}"
                  </span>
                  <button
                    onClick={clearSearch}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              Showing {filteredQuotations.length} of {pendingQuotations.length}{" "}
              pending quotations
            </p>
            <div className="text-sm text-gray-400">
              {searchQuery && `Search results: ${filteredQuotations.length}`}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                {/* Desktop Headers */}
                <thead className="bg-gray-700 hidden sm:table-header-group">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Quotation ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Salesperson
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Days Pending
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Mobile Headers */}
                <thead className="bg-gray-700 sm:hidden">
                  <tr>
                    <th
                      colSpan="2"
                      className="px-4 py-3 text-left font-semibold text-gray-300 text-sm"
                    >
                      Pending Quotations ({filteredQuotations.length})
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredQuotations.map((quote) => (
                    <React.Fragment key={quote.id}>
                      {/* Mobile View - Card Layout */}
                      <tr className="sm:hidden border-b border-gray-700">
                        <td colSpan="2" className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-blue-400">
                                  {quote.id}
                                </span>
                                <h3 className="font-semibold text-white mt-1">
                                  {quote.customer}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                  {quote.customerEmail}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(quote.priority)} flex items-center gap-1`}
                              >
                                <FiAlertCircle className="text-xs" />
                                {quote.priority.charAt(0).toUpperCase() +
                                  quote.priority.slice(1)}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Service</p>
                                <p className="text-green-400 text-sm">
                                  {quote.service}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Amount</p>
                                <p className="font-bold text-white text-sm">
                                  {quote.amount}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">
                                  Salesperson
                                </p>
                                <div className="flex items-center gap-2">
                                  <FiUser className="text-purple-300 text-xs" />
                                  <p className="text-purple-300 text-sm font-medium">
                                    {quote.salesperson}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">
                                  Days Pending
                                </p>
                                <p
                                  className={`px-2 py-1 rounded text-xs mt-1 ${getDaysPendingColor(quote.daysPending)}`}
                                >
                                  {quote.daysPending} days
                                </p>
                              </div>
                            </div>

                            <div className="pt-2">
                              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition-colors">
                                Review
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Desktop/Tablet View - Table Layout */}
                      <tr className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FiFileText className="text-blue-400" />
                            <span className="font-bold text-blue-400 text-sm">
                              {quote.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white text-sm">
                            {quote.customer}
                          </div>
                          <div className="text-xs text-gray-400">
                            {quote.customerEmail}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-green-400 font-medium text-sm">
                            {quote.service}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FiUser className="text-purple-300" />
                            <div>
                              <div className="text-purple-300 text-sm">
                                {quote.salesperson}
                              </div>
                              <div className="text-xs text-gray-400">
                                {quote.salespersonId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-sm">
                          {quote.date}
                        </td>
                        <td className="px-4 py-3 font-bold text-white text-sm">
                          {quote.amount}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(quote.priority)} flex items-center gap-1 w-fit`}
                          >
                            <FiAlertCircle className="text-xs" />
                            {quote.priority.charAt(0).toUpperCase() +
                              quote.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded text-xs font-medium ${getDaysPendingColor(quote.daysPending)}`}
                          >
                            {quote.daysPending} days
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                            Review
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredQuotations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-3xl mb-4">⏳</div>
                <p className="text-gray-400">No pending quotations found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : "All quotations have been approved or rejected."}
                </p>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
            <p className="text-gray-400 text-sm">
              Showing {filteredQuotations.length} pending quotations
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

export default Pending;
