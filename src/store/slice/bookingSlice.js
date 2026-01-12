import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createBooking = createAsyncThunk(
  "booking/create",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/booking/create",
        method: "POST",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create booking"
      );
    }
  }
);

export const getAllBookings = createAsyncThunk(
  "booking/getAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/booking",
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch bookings"
      );
    }
  }
);

export const getBookingById = createAsyncThunk(
  "booking/getById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/booking/${id}`,
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch booking");
    }
  }
);

export const updateBooking = createAsyncThunk(
  "booking/update",
  async ({ id, payload }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/booking/update/${id}`,
        method: "PATCH",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update booking"
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/booking/cancel/${id}`,
        method: "PATCH",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to cancel booking"
      );
    }
  }
);

export const updateBookingPayment = createAsyncThunk(
  "booking/updatePayment",
  async ({ id, payload }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/booking/payment/${id}`,
        method: "PATCH",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update booking payment"
      );
    }
  }
);
export const verifyPayment = createAsyncThunk(
  "booking/verifyPayment",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/booking/verify-payment`,
        method: "POST",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update booking payment"
      );
    }
  }
);

export const getDailyBookingSummary = createAsyncThunk(
  "booking/getDailySummary",
  async ({ date }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/booking/daily-summary?date=${date}`,
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch daily booking summary"
      );
    }
  }
);

export const getBookedDates = createAsyncThunk(
  "booking/getBookedDates",
  async (params = {}, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/booking/booked-dates",
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch booked dates"
      );
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    bookingData: {},
    dailySummary: [],
    bookedDates: [],
    selectedBooking: null,
    loading: false,
    cancelLoading: false,
    createBookingMsg: null,
    createBookingError: null,
    error: null,
    message: null,
    cancelMessage: null,
    cancelError: null,
  },
  reducers: {
    clearBookingMessage(state) {
      state.message = null;
      state.cancelMessage = null;
      state.createBookingMsg = null;
    },
    clearBookingError(state) {
      state.error = null;
      state.cancelError = null;
      state.createBookingError = null;
    },
    clearSelectedBooking(state) {
      state.selectedBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.createBookingMsg =
          action.payload?.message || "Booking created successfully";
        state.bookingData = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.createBookingError = action.payload;
      })

      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBooking = action.payload;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Booking updated successfully";
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelBooking.pending, (state) => {
        state.cancelLoading = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.cancelLoading = false;
        state.cancelMessage =
          action.payload?.message || "Booking canceled successfully";
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.cancelLoading = false;
        state.cancelError = action.payload;
      })

      .addCase(updateBookingPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBookingPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Booking payment updated successfully";
      })
      .addCase(updateBookingPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Booking payment updated successfully";
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDailyBookingSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDailyBookingSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.dailySummary = action.payload;
      })
      .addCase(getDailyBookingSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getBookedDates.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBookedDates.fulfilled, (state, action) => {
        state.loading = false;
        state.bookedDates = action.payload;
      })
      .addCase(getBookedDates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingMessage, clearBookingError, clearSelectedBooking } =
  bookingSlice.actions;

export default bookingSlice.reducer;
