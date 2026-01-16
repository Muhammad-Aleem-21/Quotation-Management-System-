import React, { useState } from 'react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    companyName: "QuotePro Inc.",
    systemEmail: "noreply@quotepro.com",
    quotaLimit: 100,
    autoBackup: true,
    twoFactorAuth: false,
    maintenanceMode: false,
    sessionTimeout: 30
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">System Settings</h1>
        <p className="text-gray-400 mt-1">Configure system-wide settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={settings.companyName}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">System Email</label>
              <input
                type="email"
                name="systemEmail"
                value={settings.systemEmail}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Quotation Limit per User</label>
              <input
                type="number"
                name="quotaLimit"
                value={settings.quotaLimit}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4">Security Settings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Auto Backup</label>
                <p className="text-gray-500 text-xs">Automatically backup system data daily</p>
              </div>
              <button
                onClick={() => handleToggle('autoBackup')}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.autoBackup ? 'bg-red-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ${
                  settings.autoBackup ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Two-Factor Authentication</label>
                <p className="text-gray-500 text-xs">Require 2FA for all users</p>
              </div>
              <button
                onClick={() => handleToggle('twoFactorAuth')}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.twoFactorAuth ? 'bg-red-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ${
                  settings.twoFactorAuth ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Maintenance Mode</label>
                <p className="text-gray-500 text-xs">Put system in maintenance mode</p>
              </div>
              <button
                onClick={() => handleToggle('maintenanceMode')}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ${
                  settings.maintenanceMode ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="lg:col-span-2 bg-red-900/20 rounded-xl border border-red-700 p-6">
          <h2 className="text-xl font-bold mb-4 text-red-400">Danger Zone</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <label className="block text-red-400 text-sm mb-1">Reset All Data</label>
                <p className="text-red-500 text-xs">Permanently delete all system data</p>
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                Reset System
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <label className="block text-red-400 text-sm mb-1">Export All Data</label>
                <p className="text-red-500 text-xs">Download complete system backup</p>
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold text-white transition-colors duration-200">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;