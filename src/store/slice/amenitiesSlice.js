import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createAmenity = createAsyncThunk(
  "amenities/create",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/amenities/create",
        method: "POST",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create amenity"
      );
    }
  }
);

export const getAllAmenities = createAsyncThunk(
  "amenities/getAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/amenities",
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch amenities"
      );
    }
  }
);

export const getAmenityById = createAsyncThunk(
  "amenities/getById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/amenities/${id}`,
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch amenity");
    }
  }
);

export const updateAmenity = createAsyncThunk(
  "amenities/update",
  async ({ id, payload }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/amenities/${id}`,
        method: "PATCH",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update amenity"
      );
    }
  }
);

export const deleteAmenity = createAsyncThunk(
  "amenities/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/amenities/${id}`,
        method: "DELETE",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete amenity"
      );
    }
  }
);

const amenitiesSlice = createSlice({
  name: "amenities",
  initialState: {
    amenities: [],
    selectedAmenity: null,
    loading: false,
    deleteLoading: false,
    error: null,
    message: null,
    deleteMessage: null,
  },
  reducers: {
    clearAmenityMessage(state) {
      state.message = null;
      state.deleteMessage = null;
    },
    clearAmenityError(state) {
      state.error = null;
    },
    clearSelectedAmenity(state) {
      state.selectedAmenity = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAmenity.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAmenity.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Amenity created successfully";
      })
      .addCase(createAmenity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllAmenities.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAmenities.fulfilled, (state, action) => {
        state.loading = false;
        state.amenities = action.payload;
      })
      .addCase(getAllAmenities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAmenityById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAmenityById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAmenity = action.payload;
      })
      .addCase(getAmenityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAmenity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAmenity.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Amenity updated successfully";
      })
      .addCase(updateAmenity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteAmenity.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteAmenity.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteMessage =
          action.payload?.message || "Amenity deleted successfully";
      })
      .addCase(deleteAmenity.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAmenityMessage, clearAmenityError, clearSelectedAmenity } =
  amenitiesSlice.actions;

export default amenitiesSlice.reducer;
