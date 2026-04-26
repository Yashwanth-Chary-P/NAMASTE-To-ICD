import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

const ALLOWED_SYSTEMS = ["ayurveda", "siddha", "unani", "tm2", "icd11"];
const ALLOWED_TARGETS = ["tm2", "icd11", "both"];

/**
 * 🔥 MAP THUNK
 * POST /map
 */
export const mapData = createAsyncThunk(
  "map/mapData",
  async (
    { source_system, code, target = "both", top_k = 5 },
    { rejectWithValue }
  ) => {
    try {
      const system = source_system?.trim().toLowerCase();
      const cleanCode = code?.trim();

      // ✅ VALIDATION
      if (!system || !cleanCode) {
        return rejectWithValue("source_system and code are required");
      }

      if (!ALLOWED_SYSTEMS.includes(system)) {
        return rejectWithValue("Invalid source system");
      }

      if (!ALLOWED_TARGETS.includes(target)) {
        return rejectWithValue("Invalid target system");
      }

      const payload = {
        source_system: system,
        code: cleanCode,
        target,
        top_k: Number(top_k) || 5,
      };

      const res = await api.post("/map", payload);

      const data = res.data || {};

      // 🔥 FLEXIBLE RESPONSE HANDLING
      return {
        source: data.source || data.query || null,

        tm2:
          data.tm2 ||
          data.tm2_results ||
          data.results?.tm2 ||
          [],

        icd11:
          data.icd11 ||
          data.icd_results ||
          data.results?.icd11 ||
          [],

        raw: data, // 🔥 keep full response for debugging
      };

    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Mapping API failed";

      return rejectWithValue(message);
    }
  }
);

/**
 * 🧠 SLICE
 */
const mapSlice = createSlice({
  name: "map",
  initialState: {
    source: null,
    tm2: [],
    icd11: [],
    raw: null,        // 🔥 full ML response
    cache: {},        // 🔥 caching
    loading: false,
    error: null,
  },

  reducers: {
    clearMap: (state) => {
      state.source = null;
      state.tm2 = [];
      state.icd11 = [];
      state.raw = null;
      state.loading = false;
      state.error = null;
    },

    clearMapCache: (state) => {
      state.cache = {};
    }
  },

  extraReducers: (builder) => {
    builder

      // ======================
      // PENDING
      // ======================
      .addCase(mapData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ======================
      // SUCCESS
      // ======================
      .addCase(mapData.fulfilled, (state, action) => {
        state.loading = false;

        const { source, tm2, icd11, raw } = action.payload;

        state.source = source;
        state.tm2 = tm2;
        state.icd11 = icd11;
        state.raw = raw;

        // 🔥 CACHE KEY
        const key = `${source?.system || "unknown"}:${source?.code || "unknown"}`;

        state.cache[key] = {
          tm2,
          icd11,
          raw,
        };
      })

      // ======================
      // ERROR
      // ======================
      .addCase(mapData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearMap, clearMapCache } = mapSlice.actions;
export default mapSlice.reducer;