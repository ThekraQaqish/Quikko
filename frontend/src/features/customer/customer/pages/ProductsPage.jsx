import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../productsSlice";
import { fetchCart } from "../cartSlice";
import { fetchCategories, toggleCategory } from "../categoriesSlice";
import CategoryList from "../components/CategoryList";
import ProductCard from "../components/ProductCard";
import customerAPI from "../services/customerAPI";
const ProductsPage = () => {
  const dispatch = useDispatch();

  const { items: products = [], status, error, searchQuery } = useSelector(
    (state) => state.products
  );
  const { items: categories = [], selectedCategories = [] } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCart());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddToCart = async (product, quantity = 1) => {
  try {
    const cartResponse = await customerAPI.getOrCreateCart();
    const cartId = cartResponse?.id || cartResponse?.data?.id;

    if (!cartId) {
      console.error("No cart ID found!");
      return;
    }

    console.log("Adding to cart:", cartId, product.id);

    const res = await customerAPI.addItem({
      cartId,
      product,
      quantity,
      variant: product.variant || {},
    });

    console.log("Added to cart:", res);
    dispatch(fetchCart());
  } catch (err) {
    console.error("Failed to add item:", err.response?.data || err.message);
  }
};



  const handleToggleCategory = (category) => {
    dispatch(toggleCategory(category));
  };

  // فلترة المنتجات حسب الكاتيجوريز و search query
  const filteredProducts = products
    .filter((p) =>
      selectedCategories.length === 0
        ? true
        : selectedCategories.some((c) => c.id === p.category_id)
    )
    .filter((p) =>
      searchQuery ? p.name.toLowerCase().includes(searchQuery) : true
    );

  if (status === "loading") {
    return (
      <p className="text-center mt-10 text-gray-500 animate-pulse">
        Loading products...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        Error loading products: {error}
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Our Products {searchQuery && `(Results for "${searchQuery}")`}
      </h1>

      <CategoryList
        categories={categories}
        selectedCategories={selectedCategories}
        onToggle={handleToggleCategory}
      />

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
