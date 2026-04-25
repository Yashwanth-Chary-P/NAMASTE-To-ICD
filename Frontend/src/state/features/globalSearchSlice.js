import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

/**
 * ASYNC THUNK
 * Global search across all systems
 */
export const globalSearch = createAsyncThunk(
  "search/globalSearch",
  async ({ q, limit = 5, offset = 0 }, { rejectWithValue }) => {
    try {
      const cleanQuery = q.trim();

      console.log(
        `Fetching: /search?q=${cleanQuery}&limit=${limit}&offset=${offset}`
      );

      const response = await api.get("/search", {
        params: {
          q: cleanQuery,
          limit,
          offset,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Global Search Error:", error.response || error);

      return rejectWithValue(
        error.response?.data || {
          message: "Internal Server Error",
        }
      );
    }
  }
);

/**
 * SLICE
 */
const globalSearchSlice = createSlice({
  name: "globalSearch",
  initialState: {
    data: {},         // 🔥 full grouped response
    loading: false,
    error: null,
  },
  reducers: {
    clearGlobalSearch: (state) => {
      state.data = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(globalSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(globalSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // 🔥 IMPORTANT: store full object
      })
      .addCase(globalSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGlobalSearch } = globalSearchSlice.actions;
export default globalSearchSlice.reducer;