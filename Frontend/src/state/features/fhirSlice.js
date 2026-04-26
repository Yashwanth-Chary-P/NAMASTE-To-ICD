import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

/**
 * 🔥 STORE FHIR MAPPING
 * POST /fhir/store
 */
export const storeMapping = createAsyncThunk(
  "fhir/storeMapping",
  async (data, { rejectWithValue }) => {
    try {
      const payload = {
        source_system: data.source_system?.toLowerCase(),
        target_system: data.target_system?.toLowerCase(),
        source_doc: data.source_doc,
        target_doc: data.target_doc,
        tag: data.tag || "Equivalent",
        score: data.score || 0,
        confidence: data.confidence || "high",
        match_reason: data.match_reason || "User selected mapping",
      };

      const res = await api.post("/fhir/store", payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "FHIR store failed"
      );
    }
  }
);

/**
 * 🔥 FETCH HISTORY
 * GET /fhir/history
 */
export const fetchFhirHistory = createAsyncThunk(
  "fhir/fetchHistory",
  async ({ limit = 20, offset = 0 }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/fhir/history?limit=${limit}&offset=${offset}`
      );
      return res.data.results;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch history"
      );
    }
  }
);

/**
 * 🔥 FETCH SINGLE RECORD
 * GET /fhir/:mappingKey
 */
export const fetchFhirByKey = createAsyncThunk(
  "fhir/fetchByKey",
  async (mappingKey, { rejectWithValue }) => {
    try {
      const res = await api.get(`/fhir/${mappingKey}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch record"
      );
    }
  }
);

/**
 * 🧠 SLICE
 */
const fhirSlice = createSlice({
  name: "fhir",
  initialState: {
    message: null,
    mappingKey: null,
    record: null,

    history: [],   // 🔥 added
    loading: false,
    error: null,
  },
  reducers: {
    clearFhir: (state) => {
      state.message = null;
      state.mappingKey = null;
      state.record = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ======================
      // STORE
      // ======================
      .addCase(storeMapping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(storeMapping.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.mappingKey = action.payload.mappingKey;
        state.record = action.payload.record;
      })
      .addCase(storeMapping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // HISTORY
      // ======================
      .addCase(fetchFhirHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFhirHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchFhirHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // GET BY KEY
      // ======================
      .addCase(fetchFhirByKey.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFhirByKey.fulfilled, (state, action) => {
        state.loading = false;
        state.record = action.payload;
      })
      .addCase(fetchFhirByKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFhir } = fhirSlice.actions;
export default fhirSlice.reducer;