import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../delivery/Landing";
import RegisterDelivery from "../auth/RegisterDelivery";
import LoginDelivery from "../auth/Login";
import DeliveryProfile from "../delivery/DeliveryProfile";
import Settings from "../delivery/Settings";
import Dashboard from "../delivery/Dashboard";
import Orders from "../delivery/Orders";
import TrackingOrders from "../delivery/Tracking";
import Reports from "../delivery/ReportsPage";
import Home from "../delivery/Home";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/delivery/" element={<LandingPage />} />
        <Route path="/delivery/login" element={<LoginDelivery />} />
        <Route path="/delivery/register" element={<RegisterDelivery />} />

        {/* Dashboard كمكون رئيسي */}
        <Route path="/delivery/dashboard" element={<Dashboard />}>
          {/* الصفحة الافتراضية تظهر عند /delivery/dashboard */}
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="getProfile" element={<DeliveryProfile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="orders" element={<Orders />} />
          <Route path="tracking/:orderId" element={<TrackingOrders />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}
