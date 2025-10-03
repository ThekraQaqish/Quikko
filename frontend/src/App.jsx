
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MainLayout from "./features/customer/customer/components/layout/MainLayout";

import CustomerAuthRoutes from "./features/customer/auth/routes";
import ProductsPage from "./features/customer/customer/pages/ProductsPage";
import ProfilePage from "./features/customer/customer/pages/ProfilePage";
import OrdersPage from "./features/customer/customer/pages/OrdersPage";
import OrderDetailsPage from "./features/customer/customer/pages/OrderDetailsPage";
import StorePage from "./features/customer/customer/pages/StorePage";
import CartListPage from "./features/customer/customer/pages/CartListPage";
import CartDetailPage from "./features/customer/customer/pages/CartDetailPage";

// ✅ استدعاء الـ thunk لجلب المستخدم
import { fetchCurrentUser } from "./features/customer/customer/cartSlice";
import StoresPage from "./features/customer/customer/pages/StoresPage";
import TrackOrderPage from "./features/customer/customer/pages/TrackOrderPage";
import PaymentDetailsPage from "./features/customer/customer/pages/PaymentDetailsPage";
import LandingPage from "./features/customer/customer/pages/LandingPage";
import HomePage from "./features/customer/customer/pages/HomePage";
import SettingsPage from "./features/customer/customer/pages/SettingsPage";


import { requestAndSaveToken, listenToMessages ,registerServiceWorker } from "./utlis/fcm"; 

const AppRoutes = () => {
  const token = useSelector((state) => state.customerAuth.token);
  const location = useLocation();

  if (!token && !location.pathname.startsWith("/auth")) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Routes>
      <Route path="/auth/*" element={<CustomerAuthRoutes />} />
      <Route
        path="/"
        element={token ? <Navigate to="/home" replace /> : <LandingPage />}
      />


      {/* Routes بعد تسجيل الدخول */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage/>} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartListPage key={Date.now()}/>} />
        <Route path="/cart/:id" element={<CartDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/order-details/:orderId" element={<OrderDetailsPage />} />
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/stores/:id" element={<StorePage />} />
        <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/payment-details" element={<PaymentDetailsPage />} />
      </Route>
        <Route
          path="*"
          element={<Navigate to={token ? "/" : "/auth/login"} replace />}
        />
    </Routes>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.customerAuth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
      registerServiceWorker().then(() => {
      requestAndSaveToken(token);
    });
      listenToMessages((payload) => {
      console.log("Foreground notification:", payload);
      if (payload.notification) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/favicon.ico"
        });
      }
    });
    }
  }, [token, dispatch]);

  
  return <AppRoutes />;
};

export default App;
