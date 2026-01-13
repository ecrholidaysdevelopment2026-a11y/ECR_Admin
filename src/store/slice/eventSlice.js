import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createEvent = createAsyncThunk(
  "event/create",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: "/admin/event/create",
        method: "POST",
        body: payload,
        token,
      });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to create event");
    }
  }
);

export const getAllEvents = createAsyncThunk(
  "event/getAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: "/admin/event/get",
        method: "GET",
        token,
      });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch events");
    }
  }
);

export const getEventById = createAsyncThunk(
  "event/getById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: `/admin/event/getById/${id}`,
        method: "GET",
        token,
      });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch event");
    }
  }
);

export const updateEvent = createAsyncThunk(
  "event/update",
  async ({ id, payload }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: `/admin/event/update/${id}`,
        method: "PUT",
        body: payload,
        token,
      });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to update event");
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "event/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: `/admin/event/delete/${id}`,
        method: "DELETE",
        token,
      });
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to delete event");
    }
  }
);

export const getEventsByCategory = createAsyncThunk(
  "event/byCategory",
  async (categoryId, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: `/admin/event/byCategory/${categoryId}`,
        method: "GET",
        token,
      });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch events by category"
      );
    }
  }
);

export const deleteEventImage = createAsyncThunk(
  "event/deleteImage",
  async (eventId, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: `/admin/event/image/${eventId}`,
        method: "DELETE",
        token,
      });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete event image"
      );
    }
  }
);

const eventSlice = createSlice({
  name: "event",
  initialState: {
    events: [],
    categoryEvents: [],
    selectedEvent: null,
    loading: false,
    deleteLoading: false,
    error: null,
    message: null,
    deleteEventMessage: null,
    deleteEventError: null,
  },
  reducers: {
    clearEventMessage(state) {
      state.message = null;
      state.deleteEventMessage = null;
    },
    clearEventError(state) {
      state.error = null;
      state.deleteEventError = null;
    },
    clearSelectedEvent(state) {
      state.selectedEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Event created successfully";
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getEventById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Event updated successfully";
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteEvent.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteEventMessage =
          action.payload?.message || "Event deleted successfully";
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteEventError = action.payload;
      })

      .addCase(getEventsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEventsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryEvents = action.payload;
      })
      .addCase(getEventsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteEventImage.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Event image deleted successfully";
      });
  },
});

export const { clearEventMessage, clearEventError, clearSelectedEvent } =
  eventSlice.actions;

export default eventSlice.reducer;
