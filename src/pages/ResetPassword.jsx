import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiLock, FiCheckCircle, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { verifyResetToken, resetPassword } from '../api/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // DEBUG: Immediate logs
    console.log('ResetPassword Component Mounted!');
    console.log('Full Query String:', window.location.search);
    
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    console.log('Detected Token:', token);
    console.log('Detected Email:', email);

    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [status, setStatus] = useState({ type: null, message: '' });

    useEffect(() => {
        const checkToken = async () => {
            if (!token || !email) {
                setStatus({
                    type: 'error',
                    message: 'Invalid or missing reset token. Please request a new password reset link.'
                });
                setVerifying(false);
                return;
            }

            console.log('Verifying token:', { email, token });
            const payload = { email, token };
            console.log('Sending Token Verification Payload:', payload);
            try {
                const response = await verifyResetToken(payload);
                console.log('Verify Token Response:', response.data);
                if (!response.data.success) {
                    setStatus({
                        type: 'error',
                        message: response.data.message || 'This reset link has expired or is invalid.'
                    });
                }
            } catch (error) {
                console.error('Token verification error details:', error.response?.data || error.message);
                setStatus({
                    type: 'error',
                    message: error.response?.data?.message || 'Failed to verify reset link. Please check your internet connection or try requesting a new link.'
                });
            } finally {
                setVerifying(false);
            }
        };

        checkToken();
    }, [token, email]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (passwords.password !== passwords.confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        if (passwords.password.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters long.' });
            return;
        }

        setLoading(true);
        setStatus({ type: null, message: '' });

        const payload = {
            email,
            token,
            password: passwords.password,
            password_confirmation: passwords.confirmPassword
        };
        console.log('Sending Reset Password Payload:', payload);
        try {
            const response = await resetPassword(payload);

            if (response.data.success) {
                setStatus({
                    type: 'success',
                    message: 'Your password has been successfully reset!'
                });
            } else {
                setStatus({
                    type: 'error',
                    message: response.data.message || 'Failed to reset password. The link might be expired.'
                });
            }
        } catch (error) {
            console.error('Reset password error details:', error.response?.data || error.message);
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Something went wrong. Please request a new link.'
            });
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400 font-medium">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem] p-8 sm:p-12 border border-white/50 relative z-10">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-purple-600/10 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-6">
                        <FiLock size={36} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-500">Create a secure new password for your account.</p>
                </div>

                {status.type === 'success' ? (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-8 text-center animate-fadeIn">
                        <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                            <FiCheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Password Reset!</h3>
                        <p className="text-gray-600 mb-8">{status.message}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg"
                        >
                            Sign in with your new password
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {status.type === 'error' && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-start gap-2 mb-4 animate-shake">
                                <FiAlertCircle className="shrink-0 mt-0.5" />
                                <span>{status.message}</span>
                            </div>
                        )}

                        {!status.type || status.type === 'error' ? (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="••••••••"
                                            value={passwords.password}
                                            onChange={handleInputChange}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all duration-200 text-gray-900"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                        >
                                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirm New Password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        value={passwords.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all duration-200 text-gray-900"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !passwords.password || !passwords.confirmPassword}
                                    className="w-full p-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-2xl shadow-xl shadow-blue-500/20 transform transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center mt-4"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : 'Complete Reset'}
                                </button>
                            </>
                        ) : null}
                    </form>
                )}

                {/* Return to Login Link if token is invalid */}
                {status.type === 'error' && !loading && (
                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 w-full text-center text-sm font-bold text-gray-500 hover:text-gray-900 uppercase tracking-widest transition-colors"
                    >
                        Return to Login
                    </button>
                )}
            </div>

            <style>{`
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                .animate-shake {
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
            `}</style>
        </div>
    );
};

export default ResetPassword;
