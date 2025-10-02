import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllCMS, AddCMS, EditCMS, DeleteCMS } from "./cmsApi";

//  Get All CMS
export const allCMS = createAsyncThunk("cms/allCMS", async (_, thunkAPI) => {
  try {
    const types = ["customer", "vendor", "delivery", "user"];
    let allItems = [];

    for (const type of types) {
      const result = await GetAllCMS("active", type, "Landing Page");
      allItems = [...allItems, ...result];
    }

    return allItems;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

//  Add CMS
export const addCMS = createAsyncThunk(
  "cms/addCMS",
  async (cmsData, thunkAPI) => {
    try {
      const result = await AddCMS(cmsData);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

//  Edit CMS
export const editCMS = createAsyncThunk(
  "cms/editCMS",
  async ({ id, cmsData }, thunkAPI) => {
    try {
      const result = await EditCMS(id, cmsData);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

//  Delete CMS
export const deleteCMS = createAsyncThunk(
  "cms/deleteCMS",
  async (id, thunkAPI) => {
    try {
      await DeleteCMS(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Slice
const cmsSlice = createSlice({
  name: "cms",
  initialState: {
    cmsList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(allCMS.fulfilled, (state, action) => {
      state.loading = false;
      state.cmsList = action.payload;
    });

    // Add
    builder
      .addCase(addCMS.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCMS.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.cmsList.push(action.payload);
      })
      .addCase(addCMS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Edit
    builder
      .addCase(editCMS.fulfilled, (state, action) => {
        const { id, cmsData } = action.payload;
        if (state.cmsList[id]) {
          state.cmsList[id] = cmsData;
        }
      })
      .addCase(editCMS.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Delete
    builder
      .addCase(deleteCMS.fulfilled, (state, action) => {
        const index = action.payload;
        state.cmsList.splice(index, 1);
      })
      .addCase(deleteCMS.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cmsSlice.reducer;
