import { motion } from "framer-motion";
import deliveryImg from "../../../assets/delivery-hero.jpg"; 

export default function DeliveryHome() {
  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen flex flex-col items-center justify-center px-6 py-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-5xl font-extrabold text-green-600 mb-4">
          Welcome to QWIKKO Delivery 
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          At <span className="font-semibold text-green-600">QWIKKO</span>, we
          redefine delivery. Our mission is to make every shipment fast,
          reliable, and hassle-free — so your packages reach their destination
          quickly and safely. Experience seamless logistics powered by
          technology and driven by passion.
        </p>
      </motion.div>

      {/* Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-8"
      >
        <img
          src={deliveryImg}
          alt="QWIKKO Delivery"
          className="w-full max-w-lg rounded-2xl shadow-lg"
        />
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl"
      >
        {[
          {
            title: "Ultra-Fast Delivery",
            desc: "We bring your packages to their destination at lightning speed, right when you need them.",
          },
          {
            title: "Trusted & Secure",
            desc: "Our professional team ensures your shipments are always handled with care and delivered safely.",
          },
          {
            title: "Real-Time Tracking",
            desc: "Know exactly where your delivery is — every step of the way, from pickup to doorstep.",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-green-600 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
