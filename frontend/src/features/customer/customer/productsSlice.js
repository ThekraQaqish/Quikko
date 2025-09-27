import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerAPI from "./services/customerAPI";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ categoryId } = {}) => {
    const params = {};
    if (categoryId) params.categoryId = categoryId;
    const products = await customerAPI.getProducts(params);
    return products;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [], 
    status: "idle",
    error: null,
    searchQuery: "",
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload.toLowerCase();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload || []; 
        state.status = "succeeded";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { setSearchQuery } = productsSlice.actions;

export default productsSlice.reducer;
