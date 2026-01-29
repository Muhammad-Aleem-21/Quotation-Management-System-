import React from 'react';
import { FiX, FiFileText, FiCheck, FiDollarSign, FiCalendar } from 'react-icons/fi';

const SalespersonProfileModal = ({ showModal, selectedMember, onClose }) => {
  const getStatusColor = (status) => {
    return status === "Active" ? "bg-green-500/20 text-green-300" : 
           status === "On Leave" ? "bg-yellow-500/20 text-yellow-300" : "bg-red-500/20 text-red-300";
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case "Excellent": return "bg-green-500/20 text-green-300";
      case "Good": return "bg-blue-500/20 text-blue-300";
      case "Needs Improvement": return "bg-yellow-500/20 text-yellow-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  if (!showModal || !selectedMember) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <div>
            <h2 className="text-xl font-bold text-white">{selectedMember.name}'s Profile</h2>
            <p className="text-gray-400 text-sm">Salesperson performance and details</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedMember.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedMember.name}</h3>
                  <p className="text-gray-400">{selectedMember.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMember.status)}`}>
                      {selectedMember.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPerformanceColor(selectedMember.performance)}`}>
                      {selectedMember.performance}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">{selectedMember.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Contact</p>
                  <p className="text-white font-medium">{selectedMember.contact}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Area</p>
                  <p className="text-white font-medium">{selectedMember.area}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Join Date</p>
                  <p className="text-white font-medium">{selectedMember.joinDate}</p>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="flex-1">
              <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <h4 className="font-semibold text-white mb-3">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Experience</p>
                    <p className="text-white font-bold">{new Date().getFullYear() - selectedMember.joinYear} years</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Active Projects</p>
                    <p className="text-white font-bold">{selectedMember.activeProjects}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quotation Performance */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FiFileText className="text-blue-400" />
              Quotation Performance
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <FiFileText className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Created</p>
                      <p className="text-2xl font-bold text-white">{selectedMember.quotationsCreated}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-xs">Total quotations submitted</p>
              </div>

              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <FiCheck className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Approved</p>
                      <p className="text-2xl font-bold text-white">{selectedMember.quotationsApproved}</p>
                    </div>
                  </div>
                  {selectedMember.quotationsCreated > 0 && (
                    <span className="text-green-400 text-sm font-medium">
                      {((selectedMember.quotationsApproved / selectedMember.quotationsCreated) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs">Manager approved quotations</p>
              </div>

              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <FiDollarSign className="text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Won</p>
                      <p className="text-2xl font-bold text-white">{selectedMember.quotationsWon}</p>
                    </div>
                  </div>
                  {selectedMember.quotationsApproved > 0 && (
                    <span className="text-yellow-400 text-sm font-medium">
                      {((selectedMember.quotationsWon / selectedMember.quotationsApproved) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs">Converted to projects</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                <h4 className="font-semibold text-white mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">Approval Rate</span>
                      <span className="text-blue-400 text-sm font-medium">
                        {selectedMember.quotationsCreated > 0 
                          ? ((selectedMember.quotationsApproved / selectedMember.quotationsCreated) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ 
                          width: `${selectedMember.quotationsCreated > 0 
                            ? (selectedMember.quotationsApproved / selectedMember.quotationsCreated) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">Win Rate</span>
                      <span className="text-green-400 text-sm font-medium">
                        {selectedMember.quotationsApproved > 0
                          ? ((selectedMember.quotationsWon / selectedMember.quotationsApproved) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ 
                          width: `${selectedMember.quotationsApproved > 0
                            ? (selectedMember.quotationsWon / selectedMember.quotationsApproved) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                <h4 className="font-semibold text-white mb-3">Revenue Summary</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="text-yellow-400" />
                      <span className="text-gray-400">Total Revenue</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-400">{selectedMember.totalRevenue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-blue-400" />
                      <span className="text-gray-400">Avg. Revenue/Quote</span>
                    </div>
                    <span className="text-white font-medium">
                      {selectedMember.quotationsWon > 0 
                        ? `$${(parseFloat(selectedMember.totalRevenue.replace('$', '').replace(',', '')) / selectedMember.quotationsWon).toFixed(2)}`
                        : '$0'}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-700">
                    <p className="text-gray-400 text-sm">Current Active Quotations</p>
                    <p className="text-white font-bold text-xl">{selectedMember.currentQuotations}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {selectedMember.currentQuotations > 0 && (
                <div className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Working on {selectedMember.currentQuotations} active quotations</span>
                  </div>
                  <span className="text-gray-400 text-sm">Now</span>
                </div>
              )}
              <div className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Last quotation approved {selectedMember.quotationsApproved > 0 ? 'recently' : 'never'}</span>
                </div>
                <span className="text-gray-400 text-sm">-</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">Total projects won: {selectedMember.quotationsWon}</span>
                </div>
                <span className="text-gray-400 text-sm">-</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
              View Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalespersonProfileModal;