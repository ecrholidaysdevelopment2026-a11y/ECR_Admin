import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createLocation = createAsyncThunk(
  "location/create",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/location/create",
        method: "POST",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create location"
      );
    }
  }
);

export const getAllLocations = createAsyncThunk(
  "location/getAll",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/location",
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch locations"
      );
    }
  }
);

export const getLocationById = createAsyncThunk(
  "location/getById",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/location/${id}`,
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch location"
      );
    }
  }
);

export const updateLocation = createAsyncThunk(
  "location/update",
  async ({ id, payload }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/location/update/${id}`,
        method: "PATCH",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update location"
      );
    }
  }
);

export const deleteLocation = createAsyncThunk(
  "location/delete",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/location/delete/${id}`,
        method: "DELETE",
        token,
      });
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete location"
      );
    }
  }
);

export const getPopularLocations = createAsyncThunk(
  "location/getPopular",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/location/popular",
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch popular locations"
      );
    }
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState: {
    locations: [],
    popularLocations: [],
    selectedLocation: null,
    loading: false,
    deleteLoading: false,
    error: null,
    message: null,
    deleteLocationMessage: null,
    deleteLocationError: null,
    clearLocationError: null,
    clearLocationMessage: null,
  },
  reducers: {
    clearLocationMessage(state) {
      state.message = null;
      state.deleteLocationMessage = null;
      state.clearLocationMessage = null;
    },
    clearLocationError(state) {
      state.error = null;
      state.deleteLocationError = null;
      state.clearLocationError = null;
    },

    clearSelectedLocation(state) {
      state.selectedLocation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Location created successfully";
      })
      .addCase(createLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(getAllLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getLocationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLocationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLocation = action.payload;
      })
      .addCase(getLocationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Location updated successfully";
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteLocation.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteLocationMessage =
          action.payload?.message || "Location deleted successfully";
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteLocationError = action.payload;
      })

      .addCase(getPopularLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPopularLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.popularLocations = action.payload;
      })
      .addCase(getPopularLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearLocationMessage,
  clearLocationError,
  clearSelectedLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
