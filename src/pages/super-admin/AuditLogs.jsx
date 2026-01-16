import React from 'react';

const AuditLogs = () => {
  const auditLogs = [
    {
      id: 1,
      action: "User Login",
      user: "super.admin@company.com",
      ip: "192.168.1.100",
      timestamp: "2024-01-20 14:30:25",
      status: "Success"
    },
    {
      id: 2,
      action: "Settings Updated",
      user: "admin@company.com",
      ip: "192.168.1.101",
      timestamp: "2024-01-20 14:25:10",
      status: "Success"
    },
    {
      id: 3,
      action: "User Created",
      user: "super.admin@company.com",
      ip: "192.168.1.100",
      timestamp: "2024-01-20 13:45:33",
      status: "Success"
    },
    {
      id: 4,
      action: "Failed Login Attempt",
      user: "unknown@company.com",
      ip: "192.168.1.105",
      timestamp: "2024-01-20 13:30:15",
      status: "Failed"
    },
    {
      id: 5,
      action: "Quotation Deleted",
      user: "manager@company.com",
      ip: "192.168.1.102",
      timestamp: "2024-01-20 12:15:42",
      status: "Success"
    }
  ];

  const getStatusColor = (status) => {
    return status === "Success" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300";
  };

  const getActionColor = (action) => {
    if (action.includes("Login")) return "bg-blue-500/20 text-blue-300";
    if (action.includes("Created")) return "bg-green-500/20 text-green-300";
    if (action.includes("Deleted")) return "bg-red-500/20 text-red-300";
    if (action.includes("Updated")) return "bg-yellow-500/20 text-yellow-300";
    return "bg-gray-500/20 text-gray-300";
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Audit Logs</h1>
          <p className="text-gray-400 mt-1">Monitor all system activities and user actions</p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-gray-700 hover:bg-gray-600 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white transition-colors duration-200">
            Export Logs
          </button>
          <button className="bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white transition-colors duration-200">
            Clear Logs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base">Total Logs</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{auditLogs.length}</h2>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base">Successful</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {auditLogs.filter(log => log.status === "Success").length}
          </h2>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base">Failed</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {auditLogs.filter(log => log.status === "Failed").length}
          </h2>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base">Today</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {auditLogs.filter(log => log.timestamp.includes("2024-01-20")).length}
          </h2>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Action</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">User</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">IP Address</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Timestamp</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-750 transition-colors duration-200">
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{log.user}</td>
                  <td className="px-4 py-3 text-gray-300">{log.ip}</td>
                  <td className="px-4 py-3 text-gray-300">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200">
                      View Details
                    </button>
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

export default AuditLogs;