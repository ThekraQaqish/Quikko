
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Navbar from "../Layout/Navbar";
import { setUserFromToken } from "../auth/authSlice";
import { fetchDeliveryProfile } from "./DeliveryAPI";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar مغلق افتراضي
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // === جلب user من token عند إعادة تحميل الصفحة
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
   fetchDeliveryProfile(savedToken)
     .then((fetchedData) => {
       dispatch(
         setUserFromToken({
           user: fetchedData.company, // <--- هنا
           token: savedToken,
         })
       );
     })
     .catch((err) => {
       console.error("Failed to fetch user from token:", err);
       localStorage.removeItem("token");
     });
    }
  }, [dispatch]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutModal(false); // يغلق المودال
    navigate("/delivery/login");
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col min-h-0">
        {/* Navbar يتحكم بالSidebar ويأخذ اسم المستخدم */}
        <Navbar
          toggleSidebar={toggleSidebar}
          user={user || { name: "Guest" }}
          onLogout={() => setShowLogoutModal(true)}
        />

        {/* الصفحة */}
        <main className="p-6 overflow-auto flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* مودال Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
