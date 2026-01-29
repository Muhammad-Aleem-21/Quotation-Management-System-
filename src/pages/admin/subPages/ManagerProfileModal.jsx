import React from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

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

export default ManagerProfileModal;