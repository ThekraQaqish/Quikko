import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerAPI from "./services/customerAPI";

// ==== Thunks ====

// Fetch all carts
export const fetchAllCarts = createAsyncThunk(
  "cart/fetchAllCarts",
  async () => {
    const carts = await customerAPI.getCart();
    return carts; 
  }
);

// Fetch single cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (id) => {
    return await customerAPI.getCartById(id);
  }
);

// Delete item from cart
export const deleteItem = createAsyncThunk(
  "cart/deleteItem",
  async ({ cartId, itemId }, { dispatch }) => {
    await customerAPI.deleteItem({ cartId, itemId });
    dispatch(fetchCart(cartId));
    return itemId;
  }
);

// Delete entire cart
export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async (cartId, { dispatch }) => {
    await customerAPI.deleteCart(cartId);
    dispatch(fetchAllCarts());
    return cartId;
  }
);

// Create new cart
export const createNewCart = createAsyncThunk(
  "cart/createNewCart",
  async (_, { dispatch }) => {
    const newCart = await customerAPI.createCart(); // بدون userId
    dispatch(fetchAllCarts());
    return newCart;
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getProfile();
      return response; // { id, name, email, ... }
    } catch (err) {
      console.log(err);
      return rejectWithValue("Failed to fetch current user");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    allCarts: [],
    currentCart: null,
    user: null, 
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAllCarts
      .addCase(fetchAllCarts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCarts.fulfilled, (state, action) => {
        state.allCarts = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
        state.status = "succeeded";
      })
      .addCase(fetchAllCarts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.currentCart = null; // optional

      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.currentCart = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload; // هنا يتم تحديث user
      state.status = "succeeded";
    })
    .addCase(fetchCurrentUser.rejected, (state, action) => {
      state.user = null;
      state.status = "failed";
      state.error = action.payload || action.error.message;
    });
  },
});

export default cartSlice.reducer;
