import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const AddTeamMemberModal = ({ showModal, onClose, onAddMember }) => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    
    // Create new team member object
    const member = {
      id: Date.now(), // Using timestamp for unique ID
      name: `${newMember.firstName} ${newMember.lastName}`,
      email: newMember.email,
      role: newMember.role,
      status: newMember.status,
      joinDate: new Date().toISOString().split('T')[0],
      performance: 'Good',
      currentQuotations: 0,
      contact: newMember.contact,
      area: newMember.area,
      quotationsCreated: 0,
      quotationsApproved: 0,
      quotationsWon: 0,
      totalRevenue: '$0',
      activeProjects: 0,
      joinYear: new Date().getFullYear()
    };
    
    // Call the parent function to add member
    onAddMember(member);
    
    // Reset form
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

  const handleClose = () => {
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
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Add Team Member</h2>
          <button
            onClick={handleClose}
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
              onClick={handleClose}
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
  );
};

export default AddTeamMemberModal;