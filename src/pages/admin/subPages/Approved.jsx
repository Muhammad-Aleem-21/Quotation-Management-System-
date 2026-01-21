import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../components/AdminNavbar";
import { FiSearch, FiX, FiFileText, FiUser, FiCheck } from "react-icons/fi";

const Approved = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Dummy data for approved quotations
  const approvedQuotations = useMemo(
    () => [
      {
        id: "QT-1001",
        salesperson: "John D.",
        salespersonId: "SP-001",
        customer: "TechCorp Solutions",
        customerEmail: "contact@techcorp.com",
        service: "Website Redesign",
        date: "2024-01-20",
        approvedDate: "2024-01-21",
        amount: "$15,200",
        approvedBy: "Manager A",
      },
      {
        id: "QT-1004",
        salesperson: "Emily T.",
        salespersonId: "SP-004",
        customer: "EduTech Innovations",
        customerEmail: "admin@edutech.com",
        service: "LMS Platform",
        date: "2024-01-12",
        approvedDate: "2024-01-13",
        amount: "$12,500",
        approvedBy: "Manager C",
      },
    ],
    [],
  );

  // Filter quotations based on search
  const filteredQuotations = useMemo(() => {
    if (!searchQuery) return approvedQuotations;

    const query = searchQuery.toLowerCase();
    return approvedQuotations.filter(
      (quote) =>
        quote.customer.toLowerCase().includes(query) ||
        quote.id.toLowerCase().includes(query) ||
        quote.service.toLowerCase().includes(query) ||
        quote.salesperson.toLowerCase().includes(query) ||
        quote.customerEmail.toLowerCase().includes(query) ||
        quote.approvedBy.toLowerCase().includes(query),
    );
  }, [approvedQuotations, searchQuery]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar - handles its own open/close buttons internally */}
      <AdminNavbar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 lg:ml-64 lg:-mt-135 ${sidebarOpen ? "overflow-hidden" : ""}`}
      >
        {/* Mobile Top Spacer */}
        <div className="h-16 lg:h-0"></div>

        {/* Content Container */}
        <div className={`p-4 sm:p-6 ${sidebarOpen ? "overflow-hidden" : ""}`}>
          {/* Header (Hidden on mobile, shown on desktop) */}
          <div className="mb-6 hidden lg:block">
            {/* <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Approved Quotations</h1>
                <p className="text-gray-400 mt-1">
                  Quotations that were approved by managers
                </p>
              </div>
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-sm"
              >
                ← Back to Dashboard
              </button>
            </div> */}
          </div>

          {/* Mobile & Desktop Header - Single consistent header */}
          <div className="mb-6">
            <div className="flex justify-between items-start">
              {/* Left Text */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Approved Quotations
                </h1>
                <p className="text-gray-400 mt-1">
                  Quotations that were approved by managers
                </p>
              </div>

              {/* Right Button - Always visible, only Back button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>

          {/* Simple Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">
                Total Approved
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                {approvedQuotations.length}
              </h2>
              <p className="text-green-400 text-xs sm:text-sm mt-1">
                Approved by managers
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">Total Value</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                $
                {approvedQuotations
                  .reduce(
                    (sum, q) =>
                      sum +
                      parseFloat(q.amount.replace("$", "").replace(",", "")),
                    0,
                  )
                  .toLocaleString()}
              </h2>
              <p className="text-purple-400 text-xs sm:text-sm mt-1">
                Approved amount
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-4 mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search approved quotations by customer, ID, service, or salesperson..."
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
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-700">
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

          {/* Results Summary */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              Showing {filteredQuotations.length} of {approvedQuotations.length}{" "}
              approved quotations
            </p>
            <div className="text-sm text-gray-400">
              {searchQuery && `Search results: ${filteredQuotations.length}`}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
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
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Approved By
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
                      Approved Quotations ({filteredQuotations.length})
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
                                <span className="font-bold text-green-400">
                                  {quote.id}
                                </span>
                                <h3 className="font-semibold text-white mt-1">
                                  {quote.customer}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                  {quote.customerEmail}
                                </p>
                              </div>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-1">
                                <FiCheck className="text-xs" />
                                Approved
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
                                  Approved By
                                </p>
                                <p className="text-blue-300 text-sm">
                                  {quote.approvedBy}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Desktop/Tablet View - Table Layout */}
                      <tr className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FiFileText className="text-green-400" />
                            <span className="font-bold text-green-400 text-sm">
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
                        <td className="px-4 py-3 font-bold text-white text-sm">
                          {quote.amount}
                        </td>
                        <td className="px-4 py-3 text-blue-300 text-sm">
                          {quote.approvedBy}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredQuotations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-3xl mb-4">✅</div>
                <p className="text-gray-400">No approved quotations found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : "No quotations have been approved yet."}
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
              Showing {filteredQuotations.length} approved quotations
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

export default Approved;
