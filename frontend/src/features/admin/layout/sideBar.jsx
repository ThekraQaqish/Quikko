import { NavLink } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaUserTie } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { FaBoxOpen } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";

export default function SideBar() {
  return (
    <aside className="w-64 h-screen bg-white shadow-md flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="p-6 text-2xl font-bold">Qwikko</div>
        <nav className="flex flex-col space-y-2 px-4">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded hover:bg-gray-200 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            <AiOutlineDashboard />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/vendors"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded hover:bg-gray-200 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            <FaUserTie />
            <span>Vendors</span>
          </NavLink>

          <NavLink
            to="/delivery"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded hover:bg-gray-200 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            <FaTruckFast />
            <span>Delivery Companies</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded hover:bg-gray-200 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            <FaBoxOpen />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/cms"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded hover:bg-gray-200 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            <FaUserShield />
            <span>CMS</span>
          </NavLink>
        </nav>
      </div>

      <div className="px-4 pb-4">
        <NavLink
          to="/settings"
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200"
        >
          <FiSettings />
          <span>Settings</span>
        </NavLink>

        <NavLink
          to="/"
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 mt-2"
        >
          <FiLogOut />
          <span>Log out</span>
        </NavLink>
      </div>
    </aside>
  );
}
