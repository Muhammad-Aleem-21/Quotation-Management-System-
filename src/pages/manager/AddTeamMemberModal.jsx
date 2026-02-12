import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { createSalesperson } from '../../api/api';

const AddTeamMemberModal = ({ showModal, onClose, onAddMember }) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    email: '',
    region: '',
    area: '',
    role: 'salesperson',
    status: 'Active',
    password: '',
    password_confirmation: ''
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
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newMember.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!newMember.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!newMember.contact.trim()) newErrors.contact = 'Contact number is required';
    
    if (!newMember.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMember.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!newMember.region.trim()) newErrors.region = 'Region is required';
    
    if (!newMember.password) {
      newErrors.password = 'Password is required';
    } else if (newMember.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (newMember.password !== newMember.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      setLoading(true);
      const payload = {
        name: `${newMember.firstName} ${newMember.lastName}`,
        email: newMember.email,
        phone: newMember.contact,
        region: newMember.region,
        area: newMember.area || newMember.region,
        role: 'salesperson',
        status: (newMember.status || 'Active').toLowerCase(),
        password: newMember.password,
        password_confirmation: newMember.password_confirmation
      };

      const response = await createSalesperson(payload);
      
      if (response.data.success) {
        alert(response.data.message || "Salesperson created successfully");
        onAddMember(response.data.salesperson);
        handleClose();
      }
    } catch (err) {
      console.error("Error creating salesperson:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to create salesperson";
      setServerError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setNewMember({
      firstName: '',
      lastName: '',
      contact: '',
      email: '',
      region: '',
      area: '',
      role: 'salesperson',
      status: 'Active',
      password: '',
      password_confirmation: ''
    });
    setErrors({});
    setServerError('');
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Add New Salesperson</h2>
            <p className="text-sm text-gray-400 mt-1">Create a new member for your sales team</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-700 transition-all disabled:opacity-50"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            {serverError && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-3">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                {serverError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={newMember.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-gray-900/50 border ${errors.firstName ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={newMember.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-gray-900/50 border ${errors.lastName ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={newMember.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-gray-900/50 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                  Contact Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={newMember.contact}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-gray-900/50 border ${errors.contact ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                  placeholder="+1 234 567 890"
                />
                {errors.contact && <p className="text-red-400 text-xs mt-1">{errors.contact}</p>}
              </div>

              {/* Region */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                  Region <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="region"
                  value={newMember.region}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-gray-900/50 border ${errors.region ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                  placeholder="e.g. North Region"
                />
                {errors.region && <p className="text-red-400 text-xs mt-1">{errors.region}</p>}
              </div>

              {/* Area */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Area (Optional)
                </label>
                <input
                  type="text"
                  name="area"
                  value={newMember.area}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="e.g. Downtown Office"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={newMember.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-gray-900/50 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={newMember.password_confirmation}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-gray-900/50 border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                  placeholder="••••••••"
                />
                {errors.password_confirmation && <p className="text-red-400 text-xs mt-1">{errors.password_confirmation}</p>}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Status
                </label>
                <select
                  name="status"
                  value={newMember.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Role Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Assigned Role
                </label>
                <div className="w-full px-4 py-2.5 bg-gray-700/50 border border-transparent rounded-xl text-gray-400 font-medium">
                  Salesperson
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="flex gap-4 pt-6 mt-6 border-t border-gray-700 shrink-0">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTeamMemberModal;