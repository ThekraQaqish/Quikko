import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerDelivery, clearMessages } from "./authSlice";
import {
  FaShoppingBag,
  FaUser,
  FaEnvelope,
  FaLock,
  FaBuilding,
  FaPhone,
} from "react-icons/fa";

export default function RegisterDelivery() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company_name: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerDelivery(formData));
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        dispatch(clearMessages());
        navigate("/delivery/login");
      }, 1500);
    }
  }, [successMessage, dispatch, navigate]);

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-black text-white flex flex-col justify-center items-center p-12">
        <h1 className="text-5xl font-extrabold mb-6 flex items-center gap-4">
          <FaShoppingBag className="text-white" /> Qwikko
        </h1>
        <p className="text-xl max-w-md text-center mt-10">
          Welcome to Qwikko! Start your delivery journey with us.
        </p>
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center p-12 bg-white">
        <h2 className="text-3xl font-bold mb-6">Register Delivery Company</h2>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Contact Person Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="text"
              name="company_name"
              placeholder="Company Name"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <FaBuilding className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <FaPhone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-lg"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        {successMessage && (
          <p className="mt-4 text-center text-green-600">{successMessage}</p>
        )}
      </div>
    </div>
  );
}
