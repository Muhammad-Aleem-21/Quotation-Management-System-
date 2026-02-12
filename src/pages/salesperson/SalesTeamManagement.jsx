import React, { useState, useRef, useEffect } from 'react';
import { FiUser, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AddTeamMemberModal from '../manager/AddTeamMemberModal';
import SalespersonProfileModal from '../manager/SalespersonProfileModal';
import { getMyTeam, getTeamStats } from '../../api/api';

const SalesTeamManagement = () => {
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

      // Process users list
      const users = usersRes.data.users || usersRes.data || [];
      const salespersonList = users.filter(user => {
        const role = (user.role || '').toLowerCase();
        const roles = user.roles || [];
        return role === 'salesperson' || roles.some(r => (r.name || '').toLowerCase() === 'salesperson');
      });
      setTeamMembers(salespersonList);

      // Process stats
      if (statsRes.data) {
        const s = statsRes.data.data || statsRes.data;
        setStats({
          teamSize: s.total_salespersons || s.teamSize || salespersonList.length,
          activeMembers: s.active_salespersons || s.activeMembers || salespersonList.filter(m => m.status === "Active").length,
          activeQuotations: s.active_quotations || s.activeQuotations || 0,
          avgPerformance: s.avg_performance || s.avgPerformance || 'Good'
        });
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
    fetchTeamMembers();
    setShowModal(false);
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
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FiUsers className="text-blue-500" />
            My Team
          </h1>
          <p className="text-gray-400 mt-1">Manage salespersons you have recruited</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold text-white flex gap-2 items-center transition-all shadow-lg shadow-blue-500/25"
        >
          <span className="text-xl">+</span> Add Sales Person
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-sm">
          <p className="text-gray-400 text-sm">Recruits</p>
          <h2 className="text-3xl font-bold text-white mt-1">{stats.teamSize}</h2>
          <p className="text-blue-400 text-xs mt-1 font-medium">Total Members</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-sm">
          <p className="text-gray-400 text-sm">Active</p>
          <h2 className="text-3xl font-bold text-green-400 mt-1">{stats.activeMembers}</h2>
          <p className="text-gray-500 text-xs mt-1">Currently working</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-sm">
          <p className="text-gray-400 text-sm">Team Quotations</p>
          <h2 className="text-3xl font-bold text-yellow-400 mt-1">{stats.activeQuotations}</h2>
          <p className="text-gray-500 text-xs mt-1">In progress</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-sm">
          <p className="text-gray-400 text-sm">Performance</p>
          <h2 className="text-2xl font-bold text-white mt-1">{stats.avgPerformance}</h2>
          <p className="text-blue-400 text-xs mt-1 font-medium">Team Average</p>
        </div>
      </div>

      {/* Team Members List */}
      <div ref={teamListRef} className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white">Team Members</h2>
            <p className="text-gray-400 text-sm">Manage and track your recruits</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-400 text-sm uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-400 text-sm uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-400 text-sm uppercase tracking-wider">Performance</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-400 text-sm uppercase tracking-wider">Active Qts</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-400 text-sm uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-400 text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                      <p className="text-gray-400">Loading your team...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-red-400">
                    <p className="flex items-center justify-center gap-2">
                      <span>⚠️</span> {error}
                    </p>
                  </td>
                </tr>
              ) : teamMembers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 italic">
                    You haven't added any team members yet.
                  </td>
                </tr>
              ) : (
                teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-750 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(member.status)} uppercase tracking-tighter`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPerformanceColor(member.performance || 'Good')} uppercase tracking-tighter`}>
                        {member.performance || 'Good'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-white font-bold">{member.currentQuotations || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm font-medium">
                      {member.joinDate || member.created_at?.split('T')[0] || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleViewProfile(member)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ml-auto"
                      >
                        <FiUser className="text-blue-400" />
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
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

export default SalesTeamManagement;
