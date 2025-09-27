import React from "react";
import { Routes, Route } from "react-router-dom";
import VendorLayout from "./VendorLayout";
import VendorLanding from "./VendorLanding"; 
import Login from "./auth/Login";
import RegisterVendor from "./auth/RegisterVendor"; 
import VendorDashboard from "./dashboard/VendorDashboard";
import ProductManagement from "./product/ProductManagement";
import OrderManagement from "./order/OrderManagement";
import ChatPage from "./chat/ChatPage";
import ReportsPage from "./reports/ReportsPage";
import SettingsPage from "./settings/SettingsPage";

export default function VendorRoutes() {
  return (
    <Routes>
      <Route path="/vendor" element={<VendorLayout />}>
        {/* Landing Page عند الدخول على /vendor */}
        <Route index element={<VendorLanding />} /> 

        {/* Auth */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterVendor />} /> 
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
