import { useEffect } from "react";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

import TotalQuotations from './pages/admin/subPages/TotalQuotations';
import PendingAdmin from './pages/admin/subPages/Pending';
import ApprovedAdmin from './pages/admin/subPages/Approved';
import RejectedAdmin from './pages/admin/subPages/Rejected';
import Managers from './pages/admin/subPages/Managers';
import Win from './pages/admin/subPages/Win';


//salesperson Imports
import MyQuotations from "./pages/salesperson/MyQuotations";
import Profile from "./pages/salesperson/Profile";
import AcceptedQuotations from './pages/salesperson/subPages/AcceptedQuotations';
import RejectedQuotations from './pages/salesperson/subPages/RejectedQuotations';
import PendingQuotations from './pages/salesperson/subPages/PendingQuotations';
import WinQuotations from './pages/salesperson/subPages/WinQuotations';

// Super Admin Imports
import SuperAdminNavbar from "./components/SuperAdminNavbar";
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import UserManagement from "./pages/super-admin/UserManagement";
import SystemSettings from "./pages/super-admin/SystemSettings";
import AuditLogs from "./pages/super-admin/AuditLogs";
import ProductManagement from "./quotation/ProductManagement";

//subpages for super admin
import AcceptedList from './pages/super-admin/subPages/AcceptedList';
import ActiveList from './pages/super-admin/subPages/ActiveList';
import AdminList from './pages/super-admin/subPages/AdminList';
import ManagerList from './pages/super-admin/subPages/ManagerList';
import PendingList from './pages/super-admin/subPages/PendingList';
import RejectedList from './pages/super-admin/subPages/RejectedList';
import SalespersonList from './pages/super-admin/subPages/SalespersonList';
import WinList from './pages/super-admin/subPages/WinList';

// Add Manager Imports
import ManagerNavbar from "./components/ManagerNavbar";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import TeamManagement from "./pages/manager/TeamManagement";
import TeamQuotations from "./pages/manager/TeamQuotations";
import PerformanceReports from "./pages/manager/PerformanceReports";
import ManagerProfile from "./pages/manager/MyProfile"; // ADD THIS IMPORT
import ActiveMembers from './pages/manager/subPages/ActiveMembers';
import ActiveQuotations from './pages/manager/subPages/ActiveQuotations';
import TeamRevenue from './pages/manager/subPages/TeamRevenue';
import Pending from './pages/manager/subPages/Pending';
import RejectedQuot from './pages/manager/subPages/Rejected';
import "./App.css";

//import ThemeToggle from "./ThemeToggle"; // Add this import

// Protected Route Component
// const ProtectedRoute = ({ children, requiredRole }) => {
//   const role = localStorage.getItem("role");
//   const user = localStorage.getItem("user");

//   if (!user || role !== requiredRole) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("user");

  // User must be logged in
  if (!user) {
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

///// Create Quotation Wrapper
// const CreateQuotationWrapper = () => {
//   const role = localStorage.getItem("role");

//   if (role === "super-admin") {
//     return (
//       <SuperAdminLayout>
//         <CreateQuotation />
//       </SuperAdminLayout>
//     );
//   }

//   if (role === "admin") {
//     return (
//       <AdminLayout>
//         <CreateQuotation />
//       </AdminLayout>
//     );
//   }

//   if (role === "manager") {
//     return (
//       <ManagerLayout>
//         <CreateQuotation />
//       </ManagerLayout>
//     );
//   }

//   if (role === "salesperson") {
//     return (
//       <SalesLayout>
//         <CreateQuotation />
//       </SalesLayout>
//     );
//   }

//   return <Navigate to="/" replace />;
// };

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
/////

// Layout Components
const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
      <div className="flex">
        <AdminNavbar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        <main className="flex-1 min-h-screen bg-gray-900 overflow-auto">
          <div className="lg:mt-0 mt-14">
            {children}
          </div>
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
          <div className="lg:mt-0 mt-14">
            {children}
          </div>
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
        <div className="lg:mt-0 mt-14">
          {children}
        </div>
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
        <div className="lg:mt-0 mt-14">
          {children}
        </div>
      </main>
    </div>
  );

};


function App() {
   // Add this useEffect to check initial theme
  useEffect(() => {
    console.log("App loaded - HTML class:", document.documentElement.className);
    console.log("LocalStorage theme:", localStorage.getItem("theme"));
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
          path="/allsalesperson"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Allsalesperson />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/quotation-requests"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <QuotationRequests />
              </AdminLayout>
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/approved"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Approved />
              </AdminLayout>
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/rejected"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Rejected />
              </AdminLayout>
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/access-levels"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AccessLevels />
              </AdminLayout>
            </ProtectedRoute>
          }
        /> */}

        
        {/* Ruots for subpage for admin */}
        <Route path="/admin/total-quotations" element={<TotalQuotations />} />

        <Route path="/admin/pending" element={<PendingAdmin />} />
        <Route path="/admin/approved" element={<ApprovedAdmin />} />
        <Route path="/admin/rejected" element={<RejectedAdmin />} />
        <Route path="/admin/managers" element={<Managers />} />
        <Route path="/admin/win" element={<Win />} />

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

      

        {/* subpage routes for super admin */}
        <Route path="/accepted-list" element={<AcceptedList />} />

        <Route path="/active-list" element={<ActiveList />} />
        
        <Route path="/admin-list" element={<AdminList />} />
        
        <Route path="/manager-list" element={<ManagerList />} />

        <Route path="/pending-list" element={<PendingList />} />

        <Route path="/rejected-list" element={<RejectedList />} />

        <Route path="/salesperson-list" element={<SalespersonList />} />

        <Route path="/win-list" element={<WinList />} />

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

        {/* <Route
          path="/create-quotation"
          element={
            <ProtectedRoute requiredRole="salesperson">
              <SalesLayout>
                <CreateQuotation />
              </SalesLayout>
            </ProtectedRoute>
          }
        /> */}
        {/* NEW ROUTE - For all roles */}
        <Route
          path="/create-quotation"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "admin", "manager", "salesperson"]}>
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
        
        {/* salesperson subpage route ----------------------------------------------*/}
        
        <Route path="/accepted-quotations" element={<AcceptedQuotations />} 
        />
        <Route path="/rejected-quotations" element={<RejectedQuotations />} />

        <Route path="/pending-quotations" element={<PendingQuotations />} />

        <Route path="/win-quotations" element={<WinQuotations />} />

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
                <div className="p-6 text-white">Manager Profile Page - Coming Soon</div>
              </ManagerLayout>
            </ProtectedRoute>
          }
        />

        {/* Sub page route for manager */}
        <Route path="/active-members" element={<ActiveMembers />} />

        <Route path="/active-quotations" element={<ActiveQuotations />} />

        <Route path="/team-revenue" element={<TeamRevenue />} />

        <Route path="/manager/pending" element={<Pending />} />

        <Route path="/manager/rejected" element={<RejectedQuot />} />

      </Routes>
    </Router>
  );
}

export default App;