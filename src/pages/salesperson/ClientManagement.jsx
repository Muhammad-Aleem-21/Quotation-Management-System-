import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiSearch, FiPlus, FiPhone, FiMail, FiMapPin, FiCalendar } from 'react-icons/fi';
import { getClients } from '../../api/api';

const ClientManagement = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getClients();
      
      // Handle the data structure based on typical API responses in this project
      const clientData = res.data.data || res.data.clients || res.data || [];
      setClients(Array.isArray(clientData) ? clientData : []);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    
    const query = searchQuery.toLowerCase();
    return clients.filter(client => {
      const name = (client.name || '').toLowerCase();
      const email = (client.email || '').toLowerCase();
      const phone = (client.phone || '').toLowerCase();
      const company = (client.company_name || client.company || '').toLowerCase();
      
      return name.includes(query) || email.includes(query) || phone.includes(query) || company.includes(query);
    });
  }, [clients, searchQuery]);

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FiUsers className="text-blue-500" />
            Client Management
          </h1>
          <p className="text-gray-400 mt-1">Manage and track your customer base</p>
        </div>
        
        <button 
          onClick={() => navigate('/create-quotation')} // Assuming create quotation leads to client creation or related flow
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold text-white flex gap-2 items-center transition-all shadow-lg shadow-blue-500/25"
        >
          <FiPlus className="text-xl" /> Create New Quotation
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search clients by name, email, phone or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 shadow-inner"
          />
        </div>
      </div>

      {/* Clients Grid/List */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white">Your Clients</h2>
            <p className="text-gray-400 text-sm">Showing {filteredClients.length} clients</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 font-medium">Loading clients...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-red-400 mb-4 font-medium flex items-center justify-center gap-2">
                <span>⚠️</span> {error}
              </p>
              <button 
                onClick={fetchClients}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm transition-all"
              >
                Try Again
              </button>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">👥</div>
              <p className="text-gray-400 text-lg font-medium">No clients found</p>
              <p className="text-gray-500 text-sm mt-1">
                {searchQuery ? "Try a different search term" : "You haven't added any clients yet"}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-400 text-sm uppercase tracking-wider">Client Info</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-400 text-sm uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-400 text-sm uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-400 text-sm uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-400 text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-750 transition-all duration-200 group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20 text-xl group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                          {(client.name || 'C').charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-lg">{client.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <FiMapPin size={12} /> {client.address || 'No address'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="text-gray-300 flex items-center gap-2 text-sm">
                          <FiMail size={14} className="text-gray-500" /> {client.email}
                        </div>
                        <div className="text-gray-300 flex items-center gap-2 text-sm">
                          <FiPhone size={14} className="text-gray-500" /> {client.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="bg-gray-700/50 px-3 py-1 rounded-lg border border-gray-600 w-fit text-sm font-medium text-gray-300">
                        {client.company_name || client.company || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-gray-400 text-sm flex items-center gap-2">
                        <FiCalendar size={14} />
                        {client.created_at?.split('T')[0] || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        className="bg-gray-700 hover:bg-blue-600 text-white p-2.5 rounded-xl transition-all border border-gray-600 hover:border-blue-500"
                        title="View Quotations"
                        onClick={() => navigate('/my-quotation', { state: { searchQuery: client.email } })}
                      >
                        <FiUsers className="text-lg" />
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

export default ClientManagement;
