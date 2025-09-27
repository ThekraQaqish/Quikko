import React from "react";

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="flex justify-between items-center p-2 border rounded">
    <div>
      <p>{item.name}</p>
      <p>Quantity: {item.quantity}</p>
      <p>Price: ${item.price}</p>
    </div>
    <button
      className="bg-red-500 text-white px-2 py-1 rounded"
      onClick={onRemove}
    >
      Remove
    </button>
  </div>
  );
};

export default CartItem;
