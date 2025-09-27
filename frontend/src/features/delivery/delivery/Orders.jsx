import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompanyOrders, updateOrderStatus } from "./DeliveryAPI";
import { FaBox, FaTimes } from "react-icons/fa";

const ALLOWED_STATUSES = [
  "pending",
  "processing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchCompanyOrders();
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        setMessage("❌ " + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    if (!value) setFilteredOrders(orders);
    else setFilteredOrders(orders.filter((o) => o.status === value));
  };

  const openStatusModal = (orderId, status) => {
    setCurrentOrderId(orderId);
    setCurrentStatus(status);
    setShowModal(true);
  };

  const handleSaveStatus = async () => {
    try {
      await updateOrderStatus(currentOrderId, currentStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === currentOrderId ? { ...o, status: currentStatus } : o
        )
      );
      setFilteredOrders((prev) =>
        prev.map((o) =>
          o.id === currentOrderId ? { ...o, status: currentStatus } : o
        )
      );
      setShowModal(false);
      setMessage("✅ Status updated successfully!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">⏳ Loading orders...</p>;
  if (!orders.length)
    return <p className="text-center mt-10">📭 No orders found.</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
        <FaBox className="text-green-600 text-3xl" /> Company Orders
      </h2>

      {/* فلتر الحالة */}
      <div className="mb-6 flex justify-end">
        <select
          value={statusFilter}
          onChange={handleFilterChange}
          className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-black"
        >
          <option value="">All Statuses</option>
          {ALLOWED_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ").toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o, idx) => (
              <tr
                key={o.id}
                className={`${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <td className="p-3 font-medium text-gray-800">{o.id}</td>
                <td className="p-3">{o.customer_id}</td>
                <td className="p-3 font-semibold text-green-700">
                  {o.total_amount} JOD
                </td>
                <td className="p-3 capitalize">
                  {o.status.replace(/_/g, " ")}
                </td>
                <td className="p-3">{o.payment_status}</td>
                <td className="p-3">{o.shipping_address}</td>
                <td className="p-3 text-sm text-gray-500">
                  {new Date(o.created_at).toLocaleString()}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => openStatusModal(o.id, o.status)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Edit Status
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/delivery/dashboard/tracking/${o.id}`)
                    }
                    className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                  >
                    Track
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال تعديل الحالة */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Edit Order Status
            </h3>
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="w-full border p-2 rounded-lg mb-4 focus:ring-2 focus:ring-black"
            >
              {ALLOWED_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ").toUpperCase()}
                </option>
              ))}
            </select>
            <button
              onClick={handleSaveStatus}
              className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
