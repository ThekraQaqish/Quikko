import React, { useState, useEffect } from "react";
import { fetchProducts, addProduct, deleteProduct, fetchCategories, updateProduct } from "../VendorAPI";
import ProductForm from "./ProductForm";
import ProductEdit from "./ProductEdit";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => setProducts(await fetchProducts());
  const loadCategories = async () => setCategories(await fetchCategories());

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
      setEditingProduct(null);
    } else {
      await addProduct(formData);
    }
    loadProducts();
  };

  const handleEditClick = (product) => setEditingProduct(product);
  const handleCancelEdit = () => setEditingProduct(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      {/* قسم إضافة المنتج */}
      {!editingProduct && (
        <div className="mb-6 border p-4 rounded shadow">
          <h2 className="text-xl mb-2">Add New Product</h2>
          <ProductForm
            initialData={{}}
            categories={categories}
            onSubmit={handleFormSubmit}
          />
        </div>
      )}

      {/* قسم تعديل المنتج يظهر فقط عند التعديل */}
      {editingProduct && (
        <ProductEdit
          product={editingProduct}
          categories={categories}
          onUpdate={handleFormSubmit}
          onCancel={handleCancelEdit}
        />
      )}

      {/* جدول المنتجات */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(products || []).slice(0, visibleCount).map((p) => (
            <tr key={p.id} className="text-center">
              <td className="border p-2">
                {p.images && p.images.length > 0 ? (
                  <img src={p.images[0]} alt={p.name} className="w-12 h-12 mx-auto" />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.price}</td>
              <td className="border p-2">{p.stock_quantity}</td>
              <td className="border p-2 flex gap-2 justify-center">
                <button onClick={() => handleEditClick(p)} className="text-blue-500">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {visibleCount < products.length && (
        <button
          onClick={() => setVisibleCount(visibleCount + 5)}
          className="mt-4 bg-gray-200 p-2 rounded"
        >
          Show More
        </button>
      )}
    </div>
  );
}
