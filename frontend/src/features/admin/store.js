import { configureStore } from "@reduxjs/toolkit";
import vendorsReducer from "./vendor/vendorSlice";
import deliveriesReducer from "./delivery/deliverySlice";
import ordersReducer from "./orders/orderSlice";

const store = configureStore({
  reducer: {
    vendors: vendorsReducer,
    deliveries: deliveriesReducer,
    orders: ordersReducer,
  },
});

export default store;