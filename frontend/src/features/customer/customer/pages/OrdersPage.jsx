// src/features/customer/customer/pages/OrdersPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../ordersSlice";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { list: items, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        <div className="space-y-6">
          {items.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-2">
                Order #{order.id} - {order.status}
              </h2>
              <p className="text-gray-600 mb-2">
                Payment: {order.payment_status} | Total: ${order.total_amount}
              </p>
              <p className="text-gray-600 mb-2">Shipping: {order.shipping_address}</p>
              <div className="border-t pt-2">
                {order.items.map((item) => (
                  <div key={item.product_id} className="flex justify-between mb-1">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
