import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { getTeamStats, getQuotations } from "../../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiPlus, FiCheckCircle, FiXCircle } from "react-icons/fi";

const DashboardData = {
  stats: [
    {
      title: "Total Quotations",
      value: 164,
      change: "+12% this month",
      iconBg: "bg-blue-600",
      route: "/admin/total-quotations",
    },
    {
      title: "Pending",
      value: 30,
      change: "-2% this month",
      iconBg: "bg-yellow-500",
      route: "/admin/pending",
    },
    {
      title: "Approved",
      value: 98,
      change: "+9% this month",
      iconBg: "bg-green-600",
      route: "/admin/approved",
    },
    {
      title: "Rejected",
      value: 36,
      change: "+4% this month",
      iconBg: "bg-red-600",
      route: "/admin/rejected",
    },
    {
      title: "Managers",
      value: 0,
      change: "Live Data",
      iconBg: "bg-purple-600",
      route: "/admin-team-management?tab=managers",
    },
    {
      title: "Salespersons",
      value: 0,
      change: "Live Data",
      iconBg: "bg-indigo-600",
      route: "/admin-team-management?tab=salespersons",
    },
  ],

  userStats: [
    {
      title: "Managers",
      value: 0,
      change: "In your team",
      icon: "👨‍💼",
      bgColor: "bg-gradient-to-br from-purple-500/20 to-purple-800/20",
      borderColor: "border-purple-500/30",
      route: "/admin-team-management?tab=managers",
    },
    {
      title: "Salespersons",
      value: 0,
      change: "In your team",
      icon: "👥",
      bgColor: "bg-gradient-to-br from-indigo-500/20 to-indigo-800/20",
      borderColor: "border-indigo-500/30",
      route: "/admin-team-management?tab=salespersons",
    },
    {
      title: "Win Quotations",
      value: 45,
      change: "+8 this month",
      icon: "👥",
      bgColor: "bg-gradient-to-br from-indigo-500/20 to-indigo-800/20",
      borderColor: "border-indigo-500/30",
      route: "/admin/win",
    },
  ],

  trend: [
    { month: "Jan", approved: 40, rejected: 10 },
    { month: "Feb", approved: 55, rejected: 14 },
    { month: "Mar", approved: 60, rejected: 12 },
    { month: "Apr", approved: 70, rejected: 15 },
    { month: "May", approved: 65, rejected: 20 },
    { month: "Jun", approved: 80, rejected: 18 },
  ],

  statusDistribution: [
    { name: "Approved", value: 98 },
    { name: "Rejected", value: 36 },
    { name: "Pending", value: 30 },
  ],
};

const COLORS = ["#16a34a", "#dc2626", "#f59e0b"]; // green, red, yellow

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = (user.role || "").toLowerCase();
  const [liveStats, setLiveStats] = useState({ managers: 0, salespersons: 0 });
  const [quoteStats, setQuoteStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    win: 0
  });

  React.useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [statsResponse, quotesResponse] = await Promise.all([
          getTeamStats(),
          getQuotations()
        ]);

        if (statsResponse.data.success) {
          const myTeam = statsResponse.data.dashboard_stats.my_team || [];
          const adminId = String(user.id);
          const myAdminTeam = myTeam.filter(
            (member) => String(member.created_by_admin) === adminId
          );

          const managersCount = myAdminTeam.filter(
            (m) => m.manager_id === null || m.role?.toLowerCase() === "manager"
          ).length;
          const salesCount = myAdminTeam.filter(
            (m) => m.manager_id !== null || m.role?.toLowerCase() === "salesperson"
          ).length;

          setLiveStats({
            managers: managersCount,
            salespersons: salesCount,
          });
        }

        if (quotesResponse.data) {
          const allQuotes = quotesResponse.data.data || quotesResponse.data.quotations || quotesResponse.data || [];
          
          let scopedQuotes = allQuotes;
          
          if (userRole === 'admin') {
            const myTeam = statsResponse.data.dashboard_stats?.my_team || [];
            const adminId = String(user.id);
            const branchUserIds = myTeam
              .filter(member => String(member.created_by_admin) === adminId || String(member.id) === adminId)
              .map(member => String(member.id));

            scopedQuotes = allQuotes.filter(quote => {
              const creatorId = String(quote.user_id || quote.salesperson_id || quote.user?.id || "");
              return branchUserIds.includes(creatorId);
            });
          }
          
          const stats = {
            total: scopedQuotes.length,
            pending: scopedQuotes.filter(q => ['pending', 'submitted', 'revised'].includes(q.status?.toLowerCase())).length,
            approved: scopedQuotes.filter(q => ['approved', 'accepted'].includes(q.status?.toLowerCase())).length,
            rejected: scopedQuotes.filter(q => q.status?.toLowerCase() === 'rejected').length,
            win: scopedQuotes.filter(q => q.status?.toLowerCase() === 'win').length
          };
          
          setQuoteStats(stats);
        }
      } catch (err) {
        console.error("Error fetching live stats:", err);
      }
    };
    fetchDashboardStats();
  }, [user.id, userRole]);



  return (
    <div
      className="p-6 bg-gray-900 min-h-screen text-white 
                    lg:ml-10 mt-14 lg:mt-0"
    >
      {/* ---------------- Header Row ---------------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-400">
            Welcome back, <span className="text-blue-400 font-semibold">{user.name || 'Admin'}</span>! Here's what's happening today.
          </p>
        </div>
        
      </div>

      {/* ---------------- Quotation Stats Grid ---------------- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {DashboardData.stats.slice(0, 4).map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(item.route)}
            className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 flex justify-between items-center cursor-pointer hover:border-blue-500 transition-all duration-200"
          >
            <div>
              <p className="text-gray-400">{item.title}</p>
              <h2 className="text-4xl font-bold mt-2">
                {item.title === "Total Quotations" ? quoteStats.total :
                 item.title === "Pending" ? quoteStats.pending :
                 item.title === "Approved" ? quoteStats.approved :
                 item.title === "Rejected" ? quoteStats.rejected : item.value}
              </h2>
              <p
                className={`text-sm mt-1 ${
                  item.change.includes("-") ? "text-red-400" : "text-green-400"
                }`}
              >
                {item.change}
              </p>
              <p className="text-gray-500 text-xs mt-2">Click to view →</p>
            </div>

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl ${item.iconBg}`}
            >
              📄
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- User Stats Grid ---------------- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
        {DashboardData.userStats.map((item, idx) => {
          const displayValue = idx === 0 ? liveStats.managers : (idx === 1 ? liveStats.salespersons : item.value);
          return (
            <div
              key={idx}
              onClick={() => navigate(item.route)}
              className={`${item.bgColor} rounded-2xl p-6 shadow-lg border ${item.borderColor} flex justify-between items-center cursor-pointer hover:border-blue-500 transition-all duration-200`}
            >
              <div>
                <p className="text-gray-300">{item.title}</p>
                <h2 className="text-4xl font-bold mt-2 text-white">
                  {item.title === "Win Quotations" ? quoteStats.win : displayValue}
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    item.change.includes("-") ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {item.change}
                </p>
                <p className="text-gray-500 text-xs mt-2">Click to view →</p>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-3xl ${
                  idx === 0 ? "bg-purple-600" : "bg-indigo-600"
                }`}
              >
                {item.icon}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- Charts Section ---------------- */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* -------- Trend Line Chart -------- */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Quotation Trend</h2>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={DashboardData.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
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
                dataKey="approved"
                stroke="#16a34a"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="rejected"
                stroke="#dc2626"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* -------- Status Pie Chart -------- */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Status Distribution</h2>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={DashboardData.statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {DashboardData.statusDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Legend />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------------- Additional Stats Cards (Row 3) ---------------- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {DashboardData.stats.slice(4, 6).map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(item.route)}
            className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 flex justify-between items-center cursor-pointer hover:border-blue-500 transition-all duration-200"
          >
            <div>
              <p className="text-gray-400">{item.title}</p>
              <h2 className="text-4xl font-bold mt-2">{item.value}</h2>
              <p
                className={`text-sm mt-1 ${
                  item.change.includes("-") ? "text-red-400" : "text-green-400"
                }`}
              >
                {item.change}
              </p>
              <p className="text-gray-500 text-xs mt-2">Click to view →</p>
            </div>

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl ${item.iconBg}`}
            >
              {item.title === "Managers" ? "👨‍💼" : "👥"}
            </div>
          </div>
        ))}

        {/* Additional placeholder cards to maintain grid layout */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 flex justify-between items-center">
          <div>
            <p className="text-gray-400">Total Revenue</p>
            <h2 className="text-4xl font-bold mt-2">$245.8K</h2>
            <p className="text-green-400 text-sm mt-1">+18% this month</p>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl bg-gradient-to-br from-green-600 to-emerald-600">
            💰
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 flex justify-between items-center">
          <div>
            <p className="text-gray-400">Win Rate</p>
            <h2 className="text-4xl font-bold mt-2">68%</h2>
            <p className="text-green-400 text-sm mt-1">+5% this month</p>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl bg-gradient-to-br from-amber-600 to-orange-600">
            📈
          </div>
        </div>
      </div>

    </div>
  );
}