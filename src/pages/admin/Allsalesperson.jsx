import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Salesperson Profile Component
const SalespersonProfile = ({ salesperson, onClose }) => {
  // Dummy data for quotations
  const quotationData = {
    rejected: 3,
    accepted: 12,
    won: 8,
    pending: 5,
    recentQuotations: [
      {
        id: 1,
        client: "ABC Corp",
        value: 15000,
        status: "Won",
        date: "2024-01-15",
      },
      {
        id: 2,
        client: "XYZ Ltd",
        value: 8500,
        status: "Pending",
        date: "2024-01-14",
      },
      {
        id: 3,
        client: "Global Inc",
        value: 22000,
        status: "Accepted",
        date: "2024-01-12",
      },
      {
        id: 4,
        client: "Tech Solutions",
        value: 12500,
        status: "Rejected",
        date: "2024-01-10",
      },
    ],
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-4xl my-8 max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{salesperson.avatar}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {salesperson.name}
              </h2>
              <p className="text-gray-400">Salesperson Profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl p-2"
          >
            ×
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Full Name
                      </label>
                      <p className="text-white font-medium">
                        {salesperson.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        ID
                      </label>
                      <p className="text-white font-medium">{salesperson.id}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Email Address
                    </label>
                    <p className="text-white font-medium">
                      {salesperson.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Contact Number
                    </label>
                    <p className="text-white font-medium">
                      {salesperson.phone}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Region
                    </label>
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-200">
                      {salesperson.region}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Join Date
                    </label>
                    <p className="text-white font-medium">
                      {formatDate(salesperson.joinDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Status
                    </label>
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        salesperson.status === "Active"
                          ? "bg-green-900 text-green-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      {salesperson.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700">
                  Address Information
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-300">
                    123 Business Street, Suite 456
                    <br />
                    {salesperson.region}
                    <br />
                    Postal Code: 10001
                    <br />
                    Country: United States
                  </p>
                  <div className="mt-4">
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2">
                      <span>Edit Address</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quotation Statistics */}
            <div className="space-y-6">
              {/* Quotation Stats Cards */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700">
                  Quotation Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Rejected</p>
                        <p className="text-2xl font-bold text-red-400">
                          {quotationData.rejected}
                        </p>
                      </div>
                      <div className="text-2xl">❌</div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Accepted</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {quotationData.accepted}
                        </p>
                      </div>
                      <div className="text-2xl">✓</div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Won</p>
                        <p className="text-2xl font-bold text-green-400">
                          {quotationData.won}
                        </p>
                      </div>
                      <div className="text-2xl">🏆</div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Pending</p>
                        <p className="text-2xl font-bold text-yellow-400">
                          {quotationData.pending}
                        </p>
                      </div>
                      <div className="text-2xl">⏱️</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales Performance */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700">
                  Sales Performance
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Total Sales</p>
                      <p className="text-xl font-bold text-white">
                        {formatCurrency(salesperson.totalSales)}
                      </p>
                    </div>
                    <div className="text-2xl">💰</div>
                  </div>
                  {/* <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Commission Earned</p>
                      <p className="text-xl font-bold text-green-400">{formatCurrency(salesperson.commission)}</p>
                    </div>
                    <div className="text-2xl">💸</div>
                  </div> */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Success Rate</p>
                      <p className="text-xl font-bold text-white">
                        {(
                          (quotationData.won /
                            (quotationData.rejected +
                              quotationData.accepted +
                              quotationData.won +
                              quotationData.pending)) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <div className="text-2xl">📈</div>
                  </div>
                </div>
              </div>

              {/* Recent Quotations */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700">
                  Recent Quotations
                </h3>
                <div className="space-y-3">
                  {quotationData.recentQuotations.map((quote) => (
                    <div
                      key={quote.id}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-white">{quote.client}</p>
                        <p className="text-sm text-gray-400">
                          {formatDate(quote.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">
                          {formatCurrency(quote.value)}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            quote.status === "Won"
                              ? "bg-green-900 text-green-200"
                              : quote.status === "Accepted"
                                ? "bg-blue-900 text-blue-200"
                                : quote.status === "Pending"
                                  ? "bg-yellow-900 text-yellow-200"
                                  : "bg-red-900 text-red-200"
                          }`}
                        >
                          {quote.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-2 text-center text-blue-400 hover:text-blue-300 text-sm font-medium border border-gray-700 rounded-lg hover:border-blue-500 transition-colors">
                    View All Quotations →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-between items-center sticky bottom-0 bg-gray-800">
          <div className="flex gap-3">
            {/* <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
              Send Message
            </button> */}
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              View Full Report
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AllSalespersons() {
  const navigate = useNavigate();
  // Dummy data for salespersons
  const initialSalespersons = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@company.com",
      phone: "+1 (555) 123-4567",
      region: "North America",
      joinDate: "2023-01-15",
      status: "Active",
      totalSales: 125000,
      commission: 12500,
      avatar: "👨‍💼",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      phone: "+1 (555) 987-6543",
      region: "Europe",
      joinDate: "2022-08-22",
      status: "Active",
      totalSales: 189500,
      commission: 18950,
      avatar: "👩‍💼",
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike.chen@company.com",
      phone: "+1 (555) 456-7890",
      region: "Asia Pacific",
      joinDate: "2023-03-10",
      status: "Active",
      totalSales: 87500,
      commission: 8750,
      avatar: "👨‍💻",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@company.com",
      phone: "+1 (555) 234-5678",
      region: "North America",
      joinDate: "2021-11-05",
      status: "Inactive",
      totalSales: 0,
      commission: 0,
      avatar: "👩‍🎓",
    },
    {
      id: 5,
      name: "Carlos Rodriguez",
      email: "carlos.r@company.com",
      phone: "+1 (555) 345-6789",
      region: "Latin America",
      joinDate: "2023-06-18",
      status: "Active",
      totalSales: 95600,
      commission: 9560,
      avatar: "👨‍🚀",
    },
    {
      id: 6,
      name: "Priya Patel",
      email: "priya.patel@company.com",
      phone: "+1 (555) 567-8901",
      region: "Middle East",
      joinDate: "2022-12-01",
      status: "Active",
      totalSales: 142300,
      commission: 14230,
      avatar: "👩‍🔬",
    },
  ];

  const [salespersons, setSalespersons] = useState(initialSalespersons);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [selectedSalesperson, setSelectedSalesperson] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Filter salespersons based on search and filters
  const filteredSalespersons = salespersons.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || person.status === statusFilter;
    const matchesRegion =
      regionFilter === "All" || person.region === regionFilter;

    return matchesSearch && matchesStatus && matchesRegion;
  });

  // Sort salespersons
  const sortedSalespersons = [...filteredSalespersons].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "totalSales":
        return b.totalSales - a.totalSales;
      case "joinDate":
        return new Date(b.joinDate) - new Date(a.joinDate);
      case "region":
        return a.region.localeCompare(b.region);
      default:
        return 0;
    }
  });

  // Get unique regions for filter dropdown
  const regions = [
    "All",
    ...new Set(salespersons.map((person) => person.region)),
  ];

  // Calculate statistics
  const stats = {
    total: salespersons.length,
    active: salespersons.filter((p) => p.status === "Active").length,
    totalSales: salespersons.reduce(
      (sum, person) => sum + person.totalSales,
      0,
    ),
    totalCommission: salespersons.reduce(
      (sum, person) => sum + person.commission,
      0,
    ),
  };

  // Function to delete a salesperson
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this salesperson?")) {
      setSalespersons((prev) => prev.filter((person) => person.id !== id));
    }
  };

  // Function to toggle status
  const handleToggleStatus = (id) => {
    setSalespersons((prev) =>
      prev.map((person) =>
        person.id === id
          ? {
              ...person,
              status: person.status === "Active" ? "Inactive" : "Active",
              totalSales: person.status === "Active" ? 0 : person.totalSales,
              commission: person.status === "Active" ? 0 : person.commission,
            }
          : person,
      ),
    );
  };

  // Function to handle click on salesperson name/avatar
  const handleSalespersonClick = (person) => {
    setSelectedSalesperson(person);
    setShowProfile(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white lg:ml-10">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            All Salespersons
          </h1>
          <p className="text-gray-400">
            Manage and view all sales team members
          </p>
        </div>
        <button
          onClick={() => navigate(-1)} // or navigate('/admin-dashboard') if you want specific route
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
          <h3 className="text-sm sm:text-base font-semibold text-gray-300">
            Total Salespersons
          </h3>
          <p className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {stats.total}
          </p>
        </div>
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
          <h3 className="text-sm sm:text-base font-semibold text-gray-300">
            Active
          </h3>
          <p className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {stats.active}
          </p>
        </div>
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
          <h3 className="text-sm sm:text-base font-semibold text-gray-300">
            Total Sales
          </h3>
          <p className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {formatCurrency(stats.totalSales)}
          </p>
        </div>
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
          <h3 className="text-sm sm:text-base font-semibold text-gray-300">
            Total Commission
          </h3>
          <p className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {formatCurrency(stats.totalCommission)}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-md mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Region
            </label>
            <select
              className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort By
            </label>
            <select
              className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="totalSales">Total Sales</option>
              <option value="joinDate">Join Date</option>
              <option value="region">Region</option>
            </select>
          </div>
        </div>
      </div>

      {/* Salespersons Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Salesperson
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Total Sales
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {sortedSalespersons.map((person) => (
                <tr
                  key={person.id}
                  className="hover:bg-gray-750 transition-colors duration-200"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div
                      className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleSalespersonClick(person)}
                    >
                      <div className="text-2xl mr-3">{person.avatar}</div>
                      <div>
                        <div className="text-sm font-medium text-white hover:text-blue-300 transition-colors">
                          {person.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          ID: {person.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{person.email}</div>
                    <div className="text-sm text-gray-400">{person.phone}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-200">
                      {person.region}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(person.joinDate)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        person.status === "Active"
                          ? "bg-green-900 text-green-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      {person.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {formatCurrency(person.totalSales)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-400">
                    {formatCurrency(person.commission)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(person.id);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 ${
                          person.status === "Active"
                            ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {person.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(person.id);
                        }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {sortedSalespersons.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-white mb-2">
              No salespersons found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Results Count */}
        <div className="px-6 py-4 bg-gray-700 border-t border-gray-600">
          <p className="text-sm text-gray-300">
            Showing{" "}
            <span className="font-medium text-white">
              {sortedSalespersons.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-white">
              {salespersons.length}
            </span>{" "}
            salespersons
          </p>
        </div>
      </div>

      {/* Salesperson Profile Modal */}
      {showProfile && selectedSalesperson && (
        <SalespersonProfile
          salesperson={selectedSalesperson}
          onClose={() => {
            setShowProfile(false);
            setSelectedSalesperson(null);
          }}
        />
      )}
    </div>
  );
}
