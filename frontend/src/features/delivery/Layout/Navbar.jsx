import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiChevronDown,
  FiBell,
  FiMoon,
  FiSun,
  FiUser,
} from "react-icons/fi";

export default function Navbar({
  isSidebarOpen,
  toggleSidebar,
  user,
  onToggleTheme,
  isDarkMode,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // ✅ نستخدمها للتنقل

  const getAvatar = () => {
    if (user?.avatarUrl) {
      return (
        <img
          src={user.avatarUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover "
        />
      );
    }
    const initials = user?.company_name
      ? user.company_name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "GU";

    return (
      <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
        {initials}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-20 flex justify-between items-center bg-white shadow px-6 py-4">
      {/* القسم الأيسر: زر السايدبار + اللوقو */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="text-2xl text-gray-700 hover:text-black transition"
        >
          {isSidebarOpen ? "" : <FiMenu />}
        </button>
        <div
          className={`text-2xl font-bold text-gray-800 transition-all duration-300 ${
            isSidebarOpen ? "ml-0" : "ml-2"
          } z-50`}
        >
          Qwikko
        </div>
      </div>

      {/* القسم الأيمن */}
      <div className="flex items-center gap-4">
        <button className="relative text-2xl text-gray-600 hover:text-black transition">
          <FiBell />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        {/* المستخدم */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-100 transition"
          >
            {getAvatar()}
            <span className="font-medium text-gray-700">
              {user?.company_name || "Guest"}
            </span>
            <FiChevronDown
              className={`transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl overflow-hidden z-50 border border-gray-100">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/delivery/dashboard/getProfile");
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-white transition"
              >
                <FiUser className="text-gray-600" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onToggleTheme();
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-100 transition"
              >
                {isDarkMode ? (
                  <>
                    <FiSun className="text-yellow-500" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <FiMoon className="text-gray-700" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
