// import React from "react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell
// } from "recharts";

// const SuperAdminDashboard = () => {
//   // Sample data
//   const systemStats = {
//     totalUsers: 156,
//     activeUsers: 142,
//     admins: 8,
//     managers: 12,
//     salespersons: 45,
//     totalQuotations: 847,
//     acceptedQuotations: 512,
//     rejectedQuotations: 185,
//     pendingQuotations: 150,
//     winQuotations: 420, // Added win quotations (accepted with payment done)
//     revenue: "$124.5K",
//     systemHealth: "98%",
//     storageUsed: "2.3GB"
//   };

//   const userGrowth = [
//     { month: "Jan", users: 120, quotations: 180 },
//     { month: "Feb", users: 135, quotations: 210 },
//     { month: "Mar", users: 142, quotations: 195 },
//     { month: "Apr", users: 148, quotations: 230 },
//     { month: "May", users: 156, quotations: 245 },
//   ];

//   const roleDistribution = [
//     { name: "Salespersons", value: 45 },
//     { name: "Managers", value: 12 },
//     { name: "Admins", value: 8 },
//     { name: "Super Admins", value: 2 }
//   ];

//   const quotationStatusData = [
//     { name: "Accepted", value: systemStats.acceptedQuotations, color: "#0911eaff" },
//     { name: "Pending", value: systemStats.pendingQuotations, color: "#F59E0B" },
//     { name: "Rejected", value: systemStats.rejectedQuotations, color: "#EF4444" },
//     { name: "Win", value: systemStats.winQuotations, color: "#10B981" } // Added win color
//   ];

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

//   const recentActivities = [
//     { action: "New user registered", user: "john.doe", time: "2 mins ago", type: "user" },
//     { action: "System backup completed", user: "System", time: "1 hour ago", type: "system" },
//     { action: "Quotation approved", user: "sarah.wilson", time: "2 hours ago", type: "quotation" },
//     { action: "Payment completed for quotation #Q-245", user: "alex.turner", time: "3 hours ago", type: "payment" } // Added payment activity
//   ];

//   return (
//     <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl sm:text-3xl font-bold">Super Admin Dashboard</h1>
//         <p className="text-gray-400 mt-1">Complete system overview and management</p>
//       </div>

//       {/* System Stats - User Cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
//         {/* Active Users */}
//         <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 sm:p-6 rounded-xl border border-green-500/30">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-400 text-sm sm:text-base">Active Users</p>
//               <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.activeUsers}</h2>
//               <p className="text-green-400 text-xs sm:text-sm mt-1">
//                 {((systemStats.activeUsers / systemStats.totalUsers) * 100).toFixed(1)}% of total
//               </p>
//             </div>
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
//               👥
//             </div>
//           </div>
//         </div>
        
//         {/* Admins */}
//         <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 sm:p-6 rounded-xl border border-purple-500/30">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-400 text-sm sm:text-base">Admins</p>
//               <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.admins}</h2>
//               <p className="text-purple-400 text-xs sm:text-sm mt-1">
//                 {((systemStats.admins / systemStats.totalUsers) * 100).toFixed(1)}% of users
//               </p>
//             </div>
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
//               ⚙️
//             </div>
//           </div>
//         </div>
        
//         {/* Managers */}
//         <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 sm:p-6 rounded-xl border border-blue-500/30">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-400 text-sm sm:text-base">Managers</p>
//               <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.managers}</h2>
//               <p className="text-blue-400 text-xs sm:text-sm mt-1">
//                 {((systemStats.managers / systemStats.totalUsers) * 100).toFixed(1)}% of users
//               </p>
//             </div>
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
//               👨‍💼
//             </div>
//           </div>
//         </div>
        
//         {/* Salespersons */}
//         <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 p-4 sm:p-6 rounded-xl border border-red-500/30">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-400 text-sm sm:text-base">Salespersons</p>
//               <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.salespersons}</h2>
//               <p className="text-red-400 text-xs sm:text-sm mt-1">
//                 {((systemStats.salespersons / systemStats.totalUsers) * 100).toFixed(1)}% of users
//               </p>
//             </div>
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
//               📊
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quotation Status Cards - Updated to 4 columns on large screens */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
//         {/* Accepted Quotations */}
//         <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 sm:p-6 rounded-xl border border-green-500/30">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-400 text-sm sm:text-base">Accepted Quotations</p>
//               <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.acceptedQuotations}</h2>
//               <p className="text-green-400 text-xs sm:text-sm mt-1">
//                 {((systemStats.acceptedQuotations / systemStats.totalQuotations) * 100).toFixed(1)}% of total
//               </p>
//             </div>
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
//               ✅
//             </div>
//           </div>
//         </div>
        
//         {/* Win Quotations (New Card) */}
//         <div className="bg-gradient-to-br from-teal-500/20 to-emerald-500/20 p-4 sm:p-6 rounded-xl border border-teal-500/30">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-400 text-sm sm:text-base">Win Quotations</p>
//               <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.winQuotations}</h2>
//               <div className="flex flex-col mt-1">
//                 <p className="text-teal-400 text-xs sm:text-sm">
//                   {((systemStats.winQuotations / systemStats.totalQuotations) * 100).toFixed(1)}% of total
//                 </p>
//                 <p className="text-emerald-300 text-xs">
//                   {((systemStats.winQuotations / systemStats.acceptedQuotations) * 100).toFixed(1)}% of accepted
//                 </p>
//               </div>
//             </div>
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
//               🏆
//             </div>
//           </div>
//         </div>
        
//         {/* Pending Quotations */}
//         <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 p-4 sm:p-6 rounded-xl border border-yellow-500/30">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-400 text-sm sm:text-base">Pending Quotations</p>
//               <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.pendingQuotations}</h2>
//               <p className="text-yellow-400 text-xs sm:text-sm mt-1">
//                 {((systemStats.pendingQuotations / systemStats.totalQuotations) * 100).toFixed(1)}% of total
//               </p>
//             </div>
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
//               ⏳
//             </div>
//           </div>
//         </div>
        
//         {/* Rejected Quotations */}
//         <div className="bg-gradient-to-br from-red-500/20 to-rose-500/20 p-4 sm:p-6 rounded-xl border border-red-500/30">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-400 text-sm sm:text-base">Rejected Quotations</p>
//               <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.rejectedQuotations}</h2>
//               <p className="text-red-400 text-xs sm:text-sm mt-1">
//                 {((systemStats.rejectedQuotations / systemStats.totalQuotations) * 100).toFixed(1)}% of total
//               </p>
//             </div>
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl">
//               ❌
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         {/* User Growth Chart */}
//         <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">User & Quotation Growth</h2>
//           <div className="h-64 sm:h-72">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={userGrowth}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
//                 <YAxis stroke="#9CA3AF" fontSize={12} />
//                 <Tooltip 
//                   contentStyle={{ 
//                     backgroundColor: '#1F2937', 
//                     border: '1px solid #374151',
//                     borderRadius: '8px',
//                     color: '#F9FAFB'
//                   }}
//                 />
//                 <Legend />
//                 <Bar dataKey="users" fill="#EF4444" name="Users" />
//                 <Bar dataKey="quotations" fill="#3B82F6" name="Quotations" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Role Distribution */}
//         <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">User Role Distribution</h2>
//           <div className="h-64 sm:h-72">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={roleDistribution}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={40}
//                   outerRadius={80}
//                   paddingAngle={2}
//                   dataKey="value"
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                   labelLine={false}
//                 >
//                   {roleDistribution.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip 
//                   contentStyle={{ 
//                     backgroundColor: '#1F2937', 
//                     border: '1px solid #374151',
//                     borderRadius: '8px',
//                     color: '#F9FAFB'
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Recent Activities & Quick Stats */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Activities */}
//         <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Activities</h2>
//           <div className="space-y-3">
//             {recentActivities.map((activity, index) => (
//               <div key={index} className="flex items-center justify-between p-3 bg-gray-750 rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <div className={`w-2 h-2 rounded-full ${
//                     activity.type === 'user' ? 'bg-green-400' :
//                     activity.type === 'system' ? 'bg-blue-400' :
//                     activity.type === 'quotation' ? 'bg-purple-400' : 
//                     activity.type === 'payment' ? 'bg-teal-400' : 'bg-yellow-400'
//                   }`}></div>
//                   <div>
//                     <span className="text-sm sm:text-base">{activity.action}</span>
//                     <span className="text-gray-400 text-xs block">by {activity.user}</span>
//                   </div>
//                 </div>
//                 <span className="text-gray-400 text-xs sm:text-sm">{activity.time}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <button className="p-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors duration-200">
//               User Management
//             </button>
//             <button className="p-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors duration-200">
//               System Settings
//             </button>
//             <button className="p-4 bg-green-600 hover:bg-green-700 rounded-xl text-white font-medium transition-colors duration-200">
//               Backup System
//             </button>
//             <button className="p-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors duration-200">
//               View Reports
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminDashboard;


import React from "react";
import { useNavigate } from "react-router-dom";
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

  // Sample data
  const systemStats = {
    totalUsers: 156,
    activeUsers: 142,
    admins: 8,
    managers: 12,
    salespersons: 45,
    totalQuotations: 847,
    acceptedQuotations: 512,
    rejectedQuotations: 185,
    pendingQuotations: 150,
    winQuotations: 420,
    revenue: "$124.5K",
    systemHealth: "98%",
    storageUsed: "2.3GB"
  };

  const userGrowth = [
    { month: "Jan", users: 120, quotations: 180 },
    { month: "Feb", users: 135, quotations: 210 },
    { month: "Mar", users: 142, quotations: 195 },
    { month: "Apr", users: 148, quotations: 230 },
    { month: "May", users: 156, quotations: 245 },
  ];

  const roleDistribution = [
    { name: "Salespersons", value: 45 },
    { name: "Managers", value: 12 },
    { name: "Admins", value: 8 },
    { name: "Super Admins", value: 2 }
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const recentActivities = [
    { action: "New user registered", user: "john.doe", time: "2 mins ago", type: "user" },
    { action: "System backup completed", user: "System", time: "1 hour ago", type: "system" },
    { action: "Quotation approved", user: "sarah.wilson", time: "2 hours ago", type: "quotation" },
    { action: "Payment completed for quotation #Q-245", user: "alex.turner", time: "3 hours ago", type: "payment" }
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Complete system overview and management</p>
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
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.activeUsers}</h2>
              <p className="text-green-400 text-xs sm:text-sm mt-1">
                {((systemStats.activeUsers / systemStats.totalUsers) * 100).toFixed(1)}% of total
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
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.admins}</h2>
              <p className="text-purple-400 text-xs sm:text-sm mt-1">
                {((systemStats.admins / systemStats.totalUsers) * 100).toFixed(1)}% of users
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
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.managers}</h2>
              <p className="text-blue-400 text-xs sm:text-sm mt-1">
                {((systemStats.managers / systemStats.totalUsers) * 100).toFixed(1)}% of users
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
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.salespersons}</h2>
              <p className="text-red-400 text-xs sm:text-sm mt-1">
                {((systemStats.salespersons / systemStats.totalUsers) * 100).toFixed(1)}% of users
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
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.acceptedQuotations}</h2>
              <p className="text-green-400 text-xs sm:text-sm mt-1">
                {((systemStats.acceptedQuotations / systemStats.totalQuotations) * 100).toFixed(1)}% of total
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
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.winQuotations}</h2>
              <div className="flex flex-col mt-1">
                <p className="text-teal-400 text-xs sm:text-sm">
                  {((systemStats.winQuotations / systemStats.totalQuotations) * 100).toFixed(1)}% of total
                </p>
                <p className="text-emerald-300 text-xs">
                  {((systemStats.winQuotations / systemStats.acceptedQuotations) * 100).toFixed(1)}% of accepted
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
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.pendingQuotations}</h2>
              <p className="text-yellow-400 text-xs sm:text-sm mt-1">
                {((systemStats.pendingQuotations / systemStats.totalQuotations) * 100).toFixed(1)}% of total
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
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{systemStats.rejectedQuotations}</h2>
              <p className="text-red-400 text-xs sm:text-sm mt-1">
                {((systemStats.rejectedQuotations / systemStats.totalQuotations) * 100).toFixed(1)}% of total
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