import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../components/AdminNavbar";
import ManagerProfileModal from "./ManagerProfileModal";
import ManagerTableRow from "./ManagerTableRow";
import { FiSearch, FiX } from "react-icons/fi";

const Managers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManager, setSelectedManager] = useState(null);
  const navigate = useNavigate();

  // Dummy data for managers
  const managers = useMemo(
    () => [
      {
        id: "M-001",
        name: "Alex Johnson",
        email: "alex.johnson@company.com",
        phone: "+1 (555) 123-4567",
        department: "Sales Department",
        role: "Senior Manager",
        joinDate: "2022-03-15",
        teamSize: 8,
        status: "Active",
        address: "123 Business Street, Suite 456, New York, NY 10001",
        salespersonsUnder: [
          { id: 1, name: "John Smith", status: "Active" },
          { id: 2, name: "Emily Davis", status: "Active" },
          { id: 3, name: "Mike Chen", status: "Active" },
          { id: 4, name: "Sarah Brown", status: "Inactive" },
        ],
        quotations: {
          total: 45,
          accepted: 28,
          rejected: 12,
          pending: 5,
          won: 22,
        },
      },
      {
        id: "M-002",
        name: "Sarah Williams",
        email: "sarah.williams@company.com",
        phone: "+1 (555) 987-6543",
        department: "Marketing Department",
        role: "Marketing Manager",
        joinDate: "2021-11-22",
        teamSize: 5,
        status: "Active",
        address: "456 Marketing Avenue, Suite 101, Los Angeles, CA 90001",
        salespersonsUnder: [
          { id: 5, name: "Robert Wilson", status: "Active" },
          { id: 6, name: "Lisa Taylor", status: "Active" },
        ],
        quotations: {
          total: 32,
          accepted: 18,
          rejected: 8,
          pending: 6,
          won: 15,
        },
      },
      {
        id: "M-003",
        name: "Michael Brown",
        email: "michael.brown@company.com",
        phone: "+1 (555) 456-7890",
        department: "Operations",
        role: "Operations Manager",
        joinDate: "2023-01-10",
        teamSize: 6,
        status: "Active",
        address: "789 Operations Road, Suite 303, Chicago, IL 60601",
        salespersonsUnder: [
          { id: 7, name: "David Wilson", status: "Active" },
          { id: 8, name: "Jessica Lee", status: "Active" },
          { id: 9, name: "Kevin Martin", status: "Inactive" },
        ],
        quotations: {
          total: 28,
          accepted: 15,
          rejected: 7,
          pending: 6,
          won: 12,
        },
      },
      {
        id: "M-004",
        name: "Lisa Anderson",
        email: "lisa.anderson@company.com",
        phone: "+1 (555) 321-6549",
        department: "Sales Department",
        role: "Regional Manager",
        joinDate: "2020-08-30",
        teamSize: 10,
        status: "Inactive",
        address: "101 Regional Avenue, Suite 505, Miami, FL 33101",
        salespersonsUnder: [
          { id: 10, name: "Thomas Clark", status: "Active" },
          { id: 11, name: "Amanda White", status: "Active" },
          { id: 12, name: "Brian Miller", status: "Active" },
          { id: 13, name: "Rachel Garcia", status: "Inactive" },
        ],
        quotations: {
          total: 65,
          accepted: 42,
          rejected: 15,
          pending: 8,
          won: 35,
        },
      },
    ],
    []
  );

  // Filter managers based on search
  const filteredManagers = useMemo(() => {
    if (!searchQuery) return managers;

    const query = searchQuery.toLowerCase();
    return managers.filter(
      (manager) =>
        manager.name.toLowerCase().includes(query) ||
        manager.email.toLowerCase().includes(query) ||
        manager.department.toLowerCase().includes(query) ||
        manager.role.toLowerCase().includes(query) ||
        manager.id.toLowerCase().includes(query)
    );
  }, [managers, searchQuery]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Handle manager click
  const handleManagerClick = (manager) => {
    setSelectedManager(manager);
  };

  // Close profile modal
  const closeProfileModal = () => {
    setSelectedManager(null);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <AdminNavbar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 lg:ml-64 lg:-mt-135 ${
          sidebarOpen ? "overflow-hidden" : ""
        }`}
      >
        {/* Mobile Top Spacer */}
        <div className="h-16 lg:h-0"></div>

        {/* Content Container */}
        <div
          className={`p-4 sm:p-6 lg:pt-0 ${
            sidebarOpen ? "overflow-hidden" : ""
          }`}
        >
          {/* Header (Hidden on mobile, shown on desktop) */}
          <div className="mb-6 hidden lg:block">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Managers</h1>
                <p className="text-gray-400 mt-1">
                  List of all managers in the company
                </p>
              </div>
              <button
                onClick={() => navigate("/admin-dashboard")}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-sm"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
          {/* Mobile Header */}
          <div className="mb-6 lg:hidden">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Managers</h1>
                <p className="text-gray-400 mt-1">
                  List of all managers in the company
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>

          {/* Simple Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">
                Total Managers
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                {managers.length}
              </h2>
              <p className="text-purple-400 text-xs sm:text-sm mt-1">
                Active managers
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">Total Teams</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                {managers.reduce((sum, manager) => sum + manager.teamSize, 0)}
              </h2>
              <p className="text-blue-400 text-xs sm:text-sm mt-1">
                Team members
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <p className="text-gray-400 text-sm sm:text-base">
                Active Managers
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                {managers.filter((m) => m.status === "Active").length}
              </h2>
              <p className="text-green-400 text-xs sm:text-sm mt-1">
                Currently active
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-4 mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search managers by name, email, department, or role..."
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
                  Found {filteredManagers.length} result
                  {filteredManagers.length !== 1 ? "s" : ""} for "{searchQuery}"
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
              Showing {filteredManagers.length} of {managers.length} managers
            </p>
            <div className="text-sm text-gray-400">
              {searchQuery && `Search results: ${filteredManagers.length}`}
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
                      Manager ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Team Size
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300 text-sm">
                      Status
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
                      Managers ({filteredManagers.length})
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredManagers.map((manager) => (
                    <ManagerTableRow
                      key={manager.id}
                      manager={manager}
                      onClick={handleManagerClick}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {filteredManagers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-3xl mb-4">👨‍💼</div>
                <p className="text-gray-400">No managers found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : "No managers found in the system."}
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
              Showing {filteredManagers.length} managers
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

      {/* Manager Profile Modal */}
      {selectedManager && (
        <ManagerProfileModal
          manager={selectedManager}
          onClose={closeProfileModal}
        />
      )}
    </div>
  );
};

export default Managers;