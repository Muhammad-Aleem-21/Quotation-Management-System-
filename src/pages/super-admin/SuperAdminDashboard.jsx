import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await API.get("/dashboard/stats");
        if (response.data.success) {
          setStats(response.data.dashboard_stats);
        } else {
          setError("Failed to fetch dashboard statistics");
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("An error occurred while loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Format data for components
  const displayStats = {
    totalUsers: stats?.total_users || 0,
    admins: stats?.total_admins || 0,
    managers: stats?.total_managers || 0,
    salespersons: stats?.total_salespersons || 0,
    // Keep dummy values for these as they are not in the current stats API response
    activeUsers: Math.floor((stats?.total_users || 0) * 0.9), // Estimating based on total
    totalQuotations: 847,
    acceptedQuotations: 512,
    rejectedQuotations: 185,
    pendingQuotations: 150,
    winQuotations: 420,
  };

  const roleDistribution = [
    { name: "Salespersons", value: displayStats.salespersons },
    { name: "Managers", value: displayStats.managers },
    { name: "Admins", value: displayStats.admins },
    { name: "Super Admins", value: stats?.total_users - (displayStats.salespersons + displayStats.managers + displayStats.admins) || 2 }
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const recentActivities = stats?.recent_users?.map(u => ({
    action: "New user joined",
    user: u.name,
    time: new Date(u.created_at).toLocaleDateString(),
    type: "user"
  })) || [];

  const userGrowth = [
    { month: "Jan", users: 120, quotations: 180 },
    { month: "Feb", users: 135, quotations: 210 },
    { month: "Mar", users: 142, quotations: 195 },
    { month: "Apr", users: 148, quotations: 230 },
    { month: "May", users: displayStats.totalUsers, quotations: 245 },
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="bg-gray-800 p-8 rounded-2xl border border-red-500/30 text-center max-w-md w-full">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Welcome back, <span className="text-red-400 font-semibold">{user.name || 'Super Admin'}</span>! Complete system overview and management
        </p>
      </div>

      {/* System Stats - User Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Active Users */}
        <div 
          onClick={() => navigate('/active-list')}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 sm:p-6 rounded-xl border border-green-500/30 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Active Users</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{displayStats.activeUsers}</h2>
              <p className="text-green-400 text-xs sm:text-sm mt-1">
                {((displayStats.activeUsers / displayStats.totalUsers) * 100).toFixed(1)}% of total
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              👥
            </div>
          </div>
        </div>
        
        {/* Admins */}
        <div 
          onClick={() => navigate('/admin-list')}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 sm:p-6 rounded-xl border border-purple-500/30 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Admins</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{displayStats.admins}</h2>
              <p className="text-purple-400 text-xs sm:text-sm mt-1">
                {((displayStats.admins / displayStats.totalUsers) * 100).toFixed(1)}% of users
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              ⚙️
            </div>
          </div>
        </div>
        
        {/* Managers */}
        <div 
          onClick={() => navigate('/manager-list')}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 sm:p-6 rounded-xl border border-blue-500/30 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Managers</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{displayStats.managers}</h2>
              <p className="text-blue-400 text-xs sm:text-sm mt-1">
                {((displayStats.managers / displayStats.totalUsers) * 100).toFixed(1)}% of users
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              👨‍💼
            </div>
          </div>
        </div>
        
        {/* Salespersons */}
        <div 
          onClick={() => navigate('/salesperson-list')}
          className="bg-gradient-to-br from-red-500/20 to-orange-500/20 p-4 sm:p-6 rounded-xl border border-red-500/30 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Salespersons</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{displayStats.salespersons}</h2>
              <p className="text-red-400 text-xs sm:text-sm mt-1">
                {((displayStats.salespersons / displayStats.totalUsers) * 100).toFixed(1)}% of users
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              📊
            </div>
          </div>
        </div>
      </div>

      {/* Quotation Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Accepted Quotations */}
        <div 
          onClick={() => navigate('/accepted-list')}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 sm:p-6 rounded-xl border border-green-500/30 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Accepted Quotations</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{displayStats.acceptedQuotations}</h2>
              <p className="text-green-400 text-xs sm:text-sm mt-1">
                {((displayStats.acceptedQuotations / displayStats.totalQuotations) * 100).toFixed(1)}% of total
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              ✅
            </div>
          </div>
        </div>
        
        {/* Win Quotations */}
        <div 
          onClick={() => navigate('/win-list')}
          className="bg-gradient-to-br from-teal-500/20 to-emerald-500/20 p-4 sm:p-6 rounded-xl border border-teal-500/30 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Win Quotations</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{displayStats.winQuotations}</h2>
              <div className="flex flex-col mt-1">
                <p className="text-teal-400 text-xs sm:text-sm">
                  {((displayStats.winQuotations / displayStats.totalQuotations) * 100).toFixed(1)}% of total
                </p>
                <p className="text-emerald-300 text-xs">
                  {((displayStats.winQuotations / displayStats.acceptedQuotations) * 100).toFixed(1)}% of accepted
                </p>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              🏆
            </div>
          </div>
        </div>
        
        {/* Pending Quotations */}
        <div 
          onClick={() => navigate('/pending-list')}
          className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 p-4 sm:p-6 rounded-xl border border-yellow-500/30 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Pending Quotations</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{displayStats.pendingQuotations}</h2>
              <p className="text-yellow-400 text-xs sm:text-sm mt-1">
                {((displayStats.pendingQuotations / displayStats.totalQuotations) * 100).toFixed(1)}% of total
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              ⏳
            </div>
          </div>
        </div>
        
        {/* Rejected Quotations */}
        <div 
          onClick={() => navigate('/rejected-list')}
          className="bg-gradient-to-br from-red-500/20 to-rose-500/20 p-4 sm:p-6 rounded-xl border border-red-500/30 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Rejected Quotations</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{displayStats.rejectedQuotations}</h2>
              <p className="text-red-400 text-xs sm:text-sm mt-1">
                {((displayStats.rejectedQuotations / displayStats.totalQuotations) * 100).toFixed(1)}% of total
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              ❌
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth Chart */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">User & Quotation Growth</h2>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend />
                <Bar dataKey="users" fill="#EF4444" name="Users" />
                <Bar dataKey="quotations" fill="#3B82F6" name="Quotations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">User Role Distribution</h2>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-750 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'user' ? 'bg-green-400' :
                    activity.type === 'system' ? 'bg-blue-400' :
                    activity.type === 'quotation' ? 'bg-purple-400' : 
                    activity.type === 'payment' ? 'bg-teal-400' : 'bg-yellow-400'
                  }`}></div>
                  <div>
                    <span className="text-sm sm:text-base">{activity.action}</span>
                    <span className="text-gray-400 text-xs block">by {activity.user}</span>
                  </div>
                </div>
                <span className="text-gray-400 text-xs sm:text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/user-management')}
              className="p-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors duration-200 cursor-pointer"
            >
              User Management
            </button>
            <button 
              onClick={() => navigate('/system-settings')}
              className="p-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors duration-200 cursor-pointer"
            >
              System Settings
            </button>
            <button 
              onClick={() => navigate('/backup')}
              className="p-4 bg-green-600 hover:bg-green-700 rounded-xl text-white font-medium transition-colors duration-200 cursor-pointer"
            >
              Backup System
            </button>
            <button 
              onClick={() => navigate('/reports')}
              className="p-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors duration-200 cursor-pointer"
            >
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SuperAdminDashboard;