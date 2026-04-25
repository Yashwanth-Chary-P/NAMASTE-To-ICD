import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

/**
 * ASYNC THUNK
 * Calls POST /map
 */
export const mapData = createAsyncThunk(
  "map/mapData",
  async (
    { source_system, code, target = "both", top_k = 5 },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        source_system: source_system.trim().toLowerCase(),
        code: code.trim(),
        target,
        top_k,
      };

      console.log("Mapping request:", payload);

      const response = await api.post("/map", payload);

      return response.data;
    } catch (error) {
      console.error("Map API Error:", error.response || error);

      return rejectWithValue(
        error.response?.data || {
          message: "Mapping API failed",
        }
      );
    }
  }
);

/**
 * SLICE
 */
const mapSlice = createSlice({
  name: "map",
  initialState: {
    source: null,     // 🔥 source object
    tm2: [],          // 🔥 TM2 mappings
    icd11: [],        // 🔥 ICD mappings
    loading: false,
    error: null,
  },
  reducers: {
    clearMap: (state) => {
      state.source = null;
      state.tm2 = [];
      state.icd11 = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(mapData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mapData.fulfilled, (state, action) => {
        state.loading = false;

        // 🔥 important: match backend response
        state.source = action.payload.source || null;
        state.tm2 = action.payload.tm2 || [];
        state.icd11 = action.payload.icd11 || [];
      })
      .addCase(mapData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMap } = mapSlice.actions;
export default mapSlice.reducer;