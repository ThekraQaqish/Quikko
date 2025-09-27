import { FaUser, FaClipboardList, FaCog, FaChartBar ,FaHome } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen }) {
  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "home" },
    { name: "Profile", icon: <FaUser />, path: "getProfile" },
    { name: "Orders", icon: <FaClipboardList />, path: "orders" },
    { name: "Reports", icon: <FaChartBar />, path: "reports" },
    { name: "Settings", icon: <FaCog />, path: "settings" },
  ];

  return (
    <div
      className={`bg-gray-900 text-white flex flex-col shadow-lg transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && <span className="ml-3 font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
