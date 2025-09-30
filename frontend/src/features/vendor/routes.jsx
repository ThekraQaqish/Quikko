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
import ReportsPage from "./profile/VendorProfilePage";
import SettingsPage from "./settings/SettingsPage";
import VendorProfilepage from "./profile/VendorProfilePage";
import ProtectedRoute from "./ProtectedRoute";

export default function VendorRoutes() {
  return (
    <Routes>
      <Route path="/vendor" element={<VendorLayout />}>
        {/* Landing Page عند الدخول على /vendor */}
        <Route index element={<VendorLanding />} /> 

        {/* Auth */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterVendor />} /> 

        {/* الصفحات المحمية */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="products"
          element={
            <ProtectedRoute>
              <ProductManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <OrderManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <VendorProfilepage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
