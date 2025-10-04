import { useEffect, useState } from "react";
import { FiBell, FiChevronDown } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchNotifications } from "./VendorAPI";

export default function NavBar() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleProfileClick = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/vendor/login");
    } else {
      navigate("/vendor/profile");
    }
  };

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };
    loadNotifications();
  }, []);

  return (
    <header className="sticky top-0 z-20 flex justify-between items-center bg-white shadow px-6 py-4">
      {/* ✅ Website name (fixed) */}
      <h1 className="text-xl font-bold">Qwikko</h1>
      <div className="flex items-center space-x-4 relative">
        {/* 🔔 Notifications button */}
        <button
          className="relative"
          onClick={() => setOpenDropdown((prev) => !prev)}
        >
          <FiBell className="text-xl" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {notifications.length}
            </span>
          )}
        </button>

        {/* 🔽 Notifications dropdown */}
        {openDropdown && (
          <div className="absolute right-12 top-12 w-72 bg-white shadow-lg rounded-lg border border-gray-200">
            <div className="p-3 font-semibold border-b">Notifications</div>
            <ul className="max-h-60 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 text-sm hover:bg-gray-100 border-b last:border-0"
                  >
                    <p className="font-medium">{notif.title || "No Title"}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-sm text-gray-500">
                  No notifications
                </li>
              )}
            </ul>
            {/* 🔹 View all button */}
            <div className="p-2 border-t">
              <button
                onClick={() => {
                  setOpenDropdown(false);
                  navigate("/vendor/notifications");
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
              >
                View
              </button>
            </div>
          </div>
        )}

        {/* 👤 Profile */}
        <div
          onClick={handleProfileClick}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <FaRegUserCircle className="text-xl" />
          <span>Vendor</span>
          <FiChevronDown />
        </div>
      </div>
    </header>
  );
}
