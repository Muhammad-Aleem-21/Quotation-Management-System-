
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [role, setRole] = useState("admin");
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [credentials, setCredentials] = useState({
//     username: "",
//     password: "",
//     email: "",
//     confirmPassword: ""
//   });
//   const [signUpSuccess, setSignUpSuccess] = useState(false);
//   const navigate = useNavigate();

//   const roles = [
//     { id: "super-admin", name: "Super Admin", color: "from-red-500 to-pink-600", icon: "👑" },
//     { id: "admin", name: "Admin", color: "from-blue-500 to-purple-600", icon: "⚡" },
//     { id: "manager", name: "Manager", color: "from-green-500 to-teal-600", icon: "👔" },
//     { id: "salesperson", name: "Salesperson", color: "from-orange-500 to-yellow-600", icon: "💼" }
//   ];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();
    
//     // Simple validation
//     if (!credentials.username || !credentials.password) {
//       alert("Please enter both username and password");
//       return;
//     }

//     // 🔥 Save the role and user info in localStorage
//     localStorage.setItem("role", role);
//     localStorage.setItem("user", JSON.stringify({
//       username: credentials.username,
//       email: credentials.email,
//       role: role,
//       loginTime: new Date().toISOString()
//     }));

//     // Navigate based on role - ONLY FOR LOGIN
//     switch (role) {
//       case "super-admin":
//         navigate("/super-admin-dashboard");
//         break;
//       case "admin":
//         navigate("/admin-dashboard");
//         break;
//       case "manager":
//         navigate("/manager-dashboard");
//         break;
//       case "salesperson":
//         navigate("/sales-dashboard");
//         break;
//       default:
//         navigate("/sales-dashboard");
//     }
//   };

//   const handleSignUp = (e) => {
//     e.preventDefault();
    
//     // Sign up validation
//     if (!credentials.username || !credentials.password || !credentials.email) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     if (credentials.password !== credentials.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     // Simulate successful signup
//     console.log("Sign up successful:", {
//       username: credentials.username,
//       email: credentials.email,
//       role: role
//     });

//     // Show success message and go back to login
//     setSignUpSuccess(true);
//     setTimeout(() => {
//       setIsSignUp(false);
//       setSignUpSuccess(false);
//       // Reset credentials
//       setCredentials({
//         username: "",
//         password: "",
//         email: "",
//         confirmPassword: ""
//       });
//     }, 2000);
//   };

//   const handleBackToLogin = () => {
//     setIsSignUp(false);
//     setSignUpSuccess(false);
//     // Reset credentials for login
//     setCredentials({
//       username: "",
//       password: "",
//       email: "",
//       confirmPassword: ""
//     });
//   };

//   const getButtonColor = () => {
//     const roleConfig = roles.find(r => r.id === role);
//     return roleConfig ? roleConfig.color : "from-blue-500 to-purple-600";
//   };

//   // Success message component
//   if (signUpSuccess) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
//         <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 border border-gray-200 text-center">
//           <div className="text-6xl mb-4">🎉</div>
//           <h2 className="text-2xl font-bold text-green-600 mb-4">Account Created Successfully!</h2>
//           <p className="text-gray-600 mb-6">
//             Your {roles.find(r => r.id === role)?.name} account has been created. 
//             You can now login with your credentials.
//           </p>
//           <button
//             onClick={handleBackToLogin}
//             className="w-full p-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-md transition-all hover:scale-105"
//           >
//             Continue to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
//       <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8 border border-gray-200">
//         {/* Logo Section - Replaced Welcome Text */}
//         <div className="flex justify-center mb-6">
//           <img 
//             src="https://coppergat.com/wp-content/uploads/2023/02/1.webp" 
//             alt="Company Logo" 
//             className="h-16 w-auto object-contain"
//           />
//         </div>
        
//         <p className="text-gray-600 text-center mb-8">
//           {isSignUp ? "Join our platform today" : "Sign in to your account"}
//         </p>

//         {/* Role Selection - 2x2 Grid */}
//         <div className="grid grid-cols-2 gap-4 mb-8">
//           {roles.map((roleItem) => (
//             <button
//               key={roleItem.id}
//               type="button"
//               className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
//                 role === roleItem.id
//                   ? `border-transparent bg-gradient-to-r ${roleItem.color} text-white shadow-lg`
//                   : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
//               }`}
//               onClick={() => setRole(roleItem.id)}
//             >
//               <div className="text-2xl mb-2">{roleItem.icon}</div>
//               <div className="font-semibold text-sm">{roleItem.name}</div>
//             </button>
//           ))}
//         </div>

//         {/* Form */}
//         <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4 animate-fadeIn">
//           {isSignUp && (
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//               value={credentials.email}
//               onChange={handleInputChange}
//               required
//             />
//           )}
          
//           <input
//             type="text"
//             name="username"
//             placeholder={
//               role === "super-admin" ? "Super Admin ID" :
//               role === "admin" ? "Admin ID" :
//               role === "manager" ? "Manager ID" : "Salesperson ID"
//             }
//             className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//             value={credentials.username}
//             onChange={handleInputChange}
//             required
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
//             value={credentials.password}
//             onChange={handleInputChange}
//             required
//           />

//           {isSignUp && (
//             <input
//               type="password"
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
//               value={credentials.confirmPassword}
//               onChange={handleInputChange}
//               required
//             />
//           )}

//           <button
//             type="submit"
//             className={`w-full p-4 text-white text-lg font-semibold rounded-xl shadow-md transition-all hover:scale-105 bg-gradient-to-r ${getButtonColor()}`}
//           >
//             {isSignUp ? "Create Account" : `Login as ${roles.find(r => r.id === role)?.name}`}
//           </button>
//         </form>

//         {/* Toggle between Login and Sign Up */}
//         <div className="text-center mt-6">
//           <button
//             type="button"
//             onClick={isSignUp ? handleBackToLogin : () => setIsSignUp(true)}
//             className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
//           >
//             {isSignUp ? "← Back to Login" : "Don't have an account? Sign Up"}
//           </button>
//         </div>

//         {/* Demo Credentials Hint
//         {!isSignUp && (
//           <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
//             <p className="text-sm text-gray-600 text-center">
//               <strong>Demo Tip:</strong> Enter any username and password to login
//             </p>
//           </div>
//         )} */}
//       </div>

//       <style>{`
//         .animate-fadeIn {
//           animation: fadeIn 0.4s ease-in-out;
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// }







import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("admin");
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();

  const roles = [
    { id: "super-admin", name: "Super Admin", color: "from-red-500 to-pink-600", icon: "👑" },
    { id: "admin", name: "Admin", color: "from-blue-500 to-purple-600", icon: "⚡" },
    { id: "manager", name: "Manager", color: "from-green-500 to-teal-600", icon: "👔" },
    { id: "salesperson", name: "Salesperson", color: "from-orange-500 to-yellow-600", icon: "💼" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!credentials.username || !credentials.password) {
      alert("Please enter both username and password");
      return;
    }

    // 🔥 Save the role and user info in localStorage
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify({
      username: credentials.username,
      role: role,
      loginTime: new Date().toISOString()
    }));

    // Navigate based on role
    switch (role) {
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
  };

  const getButtonColor = () => {
    const roleConfig = roles.find(r => r.id === role);
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
          Sign in to your account
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
              role === "super-admin" ? "Super Admin ID" :
              role === "admin" ? "Admin ID" :
              role === "manager" ? "Manager ID" : "Salesperson ID"
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
            Login as {roles.find(r => r.id === role)?.name}
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