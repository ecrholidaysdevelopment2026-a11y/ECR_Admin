import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createExtraService = createAsyncThunk(
  "extraService/create",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/extra-service",
        method: "POST",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create service"
      );
    }
  }
);

export const getAllExtraServices = createAsyncThunk(
  "extraService/getAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/extra-service",
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch services"
      );
    }
  }
);

export const getExtraServiceById = createAsyncThunk(
  "extraService/getById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/extra-service/${id}`,
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch service");
    }
  }
);

export const updateExtraService = createAsyncThunk(
  "extraService/update",
  async ({ code, payload }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/extra-service/${code}`,
        method: "PATCH",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update service"
      );
    }
  }
);

export const deleteExtraService = createAsyncThunk(
  "extraService/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/extra-service/${id}`,
        method: "DELETE",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete service"
      );
    }
  }
);

const extraServiceSlice = createSlice({
  name: "extraService",
  initialState: {
    services: [],
    selectedService: null,
    loading: false,
    deleteLoading: false,
    error: null,
    message: null,
    deleteMessage: null,
  },
  reducers: {
    clearExtraServiceMessage(state) {
      state.message = null;
      state.deleteMessage = null;
    },
    clearExtraServiceError(state) {
      state.error = null;
    },
    clearSelectedService(state) {
      state.selectedService = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createExtraService.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExtraService.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Service created successfully";
      })
      .addCase(createExtraService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllExtraServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllExtraServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(getAllExtraServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getExtraServiceById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getExtraServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedService = action.payload;
      })
      .addCase(getExtraServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateExtraService.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExtraService.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Service updated successfully";
      })
      .addCase(updateExtraService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteExtraService.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteExtraService.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteMessage =
          action.payload?.message || "Service deleted successfully";
      })
      .addCase(deleteExtraService.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearExtraServiceMessage,
  clearExtraServiceError,
  clearSelectedService,
} = extraServiceSlice.actions;

export default extraServiceSlice.reducer;
