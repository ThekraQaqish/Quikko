import { configureStore } from "@reduxjs/toolkit";
import customerAuthReducer from "../features/customer/auth/CustomerAuthSlice";
import productsReducer from "../features/customer/customer/productsSlice";
import cartReducer from "../features/customer/customer/cartSlice";
import ordersReducer from "../features/customer/customer/ordersSlice";
import profileReducer from "../features/customer/customer/profileSlice"; 
import categoriesReducer from "../features/customer/customer/categoriesSlice";
import storesReducer from "../features/customer/customer/storesSlice";
import reviewsReducer from "../features/customer/review/reviewSlice";

const store = configureStore({
  reducer: {
    customerAuth: customerAuthReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    profile: profileReducer,
    categories: categoriesReducer,
    stores: storesReducer, 
    reviews: reviewsReducer,
  },
});

export default store;

