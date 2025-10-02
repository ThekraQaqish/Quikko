import { configureStore } from "@reduxjs/toolkit";
import vendorsReducer from "./vendor/vendorSlice";
import deliveriesReducer from "./delivery/deliverySlice";
import ordersReducer from "./orders/orderSlice";
import cmsReducer from "./CMS/cmsSlice";
import notificationsReducer from "./CMS/notification/notificationSlice";
import categoryReducer from "./CMS/categories/categorySlice";

const store = configureStore({
  reducer: {
    vendors: vendorsReducer,
    deliveries: deliveriesReducer,
    orders: ordersReducer,
    cms: cmsReducer,
    notifications: notificationsReducer,
    categories: categoryReducer,
  },
});

export default store;