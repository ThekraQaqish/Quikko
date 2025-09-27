import React, { useState, useEffect } from "react";
import { fetchOrders, updateOrderStatus } from "../VendorAPI";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState(""); // فلتر الحالة
  const [loading, setLoading] = useState(false);

  const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"];

  // دالة لمنع التكرار بناءً على order_id
  const uniqueOrders = (data) => {
    const map = {};
    data.forEach((order) => {
      map[order.order_id] = order; // إذا تكرر order_id، سيتم استبداله
    });
    return Object.values(map);
  };

  const loadOrders = async (statusFilter = "") => {
    setLoading(true);
    try {
      const data = await fetchOrders();

      // فلترة حسب الحالة
      const filtered =
        statusFilter === ""
          ? data
          : data.filter((o) => o.status === statusFilter);

      // إزالة التكرار
      setOrders(uniqueOrders(filtered));
    } catch (err) {
      console.error("Error loading orders:", err);
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    if (!allowedStatuses.includes(newStatus)) return;
    await updateOrderStatus(orderId, newStatus);
    loadOrders(filter);
  };

  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilter(status);
    loadOrders(status);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>

      {/* فلتر الحالة */}
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select
          id="statusFilter"
          value={filter}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          {allowedStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Shipping Address</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="text-center">
                <td className="border p-2">{order.order_id}</td>
                <td className="border p-2">{order.total_amount}</td>
                <td className="border p-2">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.order_id, e.target.value)
                    }
                    className="border rounded p-1"
                  >
                    {allowedStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-2">{order.shipping_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}