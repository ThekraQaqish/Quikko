// src/pages/vendor/product/ProductForm.jsx
import React, { useState, useEffect } from "react";

export default function ProductForm({ initialData, categories, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    images: "",
    category_id: "",
    variants: "",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    // إعادة تعيين فقط إذا لم يكن تعديل
    if (!initialData?.id) {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        images: "",
        category_id: "",
        variants: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border p-2" required />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2" required />
      <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="border p-2" required />
      <input type="number" name="stock_quantity" placeholder="Stock Quantity" value={formData.stock_quantity} onChange={handleChange} className="border p-2" required />
      <input type="text" name="images" placeholder="Image URLs (comma separated)" value={formData.images} onChange={handleChange} className="border p-2" />
      <select name="category_id" value={formData.category_id} onChange={handleChange} className="border p-2">
        <option value="">Select Category</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input type="text" name="variants" placeholder='Variants (JSON string, e.g. {"size":"M"})' value={formData.variants} onChange={handleChange} className="border p-2" />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        {initialData?.id ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}

