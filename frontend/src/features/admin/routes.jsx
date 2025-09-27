import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./auth/loginForm";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminHome from "./dashboard/dashboard";
import Layout from "./layout/layout";
import VendorPage from "./vendor/vendor";
import DeliveryPage from "./delivery/delivery";
import OrdersPage from "./orders/order";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route
            element={
              <div className="flex">
                <Layout />
              </div>
            }
          >
            <Route
              path="/home"
              element={
                <ProtectedRoute role="admin">
                  <AdminHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendors"
              element={
                <ProtectedRoute role="admin">
                  <VendorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery"
              element={
                <ProtectedRoute role="admin">
                  <DeliveryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute role="admin">
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cms"
              element={
                <ProtectedRoute role="admin">
                  
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute role="admin">
                  
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
