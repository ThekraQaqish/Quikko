// src/pages/vendor/VendorLanding.jsx
import React from "react";
import { FaShoppingCart, FaUsers, FaChartLine, FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function VendorLanding() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <FaStore className="text-4xl text-orange-500" />,
      title: "Reach More Customers",
      description: "Expand your store reach by connecting with thousands of active buyers.",
    },
    {
      icon: <FaChartLine className="text-4xl text-orange-500" />,
      title: "Boost Your Sales",
      description: "Leverage our platform tools to grow your revenue and sales performance.",
    },
    {
      icon: <FaUsers className="text-4xl text-orange-500" />,
      title: "Community Support",
      description: "Join a network of vendors and get support from our dedicated team.",
    },
    {
      icon: <FaShoppingCart className="text-4xl text-orange-500" />,
      title: "Easy Store Management",
      description: "Manage your products, orders, and customers from a single dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-black text-white py-24 flex flex-col items-center text-center px-6">
        <h1 className="text-5xl font-extrabold mb-6">Grow Your Store with Qwikko</h1>
        <p className="text-xl mb-8 max-w-xl">
          Join our marketplace today and reach thousands of customers. Manage your store easily and boost your sales.
        </p>
        <button
          onClick={() => navigate("/vendor/register")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
        >
          Register Your Store
        </button>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Why Join Qwikko?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {benefits.map((b, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
            >
              {b.icon}
              <h3 className="text-xl font-semibold mt-4">{b.title}</h3>
              <p className="text-gray-600 mt-2">{b.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
