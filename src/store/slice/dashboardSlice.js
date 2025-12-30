import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getDashboardStats = createAsyncThunk(
  "dashboard/getStats",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/dashboard/get-dashboard-stats",
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null, 
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearDashboardMessage(state) {
      state.message = null;
    },
    clearDashboardError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.message = action.payload?.message || null;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardMessage, clearDashboardError } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
