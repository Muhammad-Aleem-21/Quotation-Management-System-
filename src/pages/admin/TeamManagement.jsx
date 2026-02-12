import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API, { getTeamStats } from "../../api/api";
import { 
  FiUsers, FiSearch, FiFilter, FiTrendingUp, FiCheckCircle, 
  FiMail, FiTarget, FiChevronRight, FiUser, FiActivity 
} from "react-icons/fi";

const TeamManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "managers";
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamData, setTeamData] = useState([]);
  const [stats, setStats] = useState({ managers: 0, salespersons: 0 });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTeamStats();
      
      if (response.data.success) {
        const dashboardStats = response.data.dashboard_stats;
        const allTeam = dashboardStats.my_team || [];
        const adminId = String(user.id);

        // Scope data to the logged-in Admin
        const scopedTeam = allTeam.filter(
          (member) => String(member.created_by_admin) === adminId
        );

        setTeamData(scopedTeam);

        // Re-calculate stats based on scoped team
        const managersCount = scopedTeam.filter(
          (m) => m.manager_id === null || m.role?.toLowerCase() === "manager"
        ).length;
        const salesCount = scopedTeam.filter(
          (m) => m.manager_id !== null || m.role?.toLowerCase() === "salesperson"
        ).length;

        setStats({
          managers: managersCount,
          salespersons: salesCount
        });
      } else {
        setError("Failed to load team data");
      }
    } catch (err) {
      console.error("Error fetching team stats:", err);
      setError(err.response?.data?.message || "An error occurred while loading team data");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = teamData.filter(user => {
    const isCorrectRole = activeTab === "managers" 
      ? (user.manager_id === null || user.role?.toLowerCase() === 'manager')
      : (user.manager_id !== null || user.role?.toLowerCase() === 'salesperson');
    
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return isCorrectRole && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading team management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white lg:ml-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Team Management
          </h1>
          <p className="text-gray-400 mt-1">
            Monitor and manage your team of managers and salespersons
          </p>
        </div>

        <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
          <button
            onClick={() => setActiveTab("managers")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === "managers" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiUser /> Managers ({stats.managers})
          </button>
          <button
            onClick={() => setActiveTab("salespersons")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === "salespersons" 
                ? "bg-indigo-600 text-white shadow-lg" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiUsers /> Salespersons ({stats.salespersons})
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 text-xl font-bold border border-blue-500/20">
              <FiUser />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Structure</p>
              <h3 className="text-2xl font-bold">{stats.managers} Managers</h3>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 text-xl font-bold border border-indigo-500/20">
              <FiUsers />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Force</p>
              <h3 className="text-2xl font-bold">{stats.salespersons} Sales Force</h3>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-600/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 text-xl font-bold border border-green-500/20">
              <FiActivity />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Team</p>
              <h3 className="text-2xl font-bold">{stats.managers + stats.salespersons} Members</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search and List */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 bg-gray-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-xl pl-11 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <button className="p-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors border border-gray-600">
              <FiFilter />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {error ? (
            <div className="p-12 text-center text-red-400">
              <p>⚠️ {error}</p>
              <button 
                onClick={fetchTeamData}
                className="mt-4 text-blue-400 hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-gray-500 text-3xl mx-auto mb-4">
                <FiUsers />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">No Members Found</h3>
              <p className="text-gray-400">We couldn't find any {activeTab} matching your filters.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900/40 border-b border-gray-700">
                  <th className="px-6 py-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Member</th>
                  <th className="px-6 py-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Contact Details</th>
                  <th className="px-6 py-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">
                    {activeTab === "managers" ? "Region" : "Reporting Manager"}
                  </th>
                  <th className="px-6 py-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Joined On</th>
                  <th className="px-12 py-4 text-center text-gray-400 font-semibold text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredData.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-gray-800 shadow-md ${
                          activeTab === 'managers' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                        }`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: #{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <FiMail className="text-gray-500" />
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {activeTab === "managers" ? (
                          <span className="bg-gray-900/50 text-gray-300 text-xs font-bold px-3 py-1 rounded-full border border-gray-700">
                            {user.region || 'Global'}
                          </span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-blue-400">
                              Manager ID: #{user.manager_id}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/user-profile/${user.id}`, { state: { userData: user } })}
                        className="w-full flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-blue-600 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-gray-600 hover:border-blue-500 group-hover:shadow-lg group-hover:shadow-blue-600/10"
                      >
                        View Profile <FiChevronRight />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
