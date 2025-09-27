import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, deleteItem } from "../cartSlice";
import { useParams,useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
const CartDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentCart, status, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart(id));
  }, [dispatch, id]);

  if (status === "loading") return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!currentCart) return <p>Cart not found</p>;

  const total = currentCart.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
    const handleCheckout = async () => {
    try {
        navigate(`/order-details/${currentCart.id}`);
    } catch (err) {
        console.error("Checkout failed", err);
    }
    };


  const handleRemove = (itemId) => {
    dispatch(deleteItem({ cartId: currentCart.id, itemId }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Cart Details</h1>

      {currentCart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {currentCart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={() => handleRemove(item.id)}
            />
          ))}
        </div>
      )}

      <p className="text-right text-xl font-bold mt-4">
        Total: ${total.toFixed(2)}
      </p>

      {currentCart.items.length > 0 && (
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default CartDetailPage;
