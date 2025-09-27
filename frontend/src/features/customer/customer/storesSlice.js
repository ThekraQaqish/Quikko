import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerAPI from "./services/customerAPI";

// ===== Thunks =====
export const fetchStores = createAsyncThunk(
  "stores/fetchStores",
  async () => {
    const stores = await customerAPI.getStores();
    return stores; // تأكد أن API ترجع array من المتاجر
  }
);

export const fetchStoreById = createAsyncThunk(
  "stores/fetchStoreById",
  async (id) => {
    const response = await customerAPI.getStoreById(id);
    return response; // متجر واحد
  }
);
export const fetchStoreProducts = createAsyncThunk(
  "stores/fetchStoreProducts",
  async (storeId) => {
    const products = await customerAPI.getStoreProducts(storeId);
    return products; // array المنتجات
  }
);

// ===== Slice =====
const storesSlice = createSlice({
  name: "stores",
  initialState: {
    allStores: [],
    selectedStore: null,
    storeProducts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false;
        // هنا نفلتر فقط المتاجر approved
        state.allStores = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchStoreById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStoreById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStore = action.payload;
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
       // منتجات المتجر
      .addCase(fetchStoreProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStoreProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.storeProducts = action.payload;
      })
      .addCase(fetchStoreProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default storesSlice.reducer;
