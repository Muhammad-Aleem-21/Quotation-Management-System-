
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import API from "../../api/api";

const COLORS = ["#10B981", "#EF4444", "#F59E0B", "#3B82F6"]; // green, red, yellow, blue

// ---------------------------------------------------
// 🔵 Salesperson Dashboard Page
// ---------------------------------------------------
const SalespersonDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const [loading, setLoading] = useState(true);
  const [quotationStats, setQuotationStats] = useState({
    approved: 0,
    rejected: 0,
    pending: 0,
    win: 0,
  });

  const [performanceStats, setPerformanceStats] = useState({
    leads: 0,
    conversions: 0,
    revenue: 0,
  });

  const [quotationTrend, setQuotationTrend] = useState([
    { month: "Jan", approved: 0, rejected: 0, win: 0 },
    { month: "Feb", approved: 0, rejected: 0, win: 0 },
    { month: "Mar", approved: 0, rejected: 0, win: 0 },
    { month: "Apr", approved: 0, rejected: 0, win: 0 },
    { month: "May", approved: 0, rejected: 0, win: 0 },
  ]);

  useEffect(() => {
    fetchQuotationStats();
    fetchPerformanceStats();
  }, []);

  const fetchPerformanceStats = async () => {
    try {
      // const response = await API.get("/dashboard/stats");
      const response = { data: { success: true, dashboard_stats: {} } };
      if (response.data.success && response.data.dashboard_stats) {
        const perf = response.data.dashboard_stats.performance;
        setPerformanceStats({
          leads: perf.leads || 0,
          conversions: perf.conversions || 0,
          revenue: perf.revenue || 0,
        });
      }
    } catch (error) {
      console.warn("Error fetching performance stats:", error.message);
    }
  };

  const fetchQuotationStats = async () => {
    try {
      setLoading(true);
      // Get the salesperson ID from the user profile
      const profileResponse = await API.get("/profile");
      if (profileResponse.data.success) {
        const salespersonId = profileResponse.data.profile.id;
        
        // Fetch approved quotations
        try {
          // const approvedResponse = await API.get(`/quotations/${salespersonId}/approve`);
          const approvedResponse = { data: { quotations: [] } };
          if (approvedResponse.data) {
            const approvedCount = approvedResponse.data.quotations?.length || 
                                 approvedResponse.data.data?.length || 
                                 approvedResponse.data.length || 0;
            
            setQuotationStats(prev => ({
              ...prev,
              approved: approvedCount
            }));
          }
        } catch (error) {
          console.warn("Error fetching approved quotations:", error.message);
        }

        // Fetch rejected quotations
        try {
          // const rejectedResponse = await API.get(`/quotations/${salespersonId}/reject`);
          const rejectedResponse = { data: { quotations: [] } };
          if (rejectedResponse.data) {
            const rejectedCount = rejectedResponse.data.quotations?.length || 
                                 rejectedResponse.data.data?.length || 
                                 rejectedResponse.data.length || 0;
            
            setQuotationStats(prev => ({
              ...prev,
              rejected: rejectedCount
            }));
          }
        } catch (error) {
          console.warn("Error fetching rejected quotations:", error.message);
        }
      }
    } catch (error) {
      console.error("Error fetching salesperson profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusDistribution = [
    { name: "Approved", value: quotationStats.approved },
    { name: "Rejected", value: quotationStats.rejected },
    { name: "Pending", value: quotationStats.pending },
    { name: "Win", value: quotationStats.win },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Salesperson Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Welcome back, <span className="text-orange-400 font-semibold">{user.name || 'Salesperson'}</span>! Overview of your quotation performance
        </p>
      </div>

      {/* Performance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Total Leads */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 p-4 sm:p-6 rounded-2xl border border-blue-500/30 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="text-8xl">🎯</span>
          </div>
          <div className="relative z-10">
            <p className="text-blue-300 text-sm font-medium uppercase tracking-wider">Total Leads</p>
            <div className="flex items-end gap-2 mt-2">
              <h2 className="text-3xl sm:text-4xl font-black text-white">{performanceStats.leads}</h2>
              <span className="text-blue-400 text-xs mb-1 mb-2 font-semibold">Active Leads</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
              <p className="text-gray-400 text-xs">Updated via dashboard API</p>
            </div>
          </div>
        </div>

        {/* Conversions */}
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 p-4 sm:p-6 rounded-2xl border border-purple-500/30 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="text-8xl">🚀</span>
          </div>
          <div className="relative z-10">
            <p className="text-purple-300 text-sm font-medium uppercase tracking-wider">Conversions</p>
            <div className="flex items-end gap-2 mt-2">
              <h2 className="text-3xl sm:text-4xl font-black text-white">{performanceStats.conversions}</h2>
              <span className="text-purple-400 text-xs mb-1 mb-2 font-semibold">
                {performanceStats.leads > 0 
                  ? `${((performanceStats.conversions / performanceStats.leads) * 100).toFixed(1)}% Rate`
                  : '0% Rate'
                }
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
              <p className="text-gray-400 text-xs">Total successful deals</p>
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 p-4 sm:p-6 rounded-2xl border border-emerald-500/30 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="text-8xl">💰</span>
          </div>
          <div className="relative z-10">
            <p className="text-emerald-300 text-sm font-medium uppercase tracking-wider">Monthly Revenue</p>
            <div className="flex items-end gap-2 mt-2">
              <h2 className="text-3xl sm:text-4xl font-black text-white">${performanceStats.revenue.toLocaleString()}</h2>
              <span className="text-emerald-400 text-xs mb-1 mb-2 font-semibold">Target: $20k</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-gray-400 text-xs">Current month earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quotation Status Section Header */}
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="w-8 h-1 bg-orange-500 rounded-full"></span>
        Quotation Statistics
      </h3>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        
        <div 
          className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/accepted-quotations')}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-400 text-sm sm:text-base">Approved</h2>
              <p className="text-2xl sm:text-3xl font-bold text-green-400 mt-1 sm:mt-2">
                {loading ? (
                  <span className="inline-block w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  quotationStats.approved
                )}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
              ✓
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-2">View all approved quotations →</p>
        </div>
      

        <div 
          className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 hover:border-red-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/rejected-quotations')}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-400 text-sm sm:text-base">Rejected</h2>
              <p className="text-2xl sm:text-3xl font-bold text-red-400 mt-1 sm:mt-2">
                {loading ? (
                  <span className="inline-block w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  quotationStats.rejected
                )}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
              ✗
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-2">View all rejected quotations →</p>
        </div>
          
         
        <div 
          className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 hover:border-yellow-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/pending-quotations')}
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
          <p className="text-gray-500 text-xs mt-2">View all pending quotations →</p>
        </div>

        <div 
          className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/win-quotations')}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-400 text-sm sm:text-base">Win Quotations</h2>
              <p className="text-2xl sm:text-3xl font-bold text-blue-400 mt-1 sm:mt-2">
                {quotationStats.win}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
              🏆
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-2">View all win quotations →</p>
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