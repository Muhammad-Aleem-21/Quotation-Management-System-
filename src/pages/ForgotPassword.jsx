import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { forgotPassword } from '../api/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: null, message: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanEmail = email.trim().toLowerCase();
        setLoading(true);
        setStatus({ type: null, message: '' });

        console.log('Sending Payload:', { email: cleanEmail });
        try {
            const response = await forgotPassword(cleanEmail);
            if (response.data.success) {
                setStatus({
                    type: 'success',
                    message: 'We have sent a password reset link to your email address.'
                });
            } else {
                setStatus({
                    type: 'error',
                    message: response.data.message || 'Something went wrong. Please try again.'
                });
            }
        } catch (error) {
            console.error('Forgot password error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Server error (500). This usually means the backend is having trouble sending emails. Please try again in a few minutes.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem] p-8 sm:p-12 border border-white/50 relative z-10">
                {/* Back Link */}
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
                >
                    <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-xs uppercase tracking-widest">Back to Login</span>
                </button>

                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-blue-600/10 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                        <FiMail size={36} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        No worries! Enter your email below and we'll send you a link to reset your password.
                    </p>
                </div>

                {status.type === 'success' ? (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-8 text-center animate-fadeIn">
                        <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                            <FiCheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
                        <p className="text-gray-600 mb-6">{status.message}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg"
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 text-gray-900"
                                required
                            />
                        </div>

                        {status.type === 'error' && (
                            <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm animate-shake">
                                <FiAlertCircle className="shrink-0 mt-0.5" />
                                <span>{status.message}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full p-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-2xl shadow-xl shadow-blue-500/20 transform transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : 'Send Reset Link'}
                        </button>
                    </form>
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

export default ForgotPassword;



