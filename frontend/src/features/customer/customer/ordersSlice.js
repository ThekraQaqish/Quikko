// src/features/customer/customer/slices/ordersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerAPI from "../customer/services/customerAPI";

export const fetchOrders = createAsyncThunk("orders/fetchAll", async () => {
  return await customerAPI.getOrders();
});

export const fetchOrderById = createAsyncThunk("orders/fetchById", async (id) => {
  return await customerAPI.getOrderById(id);
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: { list: [], currentOrder: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.currentOrder = null;
        })

      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default ordersSlice.reducer;
