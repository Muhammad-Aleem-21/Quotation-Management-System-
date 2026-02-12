import { useEffect } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SalesDashboard from "./pages/salesperson/SalespersonDashboard";
import AdminNavbar from "./components/AdminNavbar";
import SalesNavbar from "./components/SalespersonNavbar";
import Allsalesperson from "./pages/admin/Allsalesperson";
import CreateQuotation from "./quotation/CreateQuotation";
//import QuotationRequests from "./pages/admin/QuotationRequests";
//import Approved from "./pages/admin/Approved";
//import Rejected from "./pages/admin/Rejected";
//import AccessLevels from "./pages/admin/ProductManagement";

import TotalQuotations from "./pages/admin/subPages/TotalQuotations";
import PendingAdmin from "./pages/admin/subPages/Pending";
import ApprovedAdmin from "./pages/admin/subPages/Approved";
import RejectedAdmin from "./pages/admin/subPages/Rejected";
import Managers from "./pages/admin/subPages/Managers";
import Win from "./pages/admin/subPages/Win";
import TeamManagementAdmin from "./pages/admin/TeamManagement";

//salesperson Imports
import MyQuotations from "./pages/salesperson/MyQuotations";
import Profile from "./pages/salesperson/Profile";
import AcceptedQuotations from "./pages/salesperson/subPages/AcceptedQuotations";
import RejectedQuotations from "./pages/salesperson/subPages/RejectedQuotations";
import PendingQuotations from "./pages/salesperson/subPages/PendingQuotations";
import WinQuotations from "./pages/salesperson/subPages/WinQuotations";
import SalesTeamManagement from "./pages/salesperson/SalesTeamManagement";

// Super Admin Imports
import SuperAdminNavbar from "./components/SuperAdminNavbar";
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import UserManagement from "./pages/super-admin/UserManagement";
import SystemSettings from "./pages/super-admin/SystemSettings";
import SuperadminProfile from "./pages/super-admin/SuperadminProfile";
import AuditLogs from "./pages/super-admin/AuditLogs";
import ProductManagement from "./quotation/ProductManagement";
import AdminProfile from "./pages/admin/AdminProfile";

//subpages for super admin
import AcceptedList from "./pages/super-admin/subPages/AcceptedList";
import TotalUsersList from "./pages/super-admin/subPages/TotalUsersList";
import AdminList from "./pages/super-admin/subPages/AdminList";
import ManagerList from "./pages/super-admin/subPages/ManagerList";
import PendingList from "./pages/super-admin/subPages/PendingList";
import RejectedList from "./pages/super-admin/subPages/RejectedList";
import SalespersonList from "./pages/super-admin/subPages/SalespersonList";
import WinList from "./pages/super-admin/subPages/WinList";
import UserDetail from "./pages/super-admin/subPages/UserDetail";

// Add Manager Imports
import ManagerNavbar from "./components/ManagerNavbar";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import TeamManagement from "./pages/manager/TeamManagement";
import TeamQuotations from "./pages/manager/TeamQuotations";
import PerformanceReports from "./pages/manager/PerformanceReports";
import ManagerProfile from "./pages/manager/ManagerProfile";
import ActiveMembers from "./pages/manager/subPages/ActiveMembers";
import ActiveQuotations from "./pages/manager/subPages/ActiveQuotations";
import TeamRevenue from "./pages/manager/subPages/TeamRevenue";
import Pending from "./pages/manager/subPages/Pending";
import RejectedQuot from "./pages/manager/subPages/Rejected";
import "./App.css";



const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("user");

  // User must be logged in with a token
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // NEW: Multiple roles support
  if (allowedRoles) {
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }
  // OLD: Single role support (kept exactly as before)
  else if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};
// const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
//   const token = localStorage.getItem("token");
//   const userRole = localStorage.getItem("userRole");
//   const user = localStorage.getItem("user");

//   // User must be logged in with token
//   if (!token || !user) {
//     return <Navigate to="/" replace />;
//   }

//   // Multiple roles support
//   if (allowedRoles) {
//     if (!allowedRoles.includes(userRole)) {
//       return redirectToDashboard(userRole);
//     }
//   }
//   // Single role support
//   else if (requiredRole && userRole !== requiredRole) {
//     return redirectToDashboard(userRole);
//   }

//   return children;
// };

// // Helper function to redirect based on role
// const redirectToDashboard = (role) => {
//   switch (role) {
//     case "super_admin":
//       return <Navigate to="/super-admin-dashboard" replace />;
//     case "admin":
//       return <Navigate to="/admin-dashboard" replace />;
//     case "manager":
//       return <Navigate to="/manager-dashboard" replace />;
//     case "salesperson":
//       return <Navigate to="/sales-dashboard" replace />;
//     default:
//       return <Navigate to="/" replace />;
//   }
// };
/////
const ProductManagementWrapper = () => {
  const role = localStorage.getItem("role");

  if (role === "super-admin") {
    return (
      <SuperAdminLayout>
        <ProductManagement />
      </SuperAdminLayout>
    );
  }

  if (role === "admin") {
    return (
      <AdminLayout>
        <ProductManagement />
      </AdminLayout>
    );
  }

  return <Navigate to="/" replace />;
};



const CreateQuotationWrapper = () => {
  const role = localStorage.getItem("role");

  if (role === "super-admin") {
    return (
      <SuperAdminLayout>
        <CreateQuotation userRole={role} />
      </SuperAdminLayout>
    );
  }

  if (role === "admin") {
    return (
      <AdminLayout>
        <CreateQuotation userRole={role} />
      </AdminLayout>
    );
  }

  if (role === "manager") {
    return (
      <ManagerLayout>
        <CreateQuotation userRole={role} />
      </ManagerLayout>
    );
  }

  if (role === "salesperson") {
    return (
      <SalesLayout>
        <CreateQuotation userRole={role} />
      </SalesLayout>
    );
  }

  return <Navigate to="/" replace />;
};

const UserProfileWrapper = () => {
  const role = localStorage.getItem("role");

  if (role === "super-admin") {
    return (
      <SuperAdminLayout>
        <UserDetail />
      </SuperAdminLayout>
    );
  }

  if (role === "admin") {
    return (
      <AdminLayout>
        <UserDetail />
      </AdminLayout>
    );
  }

  return <Navigate to="/" replace />;
};

/////

// Layout Components
const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <AdminNavbar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 min-h-screen bg-gray-900 overflow-auto">
        <div className="lg:mt-0 mt-14">{children}</div>
      </main>
    </div>
  );
};
//saleman Layout
const SalesLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <SalesNavbar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 min-h-screen bg-gray-900 overflow-auto">
        <div className="lg:mt-0 mt-14">{children}</div>
      </main>
    </div>
  );
};

// Super Admin Layout
const SuperAdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <SuperAdminNavbar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 min-h-screen bg-gray-900 overflow-auto">
        <div className="lg:mt-0 mt-14">{children}</div>
      </main>
    </div>
  );
};

// Add Manager Layout
const ManagerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <ManagerNavbar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 min-h-screen bg-gray-900 overflow-auto">
        <div className="lg:mt-0 mt-14">{children}</div>
      </main>
    </div>
  );
};

function App() {
  // Add this useEffect to check initial theme
  useEffect(() => {
    console.log("App loaded - HTML class:", document.documentElement.className);
    //console.log("LocalStorage theme:", localStorage.getItem("theme"));
  }, []);
  return (
    <Router>
      <Routes>
        {/* LOGIN PAGE */}
        <Route path="/" element={<Login />} />
        {/* ADMIN ROUTES */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-team-management"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <TeamManagementAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-profile"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminProfile />
              </AdminLayout>
            </ProtectedRoute>
          }
        />  
      
        {/* Admin Subpages */}
        <Route path="/admin/total-quotations" element={<ProtectedRoute requiredRole="admin"><TotalQuotations /></ProtectedRoute>} />
        <Route path="/admin/pending" element={<ProtectedRoute requiredRole="admin"><PendingAdmin /></ProtectedRoute>} />
        <Route path="/admin/approved" element={<ProtectedRoute requiredRole="admin"><ApprovedAdmin /></ProtectedRoute>} />
        <Route path="/admin/rejected" element={<ProtectedRoute requiredRole="admin"><RejectedAdmin /></ProtectedRoute>} />
        <Route path="/admin/managers" element={<ProtectedRoute requiredRole="admin"><Managers /></ProtectedRoute>} />
        <Route path="/admin/win" element={<ProtectedRoute requiredRole="admin"><Win /></ProtectedRoute>} />
        {/* SUPER ADMIN ROUTES */}
        <Route
          path="/super-admin-dashboard"
          element={
            <ProtectedRoute requiredRole="super-admin">
              <SuperAdminLayout>
                <SuperAdminDashboard />
              </SuperAdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute requiredRole="super-admin">
              <SuperAdminLayout>
                <UserManagement />
              </SuperAdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/system-settings"
          element={
            <ProtectedRoute requiredRole="super-admin">
              <SuperAdminLayout>
                <SystemSettings />
              </SuperAdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute requiredRole="super-admin">
              <SuperAdminLayout>
                <AuditLogs />
              </SuperAdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin-profile"
          element={
            <ProtectedRoute requiredRole="super-admin">
              <SuperAdminLayout>
                <SuperadminProfile />
              </SuperAdminLayout>
            </ProtectedRoute>
          }
        />  
        <Route
          path="/product-management"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
              <ProductManagementWrapper />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/product-management"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
              <ProductManagementWrapper />
            </ProtectedRoute>
          }
        /> */}
        {/* Super Admin Subpages */}
        <Route path="/accepted-list" element={<ProtectedRoute requiredRole="super-admin"><AcceptedList /></ProtectedRoute>} />
        <Route path="/total-users" element={<ProtectedRoute requiredRole="super-admin"><TotalUsersList /></ProtectedRoute>} />
        <Route path="/admin-list" element={<ProtectedRoute requiredRole="super-admin"><AdminList /></ProtectedRoute>} />
        <Route path="/manager-list" element={<ProtectedRoute requiredRole="super-admin"><ManagerList /></ProtectedRoute>} />
        <Route path="/pending-list" element={<ProtectedRoute requiredRole="super-admin"><PendingList /></ProtectedRoute>} />
        <Route path="/rejected-list" element={<ProtectedRoute requiredRole="super-admin"><RejectedList /></ProtectedRoute>} />
        <Route path="/salesperson-list" element={<ProtectedRoute requiredRole="super-admin"><SalespersonList /></ProtectedRoute>} />
        <Route path="/win-list" element={<ProtectedRoute requiredRole="super-admin"><WinList /></ProtectedRoute>} />
        <Route 
          path="/user-profile/:id" 
          element={
            <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
              <UserProfileWrapper />
            </ProtectedRoute>
          } 
        />
        {/* SALES ROUTES */}
        <Route
          path="/sales-dashboard"
          element={
            <ProtectedRoute requiredRole="salesperson">
              <SalesLayout>
                <SalesDashboard />
              </SalesLayout>
            </ProtectedRoute>
          }
        />
     
        {/* NEW ROUTE - For all roles */}
        <Route
          path="/create-quotation"
          element={
            <ProtectedRoute
              allowedRoles={["super-admin", "admin", "manager", "salesperson"]}
            >
              <CreateQuotationWrapper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-quotation"
          element={
            <ProtectedRoute requiredRole="salesperson">
              <SalesLayout>
                <MyQuotations />
              </SalesLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole="salesperson">
              <SalesLayout>
                <Profile />
              </SalesLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales-team-management"
          element={
            <ProtectedRoute requiredRole="salesperson">
              <SalesLayout>
                <SalesTeamManagement />
              </SalesLayout>
            </ProtectedRoute>
          }
        />
        {/* Salesperson Subpages */}
        <Route path="/accepted-quotations" element={<ProtectedRoute requiredRole="salesperson"><AcceptedQuotations /></ProtectedRoute>} />
        <Route path="/rejected-quotations" element={<ProtectedRoute requiredRole="salesperson"><RejectedQuotations /></ProtectedRoute>} />
        <Route path="/pending-quotations" element={<ProtectedRoute requiredRole="salesperson"><PendingQuotations /></ProtectedRoute>} />
        <Route path="/win-quotations" element={<ProtectedRoute requiredRole="salesperson"><WinQuotations /></ProtectedRoute>} />
        // Add this route in your Manager Routes section:
        <Route
          path="/manager-profile"
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerLayout>
                <ManagerProfile />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        {/* REDIRECT TO LOGIN FOR UNKNOWN ROUTES */}
        <Route path="*" element={<Navigate to="/" replace />} />
        // Add these routes for Manager
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerLayout>
                <ManagerDashboard />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/team-management"
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerLayout>
                <TeamManagement />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/team-quotations"
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerLayout>
                <TeamQuotations />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/performance-reports"
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerLayout>
                <PerformanceReports />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-profile"
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerLayout>
                <div className="p-6 text-white">
                  Manager Profile Page - Coming Soon
                </div>
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        {/* Manager Subpages */}
        <Route path="/active-members" element={<ProtectedRoute requiredRole="manager"><ActiveMembers /></ProtectedRoute>} />
        <Route path="/active-quotations" element={<ProtectedRoute requiredRole="manager"><ActiveQuotations /></ProtectedRoute>} />
        <Route path="/team-revenue" element={<ProtectedRoute requiredRole="manager"><TeamRevenue /></ProtectedRoute>} />
        <Route path="/manager/pending" element={<ProtectedRoute requiredRole="manager"><Pending /></ProtectedRoute>} />
        <Route path="/manager/rejected" element={<ProtectedRoute requiredRole="manager"><RejectedQuot /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
