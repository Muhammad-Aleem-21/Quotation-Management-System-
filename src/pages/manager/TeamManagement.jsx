import React, { useState, useRef, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AddTeamMemberModal from './AddTeamMemberModal';
import SalespersonProfileModal from './SalespersonProfileModal';
import { getMyTeam, getTeamStats } from '../../api/api';

const TeamManagement = () => {
  const navigate = useNavigate();
  const teamListRef = useRef(null);
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [stats, setStats] = useState({
    teamSize: 0,
    activeMembers: 0,
    activeQuotations: 0,
    avgPerformance: 'Good'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        getMyTeam('salesperson'),
        getTeamStats()
      ]);

      // Process stats
      let salespersonList = [];
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id?.toString();

      if (statsRes.data && statsRes.data.dashboard_stats) {
        const ds = statsRes.data.dashboard_stats;
        
        // Filter by current manager's ID
        salespersonList = (ds.my_team || []).filter(member => 
          member.manager_id?.toString() === userId || 
          member.parent_id?.toString() === userId
        );

        setTeamMembers(salespersonList);
        
        setStats({
          teamSize: salespersonList.length,
          activeMembers: salespersonList.length,
          activeQuotations: ds.active_quotations || 0,
          avgPerformance: ds.avg_performance || 'Good'
        });
      } else {
        // Fallback to usersRes if stats structure is different
        const users = usersRes.data.users || usersRes.data || [];
        salespersonList = users.filter(user => {
          const role = (user.role || '').toLowerCase();
          const roles = user.roles || [];
          const isSalesperson = role === 'salesperson' || roles.some(r => (r.name || '').toLowerCase() === 'salesperson');
          const isMyRecruit = user.manager_id?.toString() === userId || user.parent_id?.toString() === userId;
          return isSalesperson && isMyRecruit;
        });
        setTeamMembers(salespersonList);
        setStats(prev => ({ ...prev, teamSize: salespersonList.length, activeMembers: salespersonList.length }));
      }
    } catch (err) {
      console.error("Error fetching team details:", err);
      setError("Failed to load team information");
    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const getStatusColor = (status) => {
    return (status || '').toLowerCase() === "active" ? "bg-green-500/20 text-green-300" : 
           (status || '').toLowerCase() === "on leave" ? "bg-yellow-500/20 text-yellow-300" : "bg-red-500/20 text-red-300";
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case "Excellent": return "bg-green-500/20 text-green-300";
      case "Good": return "bg-blue-500/20 text-blue-300";
      case "Needs Improvement": return "bg-yellow-500/20 text-yellow-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const handleAddMember = (newMember) => {
    fetchTeamMembers(); // Refetch from server to get accurate state
    setShowModal(false);
    // Success alert is now inside modal or we can keep it here
  };

  const handleViewProfile = (member) => {
    setSelectedMember(member);
    setShowProfileModal(true);
  };

  const scrollToTeamList = () => {
    if (teamListRef.current) {
      teamListRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Team Management</h1>
          <p className="text-gray-400 mt-1">Manage your sales team and their performance</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white flex gap-2 items-center transition-colors duration-200"
        >
          <span className="text-xl">+</span> Add Sales Person
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Team Size Card - Clickable to show count and scroll to list */}
        <div 
          className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 cursor-pointer hover:border-green-500 transition-colors duration-200"
          onClick={() => {
            scrollToTeamList();
          }}
        >
          <p className="text-gray-400 text-sm sm:text-base">Total Salespersons</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{stats.teamSize}</h2>
          <p className="text-green-400 text-xs sm:text-sm mt-1">Team Members</p>
          <p className="text-gray-500 text-xs mt-2">Click to scroll to list →</p>
        </div>

        {/* Active Members Card - Also renamed to Total Salespersons per user request or combined */}
        <div 
          className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors duration-200"
          onClick={() => navigate('/active-members')}
        >
          <p className="text-gray-400 text-sm sm:text-base">Active Salespersons</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {stats.activeMembers}
          </h2>
          <p className="text-blue-400 text-xs sm:text-sm mt-1">Current team</p>
          <p className="text-gray-500 text-xs mt-2">Click to view details →</p>
        </div>

        {/* Active Quotations Card */}
        <div 
          className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 cursor-pointer hover:border-yellow-500 transition-colors duration-200"
          onClick={() => navigate('/active-quotations')}
        >
          <p className="text-gray-400 text-sm sm:text-base">Active Quotations</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {stats.activeQuotations}
          </h2>
          <p className="text-yellow-400 text-xs sm:text-sm mt-1">In progress</p>
          <p className="text-gray-500 text-xs mt-2">Click to view details →</p>
        </div>

        {/* Avg Performance Card */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base">Avg Performance</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{stats.avgPerformance}</h2>
          <p className="text-green-400 text-xs sm:text-sm mt-1">Team average</p>
        </div>
      </div>

      {/* Team Members Table with ref for scrolling */}
      <div ref={teamListRef} className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Team Members List</h2>
          <p className="text-gray-400 text-sm">All team members in your sales team</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Team Member</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Performance</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Active Quotations</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Join Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      <p>Loading team members...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-red-400">
                    {error}
                  </td>
                </tr>
              ) : teamMembers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                    No team members found
                  </td>
                </tr>
              ) : (
                teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-750 transition-colors duration-200">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{member.name}</div>
                      <div className="text-sm text-gray-400">{member.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{member.role}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(member.performance || 'Good')}`}>
                        {member.performance || 'Good'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-white font-bold">{member.currentQuotations || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{member.joinDate || member.created_at?.split('T')[0] || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewProfile(member)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                        >
                          <FiUser className="text-xs" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Use the modal components */}
      <AddTeamMemberModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onAddMember={handleAddMember}
      />

      <SalespersonProfileModal
        showModal={showProfileModal}
        selectedMember={selectedMember}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};

export default TeamManagement;