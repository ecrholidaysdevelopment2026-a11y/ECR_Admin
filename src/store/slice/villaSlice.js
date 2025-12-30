import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createVilla = createAsyncThunk(
  "villa/create",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/villa/create",
        method: "POST",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to create villa");
    }
  }
);

export const getAllVillas = createAsyncThunk(
  "villa/getAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/villa",
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch villas");
    }
  }
);

export const getVillaBySlug = createAsyncThunk(
  "villa/getBySlug",
  async (slug, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/villa/${slug}`,
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch villa");
    }
  }
);

export const updateVilla = createAsyncThunk(
  "villa/update",
  async ({ id, payload }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/villa/update/${id}`,
        method: "PATCH",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to update villa");
    }
  }
);

export const deleteVilla = createAsyncThunk(
  "villa/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/villa/delete/${id}`,
        method: "DELETE",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to delete villa");
    }
  }
);

export const getFeaturedVillas = createAsyncThunk(
  "villa/featured",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/villa/featured`,
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch featured villas"
      );
    }
  }
);

export const getPopularVillas = createAsyncThunk(
  "villa/popular",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/villa/popular`,
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch popular villas"
      );
    }
  }
);

export const searchVillas = createAsyncThunk(
  "villas/search",
  async (params, thunkAPI) => {
    try {
      const queryString = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
      const response = await FetchApi({
        endpoint: `/user/villas/search${queryString}`,
        method: "GET",
      });

      if (response?.data?.success === false) {
        return thunkAPI.rejectWithValue(response?.data?.data?.message);
      }
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to search villas");
    }
  }
);

const villaSlice = createSlice({
  name: "villa",
  initialState: {
    villas: [],
    searchResults: [],
    selectedVilla: null,
    loading: false,
    deleteLoading: false,
    error: null,
    message: null,
    deleteMessage: null,
  },
  reducers: {
    clearVillaMessage(state) {
      state.message = null;
      state.deleteMessage = null;
    },
    clearVillaError(state) {
      state.error = null;
    },
    clearSelectedVilla(state) {
      state.selectedVilla = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVilla.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVilla.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Villa created successfully";
      })
      .addCase(createVilla.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllVillas.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllVillas.fulfilled, (state, action) => {
        state.loading = false;
        state.villas = action.payload;
      })
      .addCase(getAllVillas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getVillaBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVillaBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVilla = action.payload;
      })
      .addCase(getVillaBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateVilla.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVilla.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Villa updated successfully";
      })
      .addCase(updateVilla.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteVilla.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteVilla.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteMessage =
          action.payload?.message || "Villa deleted successfully";
      })
      .addCase(deleteVilla.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })

      .addCase(getFeaturedVillas.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeaturedVillas.fulfilled, (state, action) => {
        state.loading = false;
        state.villas = action.payload;
      })
      .addCase(getFeaturedVillas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPopularVillas.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPopularVillas.fulfilled, (state, action) => {
        state.loading = false;
        state.villas = action.payload;
      })
      .addCase(getPopularVillas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchVillas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchVillas.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload || [];
      })
      .addCase(searchVillas.rejected, (state, action) => {
        state.loading = false;
        state.searchError = action.payload || "Search failed";
      });
  },
});

export const { clearVillaMessage, clearVillaError, clearSelectedVilla } =
  villaSlice.actions;

export default villaSlice.reducer;
