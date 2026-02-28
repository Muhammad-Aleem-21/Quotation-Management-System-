import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from "../../../api/api";
import { FiUser, FiMail, FiPhone, FiMapPin, FiArrowLeft, FiBriefcase, FiCalendar, FiFileText, FiActivity } from 'react-icons/fi';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(location.state?.userData || null);
    const [loading, setLoading] = useState(!location.state?.userData);
    const [error, setError] = useState(null);

    const normalizeUserData = (userData) => {
        // Improve role detection
        let roleName = userData.role || (userData.roles?.[0]?.name || userData.roles?.[0]);
        
        if (!roleName) {
            if (userData.manager_id !== null && userData.manager_id !== undefined) {
                roleName = 'Salesperson';
            } else if (userData.created_by_admin) {
                roleName = 'Manager';
            } else {
                roleName = 'User';
            }
        }
        
        userData.role = roleName;

        // Hierarchy/Creator extraction logic based on role
        let reportsTo = 'N/A';
        const rName = roleName.toLowerCase();
        
        if (rName === 'salesperson') {
            const mName = typeof userData.manager === 'object' ? userData.manager?.name : userData.manager;
            const aName = userData.created_by_admin_name || (typeof userData.created_by_admin === 'object' ? userData.created_by_admin?.name : userData.created_by_admin);
            
            if (mName && aName && mName !== aName) {
                reportsTo = `${mName} (Admin: ${aName})`;
            } else {
                reportsTo = mName || aName || 'Super Admin';
            }
        } else if (rName === 'manager') {
            reportsTo = userData.created_by_admin_name || (typeof userData.created_by_admin === 'object' ? userData.created_by_admin?.name : userData.created_by_admin) || 'Super Admin';
        } else if (rName === 'admin') {
            reportsTo = 'Super Admin';
        }
        userData.creatorName = reportsTo;
        
        // Nested profile data extraction
        const profile = userData.profile || {};
        
        // Area and Contact normalization - Robust fallbacks
        userData.displayArea = userData.region || userData.area || userData.city || profile.region || profile.area || profile.city || 'N/A';
        userData.displayContact = userData.phone || userData.contact || userData.phone_number || profile.phone || profile.contact || profile.phone_number || 'N/A';
        userData.displayAddress = userData.address || profile.address || 'No address provided in system.';
        userData.displayBio = userData.bio || profile.bio || '';

        // For backward compatibility with other components
        userData.area = userData.displayArea;
        userData.contact = userData.displayContact;

        return userData;
    };

    useEffect(() => {
        if (!user) {
            fetchUserDetails();
        } else {
             // If we have user from state, we still need to normalize it
             // especially for fields like creatorName which might not be in state
             setUser(prev => normalizeUserData({...prev}));
             setLoading(false);
        }
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Try specific endpoint first
            let response;
            try {
            // response = await API.get(`/users/${id}`);
            response = { data: { user: {} } };
            } catch (specificErr) {
               console.warn("Specific user endpoint failed, trying fallback list...", specificErr);
               const listResponse = { data: { users: [] } };
               const list = listResponse.data.users || listResponse.data || [];
               const found = Array.isArray(list) ? list.find(u => u.id.toString() === id.toString()) : null;
               
               if (found) {
                   response = { data: { user: found } };
               } else {
                   throw new Error("User not found in list");
               }
            }

            if (response.data && (response.data.user || response.data.data)) {
                let userData = response.data.user || response.data.data;
                userData = normalizeUserData(userData);
                
                // Enhance stats for Salespersons (extra step)
                if (userData.role.toLowerCase() === 'salesperson') {
                    try {
                        const appRes = { status: 'rejected' };
                        const rejRes = { status: 'rejected' };

                        if (appRes.status === 'fulfilled' && appRes.value.data) {
                            const list = appRes.value.data.quotations || appRes.value.data.data || [];
                            userData.success_quotations_count = Array.isArray(list) ? list.length : (userData.success_quotations_count || 0);
                        }
                        if (rejRes.status === 'fulfilled' && rejRes.value.data) {
                            const list = rejRes.value.data.quotations || rejRes.value.data.data || [];
                            userData.rejected_quotations_count = Array.isArray(list) ? list.length : (userData.rejected_quotations_count || 0);
                        }
                    } catch (warn) {
                        console.warn("Could not fetch extra salesperson stats:", warn.message);
                    }
                }
                
                setUser(userData);
            } else {
                setError("User not found or API response structure invalid");
            }
        } catch (err) {
            console.error("Error fetching user detail:", err);
            setError("Failed to load user information. The server might be experiencing issues.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 animate-pulse">Fetching detailed profile...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 max-w-md">
                <FiActivity className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                >
                    Return to List
                </button>
            </div>
        </div>
    );

    const getRoleColor = (role) => {
        switch(role?.toLowerCase()) {
            case 'admin': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'manager': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'salesperson': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const roleName = user.role || (user.roles?.[0]?.name || user.roles?.[0] || 'User');

    return (
        <div className="p-4 sm:p-8 bg-gray-900 min-h-screen text-white">
            {/* Navigation Header */}
            <div className="max-w-5xl mx-auto mb-8 flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-all shadow-lg"
                >
                    <FiArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">User Profile</h1>
                    <p className="text-gray-500 text-sm">Detailed system information for #{user.id}</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-800 rounded-3xl border border-gray-700 p-8 shadow-xl text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl font-bold shadow-2xl transform hover:rotate-6 transition-transform">
                            {user.name?.[0].toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{user.name || user.fullName}</h2>
                        <span className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest ${getRoleColor(roleName)}`}>
                            {roleName}
                        </span>

                        <div className="mt-8 space-y-4 text-left border-t border-gray-700 pt-8">
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="p-2 bg-gray-700/50 rounded-lg text-blue-400"><FiMail /></div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Email</p>
                                    <p className="text-sm truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="p-2 bg-gray-700/50 rounded-lg text-green-400"><FiPhone /></div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Contact</p>
                                    <p className="text-sm">{user.displayContact}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="p-2 bg-gray-700/50 rounded-lg text-red-400"><FiMapPin /></div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Area</p>
                                    <p className="text-sm">{user.displayArea}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Detailed Info & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Information Grid */}
                    <div className="bg-gray-800 rounded-3xl border border-gray-700 p-8 shadow-xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <FiFileText className="text-blue-500" />
                            Account Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-700 hover:border-blue-500/30 transition-colors">
                                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Position / Title</p>
                                <p className="font-medium text-blue-300">{roleName}</p>
                            </div>
                            {roleName?.toLowerCase() !== 'manager' && (
                                <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-700 hover:border-blue-500/30 transition-colors">
                                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Reports To</p>
                                    <p className="font-medium text-purple-300">{user.creatorName}</p>
                                </div>
                            )}
                            <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-700 hover:border-blue-500/30 transition-colors">
                                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Member Since</p>
                                <p className="font-medium text-green-300">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2 p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
                                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Physical Address</p>
                                <p className="text-sm text-gray-300 leading-relaxed">{user.displayAddress}</p>
                            </div>
                        </div>

                        {user.displayBio && (
                            <div className="mt-6 p-6 bg-blue-600/5 rounded-2xl border border-blue-600/10 italic text-gray-400 text-sm leading-relaxed">
                                "{user.displayBio}"
                            </div>
                        )}
                    </div>

                    {/* Performance Stats placeholder */}
                    <div className="bg-gray-800 rounded-3xl border border-gray-700 p-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <FiActivity size={100} />
                        </div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <FiActivity className="text-green-500" />
                            System Activity
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-900/50 rounded-2xl text-center">
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Quotations</p>
                                <p className="text-2xl font-black text-white">{user.quotations_count || 0}</p>
                            </div>
                            <div className="p-4 bg-gray-900/50 rounded-2xl text-center">
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Approved</p>
                                <p className="text-2xl font-black text-green-400">{user.success_quotations_count || 0}</p>
                            </div>
                            <div className="p-4 bg-gray-900/50 rounded-2xl text-center">
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Success Rate</p>
                                <p className="text-2xl font-black text-yellow-400">{user.success_rate || '0%'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
