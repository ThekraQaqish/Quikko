import React, { useState, useEffect } from "react";
import { fetchOrderItems, updateOrderItemStatus } from "../VendorAPI";

export default function OrderManagement() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState(""); // فلتر الحالة
  const [loading, setLoading] = useState(false);

  const allowedStatuses = ["pending", "accepted", "rejected"];

  const loadItems = async (statusFilter = "") => {
    setLoading(true);
    try {
      const data = await fetchOrderItems();

      // فلترة حسب الحالة
      const filtered =
        statusFilter === ""
          ? data
          : data.filter((i) => i.vendor_status === statusFilter);

      setItems(filtered);
    } catch (err) {
      console.error("Error loading order items:", err);
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleStatusChange = async (itemId, newStatus) => {
    if (!allowedStatuses.includes(newStatus)) return;
    await updateOrderItemStatus(itemId, newStatus);
    loadItems(filter);
  };

  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilter(status);
    loadItems(status);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Management (Vendor Items)</h1>

      {/* فلتر الحالة */}
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="statusFilter">Filter by Item Status:</label>
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
        <p>Loading items...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border p-2">Item ID</th>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Vendor Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.order_item_id} className="text-center">
                <td className="border p-2">{item.order_item_id}</td>
                <td className="border p-2">{item.order_id}</td>
                <td className="border p-2">{item.product_name}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">
                  <select
                    value={item.vendor_status}
                    onChange={(e) =>
                      handleStatusChange(item.order_item_id, e.target.value)
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
