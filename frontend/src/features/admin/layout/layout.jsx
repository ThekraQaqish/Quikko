import { Outlet, useLocation } from "react-router-dom";
import SideBar from "./sideBar";
import { FiBell, FiChevronDown } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";

export default function Layout() {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/home":
        return "Dashboard";
      case "/vendors":
        return "Vendors";
      case "/delivery":
        return "Delivery Companies";
      case "/orders":
        return "Order Monitoring";
      case "/cms":
        return "Content Management Page (CMS)";
      case "/settings":
        return "Settings";
      default:
        return "Home";
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <SideBar />

      <div className="flex-1 flex flex-col min-h-0">
        <header className="sticky top-0 z-20 flex justify-between items-center bg-white shadow px-6 py-4">
          <h1 className="text-xl font-bold">{getTitle()}</h1>
          <div className="flex items-center space-x-4">
            <button className="relative">
              <FiBell className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2 cursor-pointer">
              <FaRegUserCircle className="text-xl" />
              <span>Admin</span>
              <FiChevronDown />
            </div>
          </div>
        </header>

        <main className="p-6 overflow-auto flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
