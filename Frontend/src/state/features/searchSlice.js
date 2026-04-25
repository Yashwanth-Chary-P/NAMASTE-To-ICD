import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

/**
 * ASYNC THUNK
 * Fetches search results from backend
 */
export const searchData = createAsyncThunk(
  "search/searchData",
  async ({ system, q, limit = 5, offset = 0 }, { rejectWithValue }) => {
    try {
      // Clean inputs
      const cleanSystem = system.trim().toLowerCase();
      const cleanQuery = q.trim();

      // Debug log
      console.log(
        `Fetching: /search/${cleanSystem}?q=${cleanQuery}&limit=${limit}&offset=${offset}`
      );

      const response = await api.get(`/search/${cleanSystem}`, {
        params: {
          q: cleanQuery,
          limit,
          offset,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Search API Error:", error.response || error);

      return rejectWithValue(
        error.response?.data || {
          message: "Internal Server Connection Error",
        }
      );
    }
  }
);

/**
 * SLICE
 */
const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    loading: false,
    error: null,
    total: 0, // optional if backend returns count
  },
  reducers: {
    clearSearch: (state) => {
      state.results = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchData.fulfilled, (state, action) => {
        state.loading = false;

        // handle both array or object response safely
        if (Array.isArray(action.payload)) {
          state.results = action.payload;
        } else {
          state.results = action.payload.results || [];
          state.total = action.payload.total || 0;
        }
      })
      .addCase(searchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;