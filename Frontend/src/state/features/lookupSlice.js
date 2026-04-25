import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

/**
 * ASYNC THUNK
 * Fetches data from the backend lookup endpoint.
 */
export const getLookupData = createAsyncThunk(
  "lookup/getLookupData",
  async ({ system, code }, { rejectWithValue }) => {
    try {
      // Ensure strings are trimmed to avoid URL encoding issues with spaces
      const cleanSystem = system.trim().toLowerCase();
      const cleanCode = code.trim();

      // Log the attempt to check the URL structure in your console
      console.log(`Fetching: /lookup/${cleanSystem}/${cleanCode}`);

      const response = await api.get(`/lookup/${cleanSystem}/${cleanCode}`);
      return response.data;
    } catch (error) {
      console.error("Lookup API Error:", error.response || error);
      
      // Return the specific error from backend or a fallback message
      return rejectWithValue(
        error.response?.data || { message: "Internal Server Connection Error" }
      );
    }
  }
);

const lookupSlice = createSlice({
  name: "lookup",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearLookup: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLookupData.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Optional: clear old data when a new search starts
        state.data = null; 
      })
      .addCase(getLookupData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getLookupData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLookup } = lookupSlice.actions;
export default lookupSlice.reducer;