import {
  FaClipboardList,
  FaChartLine,
  FaUsers,
  FaDollarSign,
  FaTruck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-6 max-w-6xl mx-auto">
        <div className="text-2xl font-bold">QWIKKO</div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl p-6 mt-10">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl font-bold mb-6">
            Expand your delivery business with ease
          </h1>
          <p className="text-lg mb-6">
            Our platform helps delivery companies manage orders, reach more
            customers, and increase their profits.
          </p>
          <button
            onClick={() => navigate("/delivery/register")}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-500 transition-all duration-300 cursor-pointer"
          >
            Start Now
          </button>
          <button
            onClick={() => navigate("/delivery/login")}
            className="border border-black text-black px-6 py-3 rounded ml-3 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
          >
            Already have an account? Login
          </button>
        </div>
        {/* the track  */}
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <FaTruck
            className="text-black"
            style={{ width: "20vw", height: "20vw" }}
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full max-w-6xl p-6 mt-10 text-center">
        <h2 className="text-3xl font-bold mb-10">Benefits Section</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Card 1 */}
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-md p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
            <FaClipboardList className="text-6xl mb-4 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
            <p className="text-lg font-medium">Manage orders easily</p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-md p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
            <FaChartLine className="text-6xl mb-4 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
            <p className="text-lg font-medium">
              Accurate reports and statistics
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-md p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
            <FaUsers className="text-6xl mb-4 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
            <p className="text-lg font-medium">
              Reach thousands of customers & stores
            </p>
          </div>

          {/* Card 4 */}
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-md p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
            <FaDollarSign className="text-6xl mb-4 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
            <p className="text-lg font-medium">Guaranteed and fast payments</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full max-w-5xl p-10 mt-7 text-center">
        <h2 className="text-4xl font-bold mb-16">How It Works </h2>

        <div className="flex flex-col md:flex-row items-center justify-between relative">
          {/* خط التوصيل (الخط اللي بين الدواير) */}
          <div className="hidden md:block absolute top-14 left-0 w-full h-1 bg-gray-200 z-0"></div>

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center bg-white rounded-2xl shadow-md p-6 w-64 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-black to-gray-700 text-white text-2xl font-bold mb-4 shadow-md transition-transform duration-300 hover:scale-110">
              1
            </div>
            <p className="text-lg font-semibold">Register your company</p>
            <p className="text-sm text-gray-500 mt-2">
              Sign up quickly and create your business account.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center bg-white rounded-2xl shadow-md p-6 w-64 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-black to-gray-700 text-white text-2xl font-bold mb-4 shadow-md transition-transform duration-300 hover:scale-110">
              2
            </div>
            <p className="text-lg font-semibold">Connect your team</p>
            <p className="text-sm text-gray-500 mt-2">
              Add drivers and employees to start managing deliveries.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center bg-white rounded-2xl shadow-md p-6 w-64 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-black to-gray-700 text-white text-2xl font-bold mb-4 shadow-md transition-transform duration-300 hover:scale-110">
              3
            </div>
            <p className="text-lg font-semibold">Start receiving orders</p>
            <p className="text-sm text-gray-500 mt-2">
              Track and deliver orders smoothly and grow your business.
            </p>
          </div>
        </div>
      </section>


    </div>
  );
}
