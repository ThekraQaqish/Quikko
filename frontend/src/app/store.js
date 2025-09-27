import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/delivery/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
