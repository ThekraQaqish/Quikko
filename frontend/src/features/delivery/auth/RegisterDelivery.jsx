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
import logo from "../../../assets/LogoDark.png";

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
      {/* Left side */}
      <div className="w-1/2 bg-black text-white p-6 relative h-[100vh]">
        <img
          src={logo}
          alt="Qwikko Logo"
          className="w-100 h-100 object-contain absolute top-25 left-1/2 transform -translate-x-1/2"
        />
        <p className="text-2xl max-w-md absolute top-[360px] left-1/2 transform -translate-x-1/2 text-center">
          Welcome to Qwikko! Start your delivery journey with us.
        </p>
      </div>

      {/* Right side */}
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
            className="w-full bg-black text-white p-3 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Google Sign-in button */}
        <div className="w-full max-w-md mt-4">
          <button
            type="button"
            className="w-full border border-gray-400 bg-transparent text-gray-700 p-3 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Sign in with Google</span>
          </button>
        </div>

        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        {successMessage && (
          <p className="mt-4 text-center text-green-600">{successMessage}</p>
        )}

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/delivery/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
