import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTeamStats } from "../../api/api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ManagerDashboard = () => {
  const navigate = useNavigate();

  // Sample data for charts (fallback until API provides it)
  const teamPerformance = [
    { name: "Salesperson A", quotations: 12, approved: 8, revenue: 12500 },
    { name: "Salesperson B", quotations: 10, approved: 7, revenue: 10800 },
    { name: "Salesperson C", quotations: 8, approved: 5, revenue: 8200 },
    { name: "Salesperson D", quotations: 9, approved: 6, revenue: 9100 },
  ];

  const monthlyTrend = [
    { month: "Jan", team: 15, approved: 10 },
    { month: "Feb", team: 18, approved: 12 },
    { month: "Mar", team: 22, approved: 15 },
    { month: "Apr", team: 20, approved: 14 },
    { month: "May", team: 24, approved: 18 },
  ];

  const recentActivities = [
    { action: "New quotation submitted", user: "Salesperson A", time: "30 mins ago", type: "quotation" },
    { action: "Quotation approved", user: "Salesperson B", time: "2 hours ago", type: "approval" },
  ];

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSalespersons: 0,
    activeQuotations: 0,
    teamRevenue: 0,
    pendingApprovals: 0,
    rejectedQuotations: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id?.toString();

      const response = await getTeamStats();
      if (response.data.success && response.data.dashboard_stats) {
        const ds = response.data.dashboard_stats;
        
        // Filter my_team by the logged-in manager's ID
        const myActualTeam = (ds.my_team || []).filter(member => 
          member.manager_id?.toString() === userId || 
          member.parent_id?.toString() === userId
        );

        setStats({
          totalSalespersons: myActualTeam.length,
          activeQuotations: ds.active_quotations || 0,
          teamRevenue: ds.team_revenue || 0,
          pendingApprovals: ds.pending_approvals || 0,
          rejectedQuotations: ds.rejected_quotations || 0
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Manager Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Welcome back, <span className="text-green-400 font-semibold">{user.name || 'Manager'}</span>! Overview of your team's performance and activities
        </p>
      </div>

      {/* Team Stats - Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div
          className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate("/team-management")}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-400 text-sm sm:text-base">
                Total Salespersons
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-green-400 mt-1 sm:mt-2">
                {loading ? "..." : stats.totalSalespersons}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
              👥
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-2">Click to view →</p>
        </div>

        <div
          className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 hover:border-yellow-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate("/active-quotations")}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-400 text-sm sm:text-base">
                Active Quotations
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-400 mt-1 sm:mt-2">
                {loading ? "..." : stats.activeQuotations}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
              📋
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-2">Click to view →</p>
        </div>
        {/* Team Revenue card */}
        {/* <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 sm:p-6 rounded-xl border border-yellow-500/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Team Revenue</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{teamStats.teamRevenue}</h2>
              <p className="text-yellow-400 text-xs sm:text-sm mt-1">This month</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              💰
            </div>
          </div>
        </div> */}
        <div
          className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate("/team-revenue")}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-400 text-sm sm:text-base">
                Team Revenue
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-purple-400 mt-1 sm:mt-2">
                {loading ? "..." : (typeof stats.teamRevenue === 'number' ? `$${stats.teamRevenue.toLocaleString()}` : stats.teamRevenue)}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
              💰
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-2">Click to view →</p>
        </div>
      </div>

      {/* Quotation Status Stats - Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Pending Approvals */}
        {/* <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 p-4 sm:p-6 rounded-xl border border-orange-500/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Pending Approvals</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{teamStats.pendingApprovals}</h2>
              <p className="text-orange-400 text-xs sm:text-sm mt-1">Requires action</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              ⏳
            </div>
          </div>
        </div> */}
        <div
          className="bg-gradient-to-br from-orange-500/20 to-red-500/20 p-4 sm:p-6 rounded-xl border border-orange-500/30 cursor-pointer hover:border-orange-500 transition-colors duration-200"
          onClick={() => navigate("/manager/pending")}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">
                Pending Approvals
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
                {loading ? "..." : stats.pendingApprovals}
              </h2>
              <p className="text-orange-400 text-xs sm:text-sm mt-1">
                Requires action
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
              ⏳
            </div>
          </div>
        </div>

        <div
          className="bg-gradient-to-br from-red-500/20 to-rose-500/20 p-4 sm:p-6 rounded-xl border border-red-500/30 cursor-pointer hover:border-red-500 transition-colors duration-200"
          onClick={() => navigate("/manager/rejected")}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">
                Rejected Quotations
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
                {loading ? "..." : stats.rejectedQuotations}
              </h2>
              <p className="text-red-400 text-xs sm:text-sm mt-1">
                {stats.activeQuotations > 0 ? ((stats.rejectedQuotations / stats.activeQuotations) * 100).toFixed(1) : 0}% of active
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
        {/* Team Performance Trend */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Team Performance Trend
          </h2>
          <div className="h-64 sm:h-72 min-h-[300px]">
            {" "}
            {/* Added min-height here */}
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              {" "}
              {/* Added minWidth={0} */}
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="team"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", strokeWidth: 2 }}
                  name="Team Quotations"
                />
                <Line
                  type="monotone"
                  dataKey="approved"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", strokeWidth: 2 }}
                  name="Approved"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Member Performance */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Team Member Performance
          </h2>
          <div className="h-64 sm:h-72 min-h-[300px]">
            {" "}
            {/* Added min-height here */}
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              {" "}
              {/* Added minWidth={0} */}
              <BarChart data={teamPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Legend />
                <Bar dataKey="quotations" fill="#10B981" name="Quotations" />
                <Bar dataKey="approved" fill="#3B82F6" name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Recent Team Activities
          </h2>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-750 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "quotation"
                        ? "bg-blue-400"
                        : activity.type === "approval"
                          ? "bg-green-400"
                          : activity.type === "meeting"
                            ? "bg-purple-400"
                            : "bg-yellow-400"
                    }`}
                  ></div>
                  <div>
                    <span className="text-sm sm:text-base">
                      {activity.action}
                    </span>
                    <span className="text-gray-400 text-xs block">
                      by {activity.user}
                    </span>
                  </div>
                </div>
                <span className="text-gray-400 text-xs sm:text-sm">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-green-600 hover:bg-green-700 rounded-xl text-white font-medium transition-colors duration-200">
              Team Management
            </button>
            <button className="p-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors duration-200">
              View Reports
            </button>
            <button className="p-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors duration-200">
              Schedule Meeting
            </button>
            <button className="p-4 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-white font-medium transition-colors duration-200">
              Performance Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
