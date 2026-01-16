

import React, { useState, useRef } from 'react';
import { FiX, FiUser, FiFileText, FiCheck, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

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
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    email: '',
    area: '',
    role: 'Sales Executive',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newMember.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!newMember.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!newMember.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^[0-9+\-\s]+$/.test(newMember.contact)) {
      newErrors.contact = 'Invalid contact number';
    }
    
    if (!newMember.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMember.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!newMember.area.trim()) {
      newErrors.area = 'Area is required';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Create new team member
    const member = {
      id: teamMembers.length + 1,
      name: `${newMember.firstName} ${newMember.lastName}`,
      email: newMember.email,
      role: newMember.role,
      status: newMember.status,
      joinDate: new Date().toISOString().split('T')[0],
      performance: 'Good', // Default performance
      currentQuotations: 0, // Default value
      contact: newMember.contact,
      area: newMember.area,
      quotationsCreated: 0,
      quotationsApproved: 0,
      quotationsWon: 0,
      totalRevenue: '$0',
      activeProjects: 0,
      joinYear: new Date().getFullYear()
    };
    
    setTeamMembers(prev => [...prev, member]);
    
    // Reset form and close modal
    setNewMember({
      firstName: '',
      lastName: '',
      contact: '',
      email: '',
      area: '',
      role: 'Sales Executive',
      status: 'Active'
    });
    setErrors({});
    setShowModal(false);
    
    alert('Team member added successfully!');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewMember({
      firstName: '',
      lastName: '',
      contact: '',
      email: '',
      area: '',
      role: 'Sales Executive',
      status: 'Active'
    });
    setErrors({});
  };

  const handleViewProfile = (member) => {
    setSelectedMember(member);
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setSelectedMember(null);
  };

  // Function to scroll to team list
  const scrollToTeamList = () => {
    if (teamListRef.current) {
      teamListRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Calculate performance metrics
  const calculatePerformance = (member) => {
    const approvalRate = member.quotationsCreated > 0 
      ? ((member.quotationsApproved / member.quotationsCreated) * 100).toFixed(1)
      : 0;
    
    const winRate = member.quotationsApproved > 0
      ? ((member.quotationsWon / member.quotationsApproved) * 100).toFixed(1)
      : 0;
    
    return { approvalRate, winRate };
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
          <span className="text-xl">+</span> Add Team Member
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
          onClick={() => navigate('/manager/active-members')}
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
          onClick={() => navigate('/manager/active-quotations')}
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

      {/* Add Team Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Add Team Member</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={newMember.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-700 border ${errors.firstName ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={newMember.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-700 border ${errors.lastName ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>

                {/* Contact */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Contact Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={newMember.contact}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-700 border ${errors.contact ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    placeholder="Enter contact number"
                  />
                  {errors.contact && (
                    <p className="text-red-400 text-xs mt-1">{errors.contact}</p>
                  )}
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newMember.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Area */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Area <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={newMember.area}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-700 border ${errors.area ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    placeholder="Enter area/location"
                  />
                  {errors.area && (
                    <p className="text-red-400 text-xs mt-1">{errors.area}</p>
                  )}
                </div>

                {/* Role (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={newMember.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Senior Sales Executive">Senior Sales Executive</option>
                    <option value="Junior Sales Executive">Junior Sales Executive</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Sales Coordinator">Sales Coordinator</option>
                  </select>
                </div>

                {/* Status (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={newMember.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Salesperson Profile Modal */}
      {showProfileModal && selectedMember && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedMember.name}'s Profile</h2>
                <p className="text-gray-400 text-sm">Salesperson performance and details</p>
              </div>
              <button
                onClick={handleCloseProfileModal}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {selectedMember.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedMember.name}</h3>
                      <p className="text-gray-400">{selectedMember.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMember.status)}`}>
                          {selectedMember.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPerformanceColor(selectedMember.performance)}`}>
                          {selectedMember.performance}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white font-medium">{selectedMember.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Contact</p>
                      <p className="text-white font-medium">{selectedMember.contact}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Area</p>
                      <p className="text-white font-medium">{selectedMember.area}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Join Date</p>
                      <p className="text-white font-medium">{selectedMember.joinDate}</p>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="flex-1">
                  <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                    <h4 className="font-semibold text-white mb-3">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">Experience</p>
                        <p className="text-white font-bold">{new Date().getFullYear() - selectedMember.joinYear} years</p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">Active Projects</p>
                        <p className="text-white font-bold">{selectedMember.activeProjects}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quotation Performance */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FiFileText className="text-blue-400" />
                  Quotation Performance
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <FiFileText className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Created</p>
                          <p className="text-2xl font-bold text-white">{selectedMember.quotationsCreated}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs">Total quotations submitted</p>
                  </div>

                  <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <FiCheck className="text-green-400" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Approved</p>
                          <p className="text-2xl font-bold text-white">{selectedMember.quotationsApproved}</p>
                        </div>
                      </div>
                      {selectedMember.quotationsCreated > 0 && (
                        <span className="text-green-400 text-sm font-medium">
                          {((selectedMember.quotationsApproved / selectedMember.quotationsCreated) * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs">Manager approved quotations</p>
                  </div>

                  <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <FiDollarSign className="text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Won</p>
                          <p className="text-2xl font-bold text-white">{selectedMember.quotationsWon}</p>
                        </div>
                      </div>
                      {selectedMember.quotationsApproved > 0 && (
                        <span className="text-yellow-400 text-sm font-medium">
                          {((selectedMember.quotationsWon / selectedMember.quotationsApproved) * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs">Converted to projects</p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                    <h4 className="font-semibold text-white mb-3">Performance Metrics</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">Approval Rate</span>
                          <span className="text-blue-400 text-sm font-medium">
                            {selectedMember.quotationsCreated > 0 
                              ? ((selectedMember.quotationsApproved / selectedMember.quotationsCreated) * 100).toFixed(1)
                              : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ 
                              width: `${selectedMember.quotationsCreated > 0 
                                ? (selectedMember.quotationsApproved / selectedMember.quotationsCreated) * 100 
                                : 0}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">Win Rate</span>
                          <span className="text-green-400 text-sm font-medium">
                            {selectedMember.quotationsApproved > 0
                              ? ((selectedMember.quotationsWon / selectedMember.quotationsApproved) * 100).toFixed(1)
                              : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ 
                              width: `${selectedMember.quotationsApproved > 0
                                ? (selectedMember.quotationsWon / selectedMember.quotationsApproved) * 100 
                                : 0}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                    <h4 className="font-semibold text-white mb-3">Revenue Summary</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="text-yellow-400" />
                          <span className="text-gray-400">Total Revenue</span>
                        </div>
                        <span className="text-2xl font-bold text-yellow-400">{selectedMember.totalRevenue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-blue-400" />
                          <span className="text-gray-400">Avg. Revenue/Quote</span>
                        </div>
                        <span className="text-white font-medium">
                          {selectedMember.quotationsWon > 0 
                            ? `$${(parseFloat(selectedMember.totalRevenue.replace('$', '').replace(',', '')) / selectedMember.quotationsWon).toFixed(2)}`
                            : '$0'}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-gray-700">
                        <p className="text-gray-400 text-sm">Current Active Quotations</p>
                        <p className="text-white font-bold text-xl">{selectedMember.currentQuotations}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                <h4 className="font-semibold text-white mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  {selectedMember.currentQuotations > 0 && (
                    <div className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300">Working on {selectedMember.currentQuotations} active quotations</span>
                      </div>
                      <span className="text-gray-400 text-sm">Now</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">Last quotation approved {selectedMember.quotationsApproved > 0 ? 'recently' : 'never'}</span>
                    </div>
                    <span className="text-gray-400 text-sm">-</span>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-300">Total projects won: {selectedMember.quotationsWon}</span>
                    </div>
                    <span className="text-gray-400 text-sm">-</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700">
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseProfileModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
                  View Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;