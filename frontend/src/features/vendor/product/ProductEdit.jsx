// src/pages/vendor/product/ProductEdit.jsx
import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm";

export default function ProductEdit({ product, categories, onUpdate, onCancel }) {
  const [initialData, setInitialData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    images: "",
    category_id: "",
    variants: "",
  });

  useEffect(() => {
    if (product) {
      setInitialData({
        ...product,
        images: product.images ? product.images.join(", ") : "",
        variants: product.variants ? JSON.stringify(product.variants) : "",
      });
    }
  }, [product]);

  const handleSubmit = (updatedData) => {
    const dataToSend = {
      ...updatedData,
      images: updatedData.images ? updatedData.images.split(",").map(i => i.trim()) : [],
      variants: updatedData.variants ? JSON.parse(updatedData.variants) : {},
      price: Number(updatedData.price),
      stock_quantity: Number(updatedData.stock_quantity),
      category_id: updatedData.category_id || null,
    };

    onUpdate(dataToSend);
  };

  return (
    <div className="mb-6 border p-4 rounded shadow">
      <h2 className="text-xl mb-2">Edit Product</h2>
      <ProductForm
        initialData={initialData}
        categories={categories}
        onSubmit={handleSubmit}
      />
      <button
        onClick={onCancel}
        className="mt-2 bg-gray-300 text-black px-3 py-1 rounded"
      >
        Cancel
      </button>
    </div>
  );
}
