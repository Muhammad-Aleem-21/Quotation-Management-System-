import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiFilePlus,
  FiClipboard,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function SalespersonNavbar({ open, setOpen }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/sales-dashboard" },
    {
      name: "Create Quotation",
      icon: <FiFilePlus />,
      path: "/create-quotation",
    },
    { name: "My Quotation", icon: <FiClipboard />, path: "/my-quotation" },
    { name: "Profile", icon: <FiUser />, path: "/profile" },
  ];

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/"); // Redirect to login page
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#0B1220] text-white fixed w-full z-50 h-16">
        <div className="h-8 flex items-center">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <img
              src="https://coppergat.com/wp-content/uploads/2023/02/1.webp"
              alt="logo"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>
        <button onClick={() => setOpen(!open)} className="text-2xl">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-[#0B1220] text-gray-300 shadow-xl z-40
        transform ${open ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 lg:translate-x-0 lg:static lg:sticky lg:top-0 lg:h-screen`}
      >
        {/* Logo Container - Hide only the logo on mobile, keep the border */}
        <div className="flex justify-center items-center p-6 border-b border-gray-700">
          {/* Logo - Hidden on mobile, shown on desktop */}
          <div className="bg-white p-3 rounded-lg shadow-sm lg:block hidden">
            <img
              src="https://coppergat.com/wp-content/uploads/2023/02/1.webp"
              alt="logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Empty space on mobile - same height as logo */}
          <div className="h-10 lg:hidden"></div>
        </div>

        {/* Menu - Using flex-1 to push logout button to bottom */}
        <div className="flex flex-col h-[calc(100vh-96px)]">
          {/* Navigation Items - Takes available space */}
          <nav className="flex flex-col mt-4 px-4 space-y-2 flex-1">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all 
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-[#1A2235] text-gray-300"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout Button - Fixed at bottom */}
          <div className="p-4 border-t border-gray-700 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium transition-all
                hover:bg-red-600 hover:text-white text-gray-300"
            >
              <FiLogOut className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
