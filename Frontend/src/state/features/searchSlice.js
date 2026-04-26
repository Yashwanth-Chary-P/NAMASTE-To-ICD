import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

const ALLOWED_SYSTEMS = ["ayurveda", "siddha", "unani", "tm2", "icd11"];

export const searchData = createAsyncThunk(
  "search/searchData",
  async ({ system = null, q, limit = 5, offset = 0 }, { rejectWithValue }) => {
    try {
      // FIX: Check if q exists before calling .trim()
      const query = q ? String(q).trim() : "";
      if (!query) return rejectWithValue("Query is required");

      let res;
      if (system) {
        const cleanSystem = system.trim().toLowerCase();
        if (!ALLOWED_SYSTEMS.includes(cleanSystem)) return rejectWithValue("Invalid system");
        res = await api.get(`/search/${cleanSystem}`, { params: { q: query, limit, offset } });
        return { type: "single", ...res.data };
      } else {
        res = await api.get(`/search`, { params: { q: query, limit, offset } });
        return { type: "global", query, data: res.data };
      }
    } catch (error) {
      // FIX: Always return a STRING, never an object
      return rejectWithValue(error?.response?.data?.message || error?.message || "Search failed");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    mode: "single",
    results: [],
    global: { ayurveda: [], siddha: [], unani: [] },
    loading: false,
    error: null,
    has_more: false,
    offset: 0,
    system: null,
    query: ""
  },
  reducers: {
    clearSearch: (state) => {
      state.results = [];
      state.global = { ayurveda: [], siddha: [], unani: [] };
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchData.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(searchData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.type === "single") {
          state.mode = "single";
          state.results = action.payload.offset > 0 ? [...state.results, ...action.payload.results] : action.payload.results;
          state.has_more = action.payload.has_more;
          state.offset = action.payload.offset;
          state.system = action.payload.system;
        } else {
          state.mode = "global";
          const d = action.payload.data;
          state.global = {
            ayurveda: d?.ayurveda?.results || [],
            siddha: d?.siddha?.results || [],
            unani: d?.unani?.results || []
          };
        }
      })
      .addCase(searchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // This is now guaranteed to be a string
      });
  }
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;