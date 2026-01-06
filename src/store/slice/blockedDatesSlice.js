import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createBlockedDate = createAsyncThunk(
  "blockedDates/create",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/blocked-dates/create",
        method: "POST",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create blocked date"
      );
    }
  }
);

export const getAllBlockedDates = createAsyncThunk(
  "blockedDates/getAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/blocked-dates/getAll",
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch blocked dates"
      );
    }
  }
);

export const updateBlockedDate = createAsyncThunk(
  "blockedDates/update",
  async ({ id, payload }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/blocked-dates/update/${id}`,
        method: "PATCH",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update blocked date"
      );
    }
  }
);

export const deleteBlockedDate = createAsyncThunk(
  "blockedDates/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/blocked-dates/delete/${id}`,
        method: "DELETE",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete blocked date"
      );
    }
  }
);

export const getBlockedDatesCalendar = createAsyncThunk(
  "blockedDates/calendar",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/blocked-dates/calendar",
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch calendar blocked dates"
      );
    }
  }
);

const blockedDatesSlice = createSlice({
  name: "blockedDates",
  initialState: {
    blockedDates: [],
    calendarBlockedDates: [],
    loading: false,
    deleteLoading: false,
    error: null,
    message: null,
    deleteMessage: null,
  },
  reducers: {
    clearBlockedDatesMessage(state) {
      state.message = null;
      state.deleteMessage = null;
    },
    clearBlockedDatesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBlockedDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlockedDate.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Blocked date created successfully";
      })
      .addCase(createBlockedDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllBlockedDates.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBlockedDates.fulfilled, (state, action) => {
        state.loading = false;
        state.blockedDates = action.payload;
      })
      .addCase(getAllBlockedDates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBlockedDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlockedDate.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Blocked date updated successfully";
      })
      .addCase(updateBlockedDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteBlockedDate.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteBlockedDate.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteMessage =
          action.payload?.message || "Blocked date deleted successfully";
      })
      .addCase(deleteBlockedDate.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })

      .addCase(getBlockedDatesCalendar.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlockedDatesCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.calendarBlockedDates = action.payload;
      })
      .addCase(getBlockedDatesCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBlockedDatesMessage, clearBlockedDatesError } =
  blockedDatesSlice.actions;

export default blockedDatesSlice.reducer;
