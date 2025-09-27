// src/features/customer/customer/pages/OrderDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import customerAPI from "../services/customerAPI";
import { useDispatch } from "react-redux";
import { fetchOrders } from "../ordersSlice"; 

const OrderDetailPage = () => {
  const { orderId } = useParams(); // هذا هو cartId الممرر من CartDetailPage
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  const [currentCart, setCurrentCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const [address, setAddress] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Jordan",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  // جلب تفاصيل الكارت
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        const cart = await customerAPI.getCartById(orderId);
        setCurrentCart(cart);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCurrentCart(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCartData();
  }, [orderId]);

  if (loading) return <p>Loading cart details...</p>;
  if (!currentCart) return <p>Cart not found</p>;

  const total = currentCart.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!address.address_line1 || !address.city) {
      alert("Address Line 1 and City are required!");
      return;
    }

    if (paymentMethod === "cod") {
      // إنشاء الأوردر مباشرة
      try {
        setCheckoutLoading(true);
        setCheckoutError(null);
        const newOrder = await customerAPI.checkout({
          cart_id: currentCart.id,
          address,
          payment_method: paymentMethod,
        });
        console.log("Order created:", newOrder);
        alert("Order successfully created!");
        dispatch(fetchOrders());

        // إعادة التوجيه لصفحة التأكيد أو الأوردر الجديد
        navigate(`/orders`);
      } catch (err) {
        console.error("Checkout failed:", err);
        setCheckoutError(err.response?.data?.error || err.message);
      } finally {
        setCheckoutLoading(false);
      }
    } else {
      // تحويل لصفحة إدخال تفاصيل الدفع
      navigate("/payment-details", {
        state: { cartId: currentCart.id, total, paymentMethod, address },
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Cart / Order Details</h1>

      {currentCart.items.length === 0 ? (
        <p>No items in this cart.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {currentCart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      )}

      <p className="text-right text-xl font-bold mb-4">
        Total: ${total.toFixed(2)}
      </p>

      {/* نموذج العنوان */}
      <div className="border p-4 rounded mb-4">
        <h2 className="text-2xl font-semibold mb-2">Shipping Address</h2>
        <input
          className="border rounded w-full p-2 mb-2"
          placeholder="Address Line 1 *"
          value={address.address_line1}
          onChange={(e) =>
            setAddress({ ...address, address_line1: e.target.value })
          }
        />
        <input
          className="border rounded w-full p-2 mb-2"
          placeholder="Address Line 2"
          value={address.address_line2}
          onChange={(e) =>
            setAddress({ ...address, address_line2: e.target.value })
          }
        />
        <input
          className="border rounded w-full p-2 mb-2"
          placeholder="City *"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <input
          className="border rounded w-full p-2 mb-2"
          placeholder="State"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
        />
        <input
          className="border rounded w-full p-2 mb-2"
          placeholder="Postal Code"
          value={address.postal_code}
          onChange={(e) =>
            setAddress({ ...address, postal_code: e.target.value })
          }
        />
        <input
          className="border rounded w-full p-2 mb-2"
          placeholder="Country"
          value={address.country}
          onChange={(e) =>
            setAddress({ ...address, country: e.target.value })
          }
        />
      </div>

      {/* اختيار طريقة الدفع */}
      <div className="border p-4 rounded mb-4">
        <h2 className="text-2xl font-semibold mb-2">Payment Method</h2>
        <select
          className="border rounded w-full p-2"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="cod">Cash on Delivery</option>
          <option value="credit_card">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>

      {checkoutError && (
        <p className="text-red-500 mt-2">{checkoutError}</p>
      )}

      <button
        onClick={handleCheckout}
        disabled={checkoutLoading}
        className={`w-full py-2 px-4 rounded text-white ${
          checkoutLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {checkoutLoading ? "Processing..." : "Checkout"}
      </button>
    </div>
  );
};

export default OrderDetailPage;
