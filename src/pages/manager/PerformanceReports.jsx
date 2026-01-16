import React from 'react';

const PerformanceReports = () => {
  const performanceData = [
    {
      name: 'John Doe',
      totalQuotations: 25,
      approved: 18,
      successRate: '72%',
      revenue: '$28.5K',
      trend: 'up'
    },
    {
      name: 'Sarah Wilson',
      totalQuotations: 22,
      approved: 16,
      successRate: '73%',
      revenue: '$24.2K',
      trend: 'up'
    },
    {
      name: 'Mike Johnson',
      totalQuotations: 18,
      approved: 12,
      successRate: '67%',
      revenue: '$19.8K',
      trend: 'stable'
    },
    {
      name: 'Emily Davis',
      totalQuotations: 20,
      approved: 14,
      successRate: '70%',
      revenue: '$22.1K',
      trend: 'up'
    }
  ];

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-yellow-400';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Performance Reports</h1>
          <p className="text-gray-400 mt-1">Detailed performance analysis of your team members</p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-gray-700 hover:bg-gray-600 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white transition-colors duration-200">
            Export PDF
          </button>
          <button className="bg-green-600 hover:bg-green-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white transition-colors duration-200">
            Generate Report
          </button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base">Team Success Rate</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">70.5%</h2>
          <p className="text-green-400 text-xs sm:text-sm mt-1">+2.3% from last month</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base">Total Revenue</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">$94.6K</h2>
          <p className="text-green-400 text-xs sm:text-sm mt-1">+15% from last month</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base">Active Team Members</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">4</h2>
          <p className="text-blue-400 text-xs sm:text-sm mt-1">All performing</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base">Avg. Quotation Value</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">$4.2K</h2>
          <p className="text-green-400 text-xs sm:text-sm mt-1">+$300 from last month</p>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Team Member</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Total Quotations</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Approved</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Success Rate</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Revenue</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Trend</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {performanceData.map((member, index) => (
                <tr key={index} className="hover:bg-gray-750 transition-colors duration-200">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{member.name}</div>
                  </td>
                  <td className="px-4 py-3 text-white">{member.totalQuotations}</td>
                  <td className="px-4 py-3 text-green-400 font-medium">{member.approved}</td>
                  <td className="px-4 py-3">
                    <span className="text-yellow-400 font-bold">{member.successRate}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-white">{member.revenue}</td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 ${getTrendColor(member.trend)}`}>
                      <span>{getTrendIcon(member.trend)}</span>
                      <span className="text-sm capitalize">{member.trend}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Team Performance Insights</h3>
          <div className="space-y-3 text-gray-300">
            <p>• Team is exceeding quarterly targets by 15%</p>
            <p>• Average response time: 2.3 hours</p>
            <p>• Customer satisfaction score: 4.7/5</p>
            <p>• Top performer: John Doe (72% success rate)</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
          <div className="space-y-3 text-gray-300">
            <p>• Provide advanced sales training for Mike Johnson</p>
            <p>• Implement mentorship program between senior and junior members</p>
            <p>• Review and optimize quotation approval process</p>
            <p>• Schedule weekly performance review meetings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReports;