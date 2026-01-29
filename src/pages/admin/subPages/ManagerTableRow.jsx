import React from "react";
import { FiUser, FiMail, FiPhone, FiUsers } from "react-icons/fi";

const ManagerTableRow = ({ manager, onClick }) => {
  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-500/20 text-green-300 border-green-500/30"
      : "bg-red-500/20 text-red-300 border-red-500/30";
  };

  return (
    <>
      {/* Mobile View - Hidden on desktop */}
      <tr className="sm:hidden border-b border-gray-700">
        <td colSpan="2" className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onClick(manager)}
              >
                <span className="font-bold text-purple-400">{manager.id}</span>
                <h3 className="font-semibold text-white mt-1 hover:text-blue-300 transition-colors">
                  {manager.name}
                </h3>
                <p className="text-gray-400 text-sm">{manager.role}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(manager.status)}`}
              >
                {manager.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs">Email</p>
                <div className="flex items-center gap-2">
                  <FiMail className="text-blue-300 text-xs" />
                  <p className="text-blue-300 text-sm truncate">
                    {manager.email}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Phone</p>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-green-300 text-xs" />
                  <p className="text-green-300 text-sm">{manager.phone}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs">Department</p>
                <p className="text-orange-300 text-sm">{manager.department}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Team Size</p>
                <p className="font-bold text-white text-sm">
                  {manager.teamSize} members
                </p>
              </div>
            </div>

            <button
              onClick={() => onClick(manager)}
              className="w-full py-2 text-center text-blue-400 hover:text-blue-300 text-sm font-medium border border-blue-500/30 hover:border-blue-500 rounded-lg transition-colors"
            >
              View Full Profile →
            </button>
          </div>
        </td>
      </tr>

      {/* Desktop View - Hidden on mobile */}
      <tr
        className="hidden sm:table-row hover:bg-gray-750 transition-colors duration-200 cursor-pointer"
        onClick={() => onClick(manager)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <FiUser className="text-purple-400" />
            <span className="font-bold text-purple-400 text-sm hover:text-purple-300 transition-colors">
              {manager.id}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="font-semibold text-white text-sm hover:text-blue-300 transition-colors">
            {manager.name}
          </div>
          <div className="text-xs text-gray-400">Joined: {manager.joinDate}</div>
        </td>
        <td className="px-4 py-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FiMail className="text-blue-300 text-sm" />
              <span className="text-blue-300 text-sm">{manager.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiPhone className="text-green-300 text-sm" />
              <span className="text-green-300 text-sm">{manager.phone}</span>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-orange-300 text-sm">
          {manager.department}
        </td>
        <td className="px-4 py-3 text-gray-300 text-sm">{manager.role}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <FiUsers className="text-yellow-300" />
            <span className="font-bold text-white text-sm">
              {manager.teamSize}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(manager.status)}`}
          >
            {manager.status}
          </span>
        </td>
      </tr>
    </>
  );
};

export default ManagerTableRow;