import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

/**
 * ASYNC THUNK
 * POST /fhir/store
 */
export const storeMapping = createAsyncThunk(
  "fhir/storeMapping",
  async (
    {
      source_system,
      target_system,
      source_doc,
      target_doc,
      tag = "Equivalent",
      score = 0,
    },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        source_system,
        target_system,
        source_doc,
        target_doc,
        tag,
        score,
      };

      console.log("FHIR STORE REQUEST:", payload);

      const response = await api.post("/fhir/store", payload);

      return response.data;
    } catch (error) {
      console.error("FHIR STORE ERROR:", error.response || error);

      return rejectWithValue(
        error.response?.data || {
          message: "FHIR store failed",
        }
      );
    }
  }
);

/**
 * SLICE
 */
const fhirSlice = createSlice({
  name: "fhir",
  initialState: {
    message: null,
    mappingKey: null,
    record: null,     // 🔥 full FHIR ConceptMap
    loading: false,
    error: null,
  },
  reducers: {
    clearFhir: (state) => {
      state.message = null;
      state.mappingKey = null;
      state.record = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(storeMapping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(storeMapping.fulfilled, (state, action) => {
        state.loading = false;

        // 🔥 match your backend response
        state.message = action.payload.message;
        state.mappingKey = action.payload.mappingKey;
        state.record = action.payload.record;
      })
      .addCase(storeMapping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFhir } = fhirSlice.actions;
export default fhirSlice.reducer;