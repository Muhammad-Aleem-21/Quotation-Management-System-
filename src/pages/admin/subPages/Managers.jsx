import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../components/AdminNavbar";
import {
  FiSearch,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

// Manager Profile Modal Component
const ManagerProfileModal = ({ manager, onClose }) => {
  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-500/20 text-green-300 border-green-500/30"
      : "bg-red-500/20 text-red-300 border-red-500/30";
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-4xl my-8 max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
          <div className="flex items-center gap-4">
            <div className="text-3xl bg-purple-600 p-3 rounded-xl">👨‍💼</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{manager.name}</h2>
              <p className="text-gray-400">Manager Profile</p>
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
                        Manager ID
                      </label>
                      <p className="text-white font-medium flex items-center gap-2">
                        <FiUser className="text-purple-400" />
                        {manager.id}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Status
                      </label>
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(manager.status)}`}
                      >
                        {manager.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Full Name
                    </label>
                    <p className="text-white font-medium">{manager.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Email Address
                    </label>
                    <p className="text-white font-medium flex items-center gap-2">
                      <FiMail className="text-blue-400" />
                      {manager.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Contact Number
                    </label>
                    <p className="text-white font-medium flex items-center gap-2">
                      <FiPhone className="text-green-400" />
                      {manager.phone}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Department
                    </label>
                    <p className="text-orange-300 font-medium">
                      {manager.department}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Role
                    </label>
                    <p className="text-white font-medium">{manager.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Join Date
                    </label>
                    <p className="text-white font-medium">{manager.joinDate}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700">
                  Address Information
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-300">{manager.address}</p>
                  <div className="mt-4">
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2">
                      <span>Edit Address</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Team & Quotation Statistics */}
            <div className="space-y-6">
              {/* Team Information */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700 flex items-center gap-2">
                  <FiUsers className="text-yellow-400" />
                  Team Information
                </h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-400">Total Team Size</p>
                      <p className="text-2xl font-bold text-white">
                        {manager.teamSize} members
                      </p>
                    </div>
                    <div className="text-3xl">👥</div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">
                      Salespersons Under Management
                    </p>
                    <div className="space-y-2">
                      {manager.salespersonsUnder.map((salesperson) => (
                        <div
                          key={salesperson.id}
                          className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center">
                              <FiUser className="text-blue-300" />
                            </div>
                            <div>
                              <p className="font-medium text-white text-sm">
                                {salesperson.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                ID: {salesperson.id}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              salesperson.status === "Active"
                                ? "bg-green-900/30 text-green-300"
                                : "bg-red-900/30 text-red-300"
                            }`}
                          >
                            {salesperson.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-2 text-center text-blue-400 hover:text-blue-300 text-sm font-medium border border-gray-700 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center gap-2">
                    <FiUsers />
                    View Full Team Report →
                  </button>
                </div>
              </div>

              {/* Quotation Statistics */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700 flex items-center gap-2">
                  <FiFileText className="text-purple-400" />
                  Quotation Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">
                          Total Quotations
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {manager.quotations.total}
                        </p>
                      </div>
                      <div className="text-2xl">📊</div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Won Quotations</p>
                        <p className="text-2xl font-bold text-green-400">
                          {manager.quotations.won}
                        </p>
                      </div>
                      <div className="text-2xl">🏆</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Accepted</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {manager.quotations.accepted}
                        </p>
                      </div>
                      <FiCheckCircle className="text-2xl text-blue-400" />
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Rejected</p>
                        <p className="text-2xl font-bold text-red-400">
                          {manager.quotations.rejected}
                        </p>
                      </div>
                      <FiXCircle className="text-2xl text-red-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Pending</p>
                      <p className="text-xl font-bold text-yellow-400">
                        {manager.quotations.pending}
                      </p>
                    </div>
                    <div className="text-2xl">⏱️</div>
                  </div>
                </div>

                <div className="mt-4">
                  <button className="w-full py-2 text-center text-blue-400 hover:text-blue-300 text-sm font-medium border border-gray-700 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center gap-2">
                    <FiFileText />
                    View All Quotations →
                  </button>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700">
                  Performance Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Success Rate</p>
                      <p className="text-xl font-bold text-white">
                        {(
                          (manager.quotations.won / manager.quotations.total) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <div className="text-2xl">📈</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Acceptance Rate</p>
                      <p className="text-xl font-bold text-white">
                        {(
                          (manager.quotations.accepted /
                            manager.quotations.total) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <div className="text-2xl">✅</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Rejection Rate</p>
                      <p className="text-xl font-bold text-white">
                        {(
                          (manager.quotations.rejected /
                            manager.quotations.total) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <div className="text-2xl">❌</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-between items-center sticky bottom-0 bg-gray-800">
          <div className="flex gap-3">
            {/* <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <FiMail />
                Send Message
              </button> */}
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <FiBriefcase />
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
    ],
    [],
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
        manager.id.toLowerCase().includes(query),
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

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-500/20 text-green-300 border-green-500/30"
      : "bg-red-500/20 text-red-300 border-red-500/30";
  };

  // Manager Profile Modal Component
  // const ManagerProfileModal = ({ manager, onClose }) => {
  //   return (
  //     <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
  //       <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-4xl my-8 max-h-[90vh] overflow-hidden">
  //         {/* Modal Header */}
  //         <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
  //           <div className="flex items-center gap-4">
  //             <div className="text-3xl bg-purple-600 p-3 rounded-xl">👨‍💼</div>
  //             <div>
  //               <h2 className="text-2xl font-bold text-white">{manager.name}</h2>
  //               <p className="text-gray-400">Manager Profile</p>
  //             </div>
  //           </div>
  //           <button
  //             onClick={onClose}
  //             className="text-gray-400 hover:text-white text-3xl p-2"
  //           >
  //             ×
  //           </button>
  //         </div>

  //         {/* Modal Body - Scrollable */}
  //         <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
  //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //             {/* Personal Information */}
  //             <div className="space-y-6">
  //               <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
  //                 <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700">
  //                   Personal Information
  //                 </h3>
  //                 <div className="space-y-4">
  //                   <div className="grid grid-cols-2 gap-4">
  //                     <div>
  //                       <label className="block text-sm font-medium text-gray-400 mb-1">
  //                         Manager ID
  //                       </label>
  //                       <p className="text-white font-medium flex items-center gap-2">
  //                         <FiUser className="text-purple-400" />
  //                         {manager.id}
  //                       </p>
  //                     </div>
  //                     <div>
  //                       <label className="block text-sm font-medium text-gray-400 mb-1">
  //                         Status
  //                       </label>
  //                       <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(manager.status)}`}>
  //                         {manager.status}
  //                       </span>
  //                     </div>
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-400 mb-1">
  //                       Full Name
  //                     </label>
  //                     <p className="text-white font-medium">{manager.name}</p>
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-400 mb-1">
  //                       Email Address
  //                     </label>
  //                     <p className="text-white font-medium flex items-center gap-2">
  //                       <FiMail className="text-blue-400" />
  //                       {manager.email}
  //                     </p>
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-400 mb-1">
  //                       Contact Number
  //                     </label>
  //                     <p className="text-white font-medium flex items-center gap-2">
  //                       <FiPhone className="text-green-400" />
  //                       {manager.phone}
  //                     </p>
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-400 mb-1">
  //                       Department
  //                     </label>
  //                     <p className="text-orange-300 font-medium">{manager.department}</p>
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-400 mb-1">
  //                       Role
  //                     </label>
  //                     <p className="text-white font-medium">{manager.role}</p>
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-400 mb-1">
  //                       Join Date
  //                     </label>
  //                     <p className="text-white font-medium">{manager.joinDate}</p>
  //                   </div>
  //                 </div>
  //               </div>

  //               {/* Address Information */}
  //               <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
  //                 <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700">
  //                   Address Information
  //                 </h3>
  //                 <div className="space-y-3">
  //                   <p className="text-gray-300">
  //                     {manager.address}
  //                   </p>
  //                   <div className="mt-4">
  //                     <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2">
  //                       <span>Edit Address</span>
  //                       <span>→</span>
  //                     </button>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>

  //             {/* Team & Quotation Statistics */}
  //             <div className="space-y-6">
  //               {/* Team Information */}
  //               <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
  //                 <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700 flex items-center gap-2">
  //                   <FiUsers className="text-yellow-400" />
  //                   Team Information
  //                 </h3>
  //                 <div className="mb-4">
  //                   <div className="flex items-center justify-between mb-3">
  //                     <div>
  //                       <p className="text-sm text-gray-400">Total Team Size</p>
  //                       <p className="text-2xl font-bold text-white">{manager.teamSize} members</p>
  //                     </div>
  //                     <div className="text-3xl">👥</div>
  //                   </div>

  //                   <div className="mb-4">
  //                     <p className="text-sm text-gray-400 mb-2">Salespersons Under Management</p>
  //                     <div className="space-y-2">
  //                       {manager.salespersonsUnder.map((salesperson) => (
  //                         <div key={salesperson.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
  //                           <div className="flex items-center gap-3">
  //                             <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center">
  //                               <FiUser className="text-blue-300" />
  //                             </div>
  //                             <div>
  //                               <p className="font-medium text-white text-sm">{salesperson.name}</p>
  //                               <p className="text-xs text-gray-400">ID: {salesperson.id}</p>
  //                             </div>
  //                           </div>
  //                           <span className={`px-2 py-1 text-xs rounded-full ${
  //                             salesperson.status === 'Active'
  //                               ? 'bg-green-900/30 text-green-300'
  //                               : 'bg-red-900/30 text-red-300'
  //                           }`}>
  //                             {salesperson.status}
  //                           </span>
  //                         </div>
  //                       ))}
  //                     </div>
  //                   </div>

  //                   <button className="w-full py-2 text-center text-blue-400 hover:text-blue-300 text-sm font-medium border border-gray-700 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center gap-2">
  //                     <FiUsers />
  //                     View Full Team Report →
  //                   </button>
  //                 </div>
  //               </div>

  //               {/* Quotation Statistics */}
  //               <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
  //                 <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700 flex items-center gap-2">
  //                   <FiFileText className="text-purple-400" />
  //                   Quotation Statistics
  //                 </h3>
  //                 <div className="grid grid-cols-2 gap-4 mb-4">
  //                   <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
  //                     <div className="flex items-center justify-between">
  //                       <div>
  //                         <p className="text-sm text-gray-400">Total Quotations</p>
  //                         <p className="text-2xl font-bold text-white">{manager.quotations.total}</p>
  //                       </div>
  //                       <div className="text-2xl">📊</div>
  //                     </div>
  //                   </div>
  //                   <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
  //                     <div className="flex items-center justify-between">
  //                       <div>
  //                         <p className="text-sm text-gray-400">Won Quotations</p>
  //                         <p className="text-2xl font-bold text-green-400">{manager.quotations.won}</p>
  //                       </div>
  //                       <div className="text-2xl">🏆</div>
  //                     </div>
  //                   </div>
  //                 </div>

  //                 <div className="grid grid-cols-2 gap-4">
  //                   <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
  //                     <div className="flex items-center justify-between">
  //                       <div>
  //                         <p className="text-sm text-gray-400">Accepted</p>
  //                         <p className="text-2xl font-bold text-blue-400">{manager.quotations.accepted}</p>
  //                       </div>
  //                       <FiCheckCircle className="text-2xl text-blue-400" />
  //                     </div>
  //                   </div>
  //                   <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
  //                     <div className="flex items-center justify-between">
  //                       <div>
  //                         <p className="text-sm text-gray-400">Rejected</p>
  //                         <p className="text-2xl font-bold text-red-400">{manager.quotations.rejected}</p>
  //                       </div>
  //                       <FiXCircle className="text-2xl text-red-400" />
  //                     </div>
  //                   </div>
  //                 </div>

  //                 <div className="mt-4 pt-4 border-t border-gray-700">
  //                   <div className="flex items-center justify-between">
  //                     <div>
  //                       <p className="text-sm text-gray-400">Pending</p>
  //                       <p className="text-xl font-bold text-yellow-400">{manager.quotations.pending}</p>
  //                     </div>
  //                     <div className="text-2xl">⏱️</div>
  //                   </div>
  //                 </div>

  //                 <div className="mt-4">
  //                   <button className="w-full py-2 text-center text-blue-400 hover:text-blue-300 text-sm font-medium border border-gray-700 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center gap-2">
  //                     <FiFileText />
  //                     View All Quotations →
  //                   </button>
  //                 </div>
  //               </div>

  //               {/* Performance Metrics */}
  //               <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
  //                 <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700">
  //                   Performance Metrics
  //                 </h3>
  //                 <div className="space-y-4">
  //                   <div className="flex justify-between items-center">
  //                     <div>
  //                       <p className="text-sm text-gray-400">Success Rate</p>
  //                       <p className="text-xl font-bold text-white">
  //                         {((manager.quotations.won / manager.quotations.total) * 100).toFixed(1)}%
  //                       </p>
  //                     </div>
  //                     <div className="text-2xl">📈</div>
  //                   </div>
  //                   <div className="flex justify-between items-center">
  //                     <div>
  //                       <p className="text-sm text-gray-400">Acceptance Rate</p>
  //                       <p className="text-xl font-bold text-white">
  //                         {((manager.quotations.accepted / manager.quotations.total) * 100).toFixed(1)}%
  //                       </p>
  //                     </div>
  //                     <div className="text-2xl">✅</div>
  //                   </div>
  //                   <div className="flex justify-between items-center">
  //                     <div>
  //                       <p className="text-sm text-gray-400">Rejection Rate</p>
  //                       <p className="text-xl font-bold text-white">
  //                         {((manager.quotations.rejected / manager.quotations.total) * 100).toFixed(1)}%
  //                       </p>
  //                     </div>
  //                     <div className="text-2xl">❌</div>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Modal Footer */}
  //         <div className="p-6 border-t border-gray-700 flex justify-between items-center sticky bottom-0 bg-gray-800">
  //           <div className="flex gap-3">
  //             {/* <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
  //               <FiMail />
  //               Send Message
  //             </button> */}
  //             <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
  //               <FiBriefcase />
  //               View Full Report
  //             </button>
  //           </div>
  //           <button
  //             onClick={onClose}
  //             className="px-6 py-2 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg text-sm font-medium transition-colors"
  //           >
  //             Close
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <AdminNavbar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Mobile Header with Menu Button */}
      {/* <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
            >
              {sidebarOpen ? <FiX className="text-lg" /> : <FiBriefcase className="text-lg" />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Managers</h1>
              <p className="text-gray-400 text-xs">Company managers list</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
          >
            ← Back
          </button>
        </div>
      </div> */}

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

          {/* Desktop Header (Hidden on mobile) */}
          {/* <div className="mb-6 hidden lg:block">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Managers</h1>
                <p className="text-gray-400 mt-1">
                  List of all managers in the company
                </p>
              </div>
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-sm"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div> */}

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
                    <React.Fragment key={manager.id}>
                      {/* Mobile View - Card Layout */}
                      <tr className="sm:hidden border-b border-gray-700">
                        <td colSpan="2" className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div
                                className="flex-1 cursor-pointer"
                                onClick={() => handleManagerClick(manager)}
                              >
                                <span className="font-bold text-purple-400">
                                  {manager.id}
                                </span>
                                <h3 className="font-semibold text-white mt-1 hover:text-blue-300 transition-colors">
                                  {manager.name}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                  {manager.role}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(manager.status)}`}
                              >
                                {manager.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">Email</p>
                                <div className="flex items-center gap-2">
                                  <FiMail className="text-blue-300 text-xs" />
                                  <p className="text-blue-300 text-sm truncate">
                                    {manager.email}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Phone</p>
                                <div className="flex items-center gap-2">
                                  <FiPhone className="text-green-300 text-xs" />
                                  <p className="text-green-300 text-sm">
                                    {manager.phone}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs">
                                  Department
                                </p>
                                <p className="text-orange-300 text-sm">
                                  {manager.department}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">
                                  Team Size
                                </p>
                                <p className="font-bold text-white text-sm">
                                  {manager.teamSize} members
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => handleManagerClick(manager)}
                              className="w-full py-2 text-center text-blue-400 hover:text-blue-300 text-sm font-medium border border-blue-500/30 hover:border-blue-500 rounded-lg transition-colors"
                            >
                              View Full Profile →
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Desktop/Tablet View - Table Layout */}
                      <tr
                        className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200 cursor-pointer"
                        onClick={() => handleManagerClick(manager)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FiUser className="text-purple-400" />
                            <span className="font-bold text-purple-400 text-sm hover:text-purple-300 transition-colors">
                              {manager.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white text-sm hover:text-blue-300 transition-colors">
                            {manager.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            Joined: {manager.joinDate}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FiMail className="text-blue-300 text-sm" />
                              <span className="text-blue-300 text-sm">
                                {manager.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiPhone className="text-green-300 text-sm" />
                              <span className="text-green-300 text-sm">
                                {manager.phone}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-orange-300 text-sm">
                          {manager.department}
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-sm">
                          {manager.role}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FiUsers className="text-yellow-300" />
                            <span className="font-bold text-white text-sm">
                              {manager.teamSize}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(manager.status)}`}
                          >
                            {manager.status}
                          </span>
                        </td>
                      </tr>
                    </React.Fragment>
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
