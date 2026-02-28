import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { FiEye, FiEyeOff, FiX, FiAlertCircle } from "react-icons/fi";

export default function Login() {
  const [role, setRole] = useState("admin");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });
  const navigate = useNavigate();

  const roles = [
    {
      id: "super-admin",
      name: "Super Admin",
      color: "from-red-500 to-pink-600",
      icon: "👑",
    },
    {
      id: "admin",
      name: "Admin",
      color: "from-blue-500 to-purple-600",
      icon: "⚡",
    },
    {
      id: "manager",
      name: "Manager",
      color: "from-green-500 to-teal-600",
      icon: "👔",
    },
    {
      id: "salesperson",
      name: "Salesperson",
      color: "from-orange-500 to-yellow-600",
      icon: "💼",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isEmailValid = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isEmailValid(credentials.username)) {
      setErrorModal({ show: true, message: "Please enter a valid email address." });
      return;
    }

    if (!credentials.password) {
      setErrorModal({ show: true, message: "Please enter your password." });
      return;
    }

    try {
      const response = await API.post("/login", {
        email: credentials.username,
        password: credentials.password,
      });
      if (response.data.success) {
        const { token, user, roles: apiRoles } = response.data;
        
        let normalizedRole = apiRoles[0];
        if (normalizedRole === "super_admin") normalizedRole = "super-admin";

        if (normalizedRole !== role) {
          setErrorModal({ 
            show: true, 
            message: `Access Denied: You selected ${roles.find(r => r.id === role)?.name} but your credentials are for ${roles.find(r => r.id === normalizedRole)?.name}.` 
          });
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("role", normalizedRole);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            role: normalizedRole,
            loginTime: new Date().toISOString(),
          })
        );

        switch (normalizedRole) {
          case "super-admin": navigate("/super-admin-dashboard"); break;
          case "admin": navigate("/admin-dashboard"); break;
          case "manager": navigate("/manager-dashboard"); break;
          case "salesperson": navigate("/sales-dashboard"); break;
          default: navigate("/sales-dashboard");
        }
      } else {
        const msg = response.data.message || "Invalid Credentials";
        setErrorModal({ show: true, message: msg === "Invalid credentials" ? "Invalid Credentials" : msg });
      }
    } catch (error) {
      console.error("Login error:", error);
      const msg = error.response?.data?.message || "Invalid Credentials";
      setErrorModal({ show: true, message: msg === "Invalid credentials" ? "Invalid Credentials" : msg });
    }
  };

  const getButtonColor = () => {
    const roleConfig = roles.find((r) => r.id === role);
    return roleConfig ? roleConfig.color : "from-blue-500 to-purple-600";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 relative overflow-hidden">
      
      {/* Background blobs for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem] p-8 sm:p-12 border border-white/50 relative z-10 transition-all">
        {/* Logo Section */}
        <div className="flex justify-center mb-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <img
                src="https://coppergat.com/wp-content/uploads/2023/02/1.webp"
                alt="Company Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to manage your quotations</p>
        </div>

        {/* Role Selection - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {roles.map((roleItem) => (
            <button
              key={roleItem.id}
              type="button"
              className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center ${
                role === roleItem.id
                  ? `border-transparent bg-gradient-to-r ${roleItem.color} text-white shadow-lg`
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setRole(roleItem.id)}
            >
              <div className="text-2xl mb-2">{roleItem.icon}</div>
              <div className="font-semibold text-sm">{roleItem.name}</div>
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex justify-between">
              Email Address
              {credentials.username && !isEmailValid(credentials.username) && (
                <span className="text-red-500 normal-case font-medium">Invalid email format</span>
              )}
            </label>
            <input
              type="email"
              name="username"
              placeholder="name@company.com"
              className={`w-full p-4 bg-gray-50 border ${credentials.username && !isEmailValid(credentials.username) ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-blue-100'} rounded-2xl focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 text-gray-900`}
              value={credentials.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all duration-200 text-gray-900"
                value={credentials.password}
                onChange={handleInputChange}
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

          <button
            type="submit"
            disabled={!credentials.username || !credentials.password || !isEmailValid(credentials.username)}
            className={`w-full p-5 text-white text-lg font-bold rounded-2xl shadow-xl shadow-blue-500/20 transform transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed bg-gradient-to-r ${getButtonColor()}`}
          >
            Sign in as {roles.find((r) => r.id === role)?.name}
          </button>
        </form>

        {/* Custom Error Modal */}
        {errorModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setErrorModal({ show: false, message: "" })}></div>
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-gray-100 text-center">
              <button 
                onClick={() => setErrorModal({ show: false, message: "" })}
                className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <FiX size={24} />
              </button>
              
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiAlertCircle size={32} />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">Login Failed</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {errorModal.message}
              </p>
              
              <button 
                onClick={() => setErrorModal({ show: false, message: "" })}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <style>{`
          .animate-fadeIn {
            animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}

