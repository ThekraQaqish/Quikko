import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function VendorLayout() {
  const navigate = useNavigate(); // <-- هذا مهم

  const handleLogout = () => {
    // مسح بيانات المستخدم من المتصفح
    localStorage.removeItem("vendorToken");
    sessionStorage.removeItem("vendorToken");

    // توجيه المستخدم للصفحة الرئيسية
    navigate("/vendor");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-200 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">Vendor Menu</h2>
          <nav className="flex flex-col gap-2">
            <Link to="/vendor/dashboard">Dashboard</Link>
            <Link to="/vendor/products">Products</Link>
            <Link to="/vendor/orders">Orders</Link>
            <Link to="/vendor/chat">Chat</Link>
            <Link to="/vendor/settings">Settings</Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
