import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerDeliveryAPI, loginAPI } from "./AuthAPI";

// ===== Async thunk للتسجيل
export const registerDelivery = createAsyncThunk(
  "auth/registerDelivery",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await registerDeliveryAPI(formData);
      return response; // عادة user + token
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ===== Async thunk لتسجيل الدخول
export const loginDelivery = createAsyncThunk(
  "auth/loginDelivery",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await loginAPI(formData);
      return response; // عادة user + token
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ===== الحالة الأولية
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  successMessage: null,
};

// ===== إنشاء slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setUserFromToken: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    // === Register
    builder
      .addCase(registerDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.successMessage = "✅ Delivery registered successfully!";
      })
      .addCase(registerDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = "❌ " + action.payload;
      });

    // === Login
    builder
      .addCase(loginDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.successMessage = "✅ Login successful!";

        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = "❌ " + action.payload;
      });
  },
});

export const { clearMessages, setUserFromToken } = authSlice.actions;
export default authSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { registerDeliveryAPI, loginAPI } from "./AuthAPI";
// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../../../app/firebase";
// // ===== Async thunk للتسجيل
// export const registerDelivery = createAsyncThunk(
//   "auth/registerDelivery",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await registerDeliveryAPI(formData);
//       return response; // عادة user + token
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// // ===== Async thunk لتسجيل الدخول
// export const loginDelivery = createAsyncThunk(
//   "auth/loginDelivery",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await loginAPI(formData);
//       return response; // عادة user + token
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// export const loginWithGoogle = createAsyncThunk(
//   "auth/loginWithGoogle",
//   async (_, { rejectWithValue }) => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;
//       const token = await user.getIdToken();

//       // ⚡ ترجع object يحتوي على user + token
//       return {
//         user: {
//           uid: user.uid,
//           email: user.email,
//           displayName: user.displayName,
//         },
//         token,
//       };
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// // ===== الحالة الأولية
// const initialState = {
//   user: null,
//   token: null,
//   loading: false,
//   error: null,
//   successMessage: null,
// };

// // ===== إنشاء slice
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     clearMessages: (state) => {
//       state.error = null;
//       state.successMessage = null;
//     },
//     setUserFromToken: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//     },
//   },
//   extraReducers: (builder) => {
//     // === Register
//     builder
//       .addCase(registerDelivery.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(registerDelivery.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.successMessage = "✅ Delivery registered successfully!";
//       })
//       .addCase(registerDelivery.rejected, (state, action) => {
//         state.loading = false;
//         state.error = "❌ " + action.payload;
//       });

//     // === Login
//     builder
//       .addCase(loginDelivery.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(loginDelivery.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.successMessage = "✅ Login successful!";

//         localStorage.setItem("token", action.payload.token);
//       })
//       .addCase(loginDelivery.rejected, (state, action) => {
//         state.loading = false;
//         state.error = "❌ " + action.payload;
//       })
//       .addCase(loginWithGoogle.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(loginWithGoogle.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.successMessage = "✅ Login with Google successful!";
//         localStorage.setItem("token", action.payload.token);
//       })
//       .addCase(loginWithGoogle.rejected, (state, action) => {
//         state.loading = false;
//         state.error = "❌ " + action.payload;
//       });
//   },
// });

// export const { clearMessages, setUserFromToken } = authSlice.actions;
// export default authSlice.reducer;
