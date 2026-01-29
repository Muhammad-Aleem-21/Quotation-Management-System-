
import React from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ---------------------------------------------------
//  Dummy Data 
// ---------------------------------------------------
const quotationStats = {
  approved: 18,
  rejected: 7,
  pending: 5,
  win: 3,
};

const quotationTrend = [
  { month: "Jan", approved: 5, rejected: 2, win: 0 },
  { month: "Feb", approved: 6, rejected: 1, win: 0 },
  { month: "Mar", approved: 4, rejected: 3, win: 0 },
  { month: "Apr", approved: 7, rejected: 2, win: 2 },
  { month: "May", approved: 8, rejected: 4, win: 1 },
];

const statusDistribution = [
  { name: "Approved", value: quotationStats.approved },
  { name: "Rejected", value: quotationStats.rejected },
  { name: "Pending", value: quotationStats.pending },
  { name: "Win", value: quotationStats.win },
];

const COLORS = ["#10B981", "#EF4444", "#F59E0B"]; // green, red, yellow

// ---------------------------------------------------
// 🔵 Salesperson Dashboard Page
// ---------------------------------------------------
const SalespersonDashboard = () => {
  const navigate = useNavigate(); // Add this line
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Salesperson Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Welcome back, <span className="text-orange-400 font-semibold">{user.name || 'Salesperson'}</span>! Overview of your quotation performance
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        
        <div 
            className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-colors duration-200 cursor-pointer"
            onClick={() => navigate('/accepted-quotations')} // Add this onClick
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-gray-400 text-sm sm:text-base">Approved</h2>
                <p className="text-2xl sm:text-3xl font-bold text-green-400 mt-1 sm:mt-2">
                  {quotationStats.approved} {/* Or use your actual count */}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
                📋
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">View all accepted quotations →</p>
          </div>
        

          

        
        <div 
          className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 hover:border-red-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/rejected-quotations')} // Add this line
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-400 text-sm sm:text-base">Rejected</h2>
              <p className="text-2xl sm:text-3xl font-bold text-red-400 mt-1 sm:mt-2">
                {quotationStats.rejected}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
              ✗
            </div>
          </div>
        </div>
          
         
        <div 
          className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 hover:border-yellow-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/pending-quotations')} // Add this line
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-400 text-sm sm:text-base">Pending</h2>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-400 mt-1 sm:mt-2">
                {quotationStats.pending}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
              ⏳
            </div>
          </div>
        </div>

        <div 
          className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/win-quotations')} // Add this line
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-400 text-sm sm:text-base">Win Quotations</h2>
              <p className="text-2xl sm:text-3xl font-bold text-blue-400 mt-1 sm:mt-2">
                {quotationStats.win}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
              ⏳
            </div>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 🔵 Line Chart (Quotation Trend) */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Quotation Trend</h2>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quotationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="approved"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="rejected"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🔵 Pie Chart (Status Distribution) */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Status Distribution</h2>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Activity Section */}
      <div className="mt-6 sm:mt-8 bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-750 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm sm:text-base">QT-024 approved by Admin</span>
            </div>
            <span className="text-gray-400 text-xs sm:text-sm">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-750 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm sm:text-base">QT-025 submitted for review</span>
            </div>
            <span className="text-gray-400 text-xs sm:text-sm">1 day ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-750 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-sm sm:text-base">QT-023 rejected - Budget issues</span>
            </div>
            <span className="text-gray-400 text-xs sm:text-sm">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalespersonDashboard;