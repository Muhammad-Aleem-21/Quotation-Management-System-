import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Login() {
  const [role, setRole] = useState("admin");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
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

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!credentials.username || !credentials.password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const response = await API.post("/login", {
        email: credentials.username,
        password: credentials.password,
      });
      if (response.data.success) {
        const { token, user, roles: apiRoles } = response.data;
        
        // Map API role names to internal route keys if they differ
        let normalizedRole = apiRoles[0];
        if (normalizedRole === "super_admin") normalizedRole = "super-admin";

        if (normalizedRole !== role) {
          alert(`Access Denied: You selected ${roles.find(r => r.id === role)?.name} but your credentials are for ${roles.find(r => r.id === normalizedRole)?.name}.`);
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

        // Navigate based on normalized role
        switch (normalizedRole) {
          case "super-admin":
            navigate("/super-admin-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "manager":
            navigate("/manager-dashboard");
            break;
          case "salesperson":
            navigate("/sales-dashboard");
            break;
          default:
            navigate("/sales-dashboard");
        }
      } else {
        alert(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "An error occurred during login");
    }
  };

  const getButtonColor = () => {
    const roleConfig = roles.find((r) => r.id === role);
    return roleConfig ? roleConfig.color : "from-blue-500 to-purple-600";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8 border border-gray-200">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <img
            src="https://coppergat.com/wp-content/uploads/2023/02/1.webp"
            alt="Company Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        <p className="text-gray-600 text-center mb-8">
          Login to your account
        </p>

        {/* Role Selection - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {roles.map((roleItem) => (
            <button
              key={roleItem.id}
              type="button"
              className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
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
        <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
          <input
            type="text"
            name="username"
            placeholder={
              role === "super-admin"
                ? "Super Admin ID"
                : role === "admin"
                  ? "Admin ID"
                  : role === "manager"
                    ? "Manager ID"
                    : "Salesperson ID"
            }
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={credentials.username}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            value={credentials.password}
            onChange={handleInputChange}
            required
          />

          <button
            type="submit"
            className={`w-full p-4 text-white text-lg font-semibold rounded-xl shadow-md transition-all hover:scale-105 bg-gradient-to-r ${getButtonColor()}`}
          >
            Login as {roles.find((r) => r.id === role)?.name}
          </button>
        </form>

        {/* Demo Credentials Hint - Optional, uncomment if needed */}
        {/* 
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            <strong>Demo Tip:</strong> Enter any username and password to login
          </p>
        </div>
        */}

        <style>{`
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}

