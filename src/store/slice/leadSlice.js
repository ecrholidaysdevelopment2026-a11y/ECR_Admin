import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getAdminLeads = createAsyncThunk(
  "adminLead/get",
  async (_, thunkAPI) => {
    try {
      const res = await FetchApi({
        endpoint: "/admin/leads/get",
        method: "GET",

      });

      if (res?.data?.success === false) {
        return thunkAPI.rejectWithValue(res?.data?.message);
      }

      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const adminLeadSlice = createSlice({
  name: "adminLead",
  initialState: {
    loading: false,
    success: false,
    leads: [],
    error: null,
  },
  reducers: {
    clearAdminLeadState(state) {
      state.loading = false;
      state.success = false;
      state.leads = [];
      state.error = null;
    },
    clearAdminLeadError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminLeads.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(getAdminLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || true;
        state.leads = action.payload.leads || action.payload;
      })
      .addCase(getAdminLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminLeadState, clearAdminLeadError } =
  adminLeadSlice.actions;

export default adminLeadSlice.reducer;
