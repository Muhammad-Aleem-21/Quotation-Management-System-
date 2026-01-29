import React, { useState, useRef } from 'react';
import { FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AddTeamMemberModal from './AddTeamMemberModal';
import SalespersonProfileModal from './SalespersonProfileModal';

const TeamManagement = () => {
  const navigate = useNavigate();
  const teamListRef = useRef(null);
  
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Farhan',
      email: 'Farhan@company.com',
      role: 'Senior Sales Executive',
      status: 'Active',
      joinDate: '2023-01-15',
      performance: 'Excellent',
      currentQuotations: 5,
      contact: '+92 300 1234567',
      area: 'Karachi',
      quotationsCreated: 25,
      quotationsApproved: 18,
      quotationsWon: 12,
      totalRevenue: '$45,200',
      activeProjects: 3,
      joinYear: 2023
    },
    {
      id: 2,
      name: 'M ali',
      email: 'ali@company.com',
      role: 'Sales Executive',
      status: 'Active',
      joinDate: '2023-03-10',
      performance: 'Good',
      currentQuotations: 4,
      contact: '+92 321 9876543',
      area: 'Lahore',
      quotationsCreated: 18,
      quotationsApproved: 14,
      quotationsWon: 8,
      totalRevenue: '$28,500',
      activeProjects: 2,
      joinYear: 2023
    },
    {
      id: 3,
      name: 'M Aleem',
      email: 'aleem@company.com',
      role: 'Junior Sales Executive',
      status: 'Active',
      joinDate: '2023-06-22',
      performance: 'Needs Improvement',
      currentQuotations: 3,
      contact: '+92 333 4567890',
      area: 'Islamabad',
      quotationsCreated: 10,
      quotationsApproved: 7,
      quotationsWon: 3,
      totalRevenue: '$12,800',
      activeProjects: 1,
      joinYear: 2023
    },
    {
      id: 4,
      name: 'Ahmad',
      email: 'ahmad@company.com',
      role: 'Sales Executive',
      status: 'On Leave',
      joinDate: '2023-02-28',
      performance: 'Good',
      currentQuotations: 0,
      contact: '+92 345 6789012',
      area: 'Rawalpindi',
      quotationsCreated: 15,
      quotationsApproved: 11,
      quotationsWon: 6,
      totalRevenue: '$22,300',
      activeProjects: 0,
      joinYear: 2023
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const getStatusColor = (status) => {
    return status === "Active" ? "bg-green-500/20 text-green-300" : 
           status === "On Leave" ? "bg-yellow-500/20 text-yellow-300" : "bg-red-500/20 text-red-300";
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
    setTeamMembers(prev => [...prev, newMember]);
    setShowModal(false);
    alert('Team member added successfully!');
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
        {/* Team Size Card - Clickable to scroll to list */}
        <div 
          className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 cursor-pointer hover:border-green-500 transition-colors duration-200"
          onClick={scrollToTeamList}
        >
          <p className="text-gray-400 text-sm sm:text-base">Team Size</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">{teamMembers.length}</h2>
          <p className="text-green-400 text-xs sm:text-sm mt-1">Members</p>
          <p className="text-gray-500 text-xs mt-2">Click to view team list →</p>
        </div>

        {/* Active Members Card - Clickable to navigate to ActiveMembers page */}
        <div 
          className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors duration-200"
          onClick={() => navigate('/active-members')}
        >
          <p className="text-gray-400 text-sm sm:text-base">Active Members</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {teamMembers.filter(m => m.status === "Active").length}
          </h2>
          <p className="text-blue-400 text-xs sm:text-sm mt-1">Currently working</p>
          <p className="text-gray-500 text-xs mt-2">Click to view details →</p>
        </div>

        {/* Active Quotations Card - Clickable to navigate to ActiveQuotations page */}
        <div 
          className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 cursor-pointer hover:border-yellow-500 transition-colors duration-200"
          onClick={() => navigate('/active-quotations')}
        >
          <p className="text-gray-400 text-sm sm:text-base">Active Quotations</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
            {teamMembers.reduce((total, member) => total + member.currentQuotations, 0)}
          </h2>
          <p className="text-yellow-400 text-xs sm:text-sm mt-1">In progress</p>
          <p className="text-gray-500 text-xs mt-2">Click to view details →</p>
        </div>

        {/* Avg Performance Card */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <p className="text-gray-400 text-sm sm:text-base">Avg Performance</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">Good</h2>
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
              {teamMembers.map((member) => (
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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(member.performance)}`}>
                      {member.performance}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-white font-bold">{member.currentQuotations}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{member.joinDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewProfile(member)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                      >
                        <FiUser className="text-xs" />
                        View
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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