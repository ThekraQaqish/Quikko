import { FiBell, FiChevronDown } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/vendor/login");
    } else {
      navigate("/vendor/profile");
    }
  };

  return (
    <header className="sticky top-0 z-20 flex justify-between items-center bg-white shadow px-6 py-4">
      {/* ✅ اسم الموقع ثابت */}
      <h1 className="text-xl font-bold">Qwikko</h1>
      <div className="flex items-center space-x-4">
        <button className="relative">
          <FiBell className="text-xl" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>
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
