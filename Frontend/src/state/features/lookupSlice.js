import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

const ALLOWED_SYSTEMS = ["ayurveda", "siddha", "unani", "tm2", "icd11"];

/**
 * 🔍 LOOKUP BY CODE
 * GET /lookup/:system/:code
 */
export const getLookupData = createAsyncThunk(
  "lookup/getLookupData",
  async ({ system, code }, { rejectWithValue }) => {
    try {
      const cleanSystem = system?.trim().toLowerCase();
      const cleanCode = code?.trim();

      // 🔥 validation
      if (!cleanSystem || !cleanCode) {
        return rejectWithValue("System and code are required");
      }

      if (!ALLOWED_SYSTEMS.includes(cleanSystem)) {
        return rejectWithValue("Invalid system selected");
      }

      const res = await api.get(`/lookup/${cleanSystem}/${cleanCode}`);

      return {
        system: cleanSystem,
        code: cleanCode,
        data: res.data
      };

    } catch (error) {
      const message =
        error?.response?.data?.error ||   // backend error
        error?.response?.data?.message || // fallback
        "Lookup failed";

      return rejectWithValue(message);
    }
  }
);

/**
 * 🧠 SLICE
 */
const lookupSlice = createSlice({
  name: "lookup",
  initialState: {
    current: null,     // 🔥 latest result
    history: {},       // 🔥 cache by key
    loading: false,
    error: null,
  },
  reducers: {
    clearLookup: (state) => {
      state.current = null;
      state.error = null;
      state.loading = false;
    },

    clearLookupHistory: (state) => {
      state.history = {};
    }
  },
  extraReducers: (builder) => {
    builder

      // ======================
      // PENDING
      // ======================
      .addCase(getLookupData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ======================
      // SUCCESS
      // ======================
      .addCase(getLookupData.fulfilled, (state, action) => {
        state.loading = false;

        const key = `${action.payload.system}:${action.payload.code}`;

        state.current = action.payload.data;

        // 🔥 cache result
        state.history[key] = action.payload.data;
      })

      // ======================
      // ERROR
      // ======================
      .addCase(getLookupData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearLookup, clearLookupHistory } = lookupSlice.actions;
export default lookupSlice.reducer;