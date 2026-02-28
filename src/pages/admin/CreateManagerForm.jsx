import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiBriefcase, FiHome, FiX, FiMapPin } from "react-icons/fi";

const CreateManagerForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    region: "",
    role: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    "Senior Manager",
    "Regional Manager",
    "Department Manager",
    "Team Lead",
    "Project Manager",
    "Operations Manager",
  ];

  // Simple list of important Pakistan cities
  const pakistanCities = [
    "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Hyderabad", "Gujranwala",
    "Peshawar", "Quetta", "Bahawalpur", "Sargodha", "Sialkot", "Sukkur", "Larkana", "Sheikhupura",
    "Rahim Yar Khan", "Jhang", "Dera Ghazi Khan", "Gujrat", "Sahiwal", "Wah Cantonment", "Mardan",
    "Kasur", "Okara", "Mingora", "Nawabshah", "Mirpur Khas", "Chiniot", "Kamoke", "Hafizabad",
    "Kohat", "Jacobabad", "Shikarpur", "Muzaffargarh", "Khanewal", "Dera Ismail Khan", "Gojra", 
    "Mandi Bahauddin", "Tando Allahyar", "Daska", "Pakpattan", "Bahawalnagar", "Khuzdar", "Thatta",
    "Vehari", "Kot Abdul Malik", "Nowshera", "Charsadda", "Jamshoro", "Kandhkot", "Burewala", "Jhelum",
    "Sadiqabad", "Khanpur", "Khairpur", "Chishtian", "Abbottabad", "Dadu", "Kharian", "Muzaffarabad",
    "Mirpur", "Chakwal", "Khushab", "Zhob", "Mianwali", "Lodhran", "Turbat", "Gwadar", "Narowal",
    "Jampur", "Umerkot", "Shahdadkot", "Mansehra", "Battagram", "Haripur", "Karak", "Kunri", "Gilgit",
    "Skardu", "Chitral", "Swat", "Naran", "Kaghan", "Hunza", "Kalam", "Malam Jabba", "Murree", "Nathia Gali"
  ].sort();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.contact.trim()) newErrors.contact = "Contact is required";
    if (!formData.region) newErrors.region = "Region is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    setIsSubmitting(true);
    
    try {
      // Pass the complete form data to the parent for API call
      await onSubmit(formData);
      onClose();
    } catch (error) {
      // Errors should be handled in the parent or passed back here
      console.error("Error submitting manager form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-2xl my-8 max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
          <div className="flex items-center gap-4">
            <div className="text-3xl bg-purple-600 p-3 rounded-xl">👨‍💼</div>
            <div>
              <h2 className="text-2xl font-bold text-white">Add New Manager</h2>
              <p className="text-gray-400">Fill in the manager details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl p-2"
            disabled={isSubmitting}
          >
            <FiX />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FiUser className="text-purple-400" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter manager's full name"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50`}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FiMail className="text-blue-400" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="manager@company.com"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50`}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Contact and Region Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FiPhone className="text-green-400" />
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 bg-gray-700 border ${errors.contact ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50`}
                />
                {errors.contact && (
                  <p className="text-red-400 text-sm mt-1">{errors.contact}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FiMapPin className="text-orange-400" />
                  Region/City *
                </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-gray-700 border ${errors.region ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 appearance-none disabled:opacity-50`}
                  >
                    <option value="">Select Region/City</option>
                    {pakistanCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  
                  {errors.region && (
                    <p className="text-red-400 text-sm mt-1">{errors.region}</p>
                  )}
                </div>
              </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 bg-gray-700 border ${errors.role ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none disabled:opacity-50`}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-400 text-sm mt-1">{errors.role}</p>
                )}
              </div>
            </div>

            {/* Password and Confirm Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50`}
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 bg-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FiHome className="text-blue-400" />
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete address with area and landmark"
                rows="3"
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-gray-700 border ${errors.address ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none disabled:opacity-50`}
              />
              {errors.address && (
                <p className="text-red-400 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                placeholder="Any additional information about the manager..."
                rows="2"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 resize-none disabled:opacity-50"
              />
            </div>

            {/* Form Validation Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                <p className="text-red-300 text-sm font-medium">Please fix the following errors:</p>
                <ul className="text-red-400 text-sm mt-1 list-disc list-inside">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end items-center gap-4 sticky bottom-0 bg-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <FiUser />
                Create Manager
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateManagerForm;