import { FiMenu, FiChevronDown } from "react-icons/fi";
import { useState } from "react";

export default function Navbar({ toggleSidebar, user, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

const getAvatar = () => {
  if (user?.avatarUrl) {
    return (
      <img src={user.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />
    );
  }

  // إذا user غير موجود أو الاسم غير موجود
const initials = user?.user_name
  ? user.company_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  : "GU";

  return (
    <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center font-semibold">
      {initials}
    </div>
  );
};


  return (
    <header className="sticky top-0 z-20 flex justify-between items-center bg-white shadow px-6 py-4">
      {/* زر التحكم بالSidebar */}
      <button onClick={toggleSidebar} className="text-2xl">
        <FiMenu />
      </button>

      {/* اسم المستخدم و Avatar */}
      <div
        className="relative flex items-center gap-2 cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {getAvatar()}
        <span>{user?.company_name || "Guest"}</span>
        <FiChevronDown />

        {/* Dropdown Logout */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-10 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
