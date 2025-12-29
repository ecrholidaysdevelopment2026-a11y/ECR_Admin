import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createPromo = createAsyncThunk(
  "promo/create",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/promo/create",
        method: "POST",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create promo"
      );
    }
  }
);

export const getAllPromos = createAsyncThunk(
  "promo/getAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/promo/all",
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch promos"
      );
    }
  }
);

export const updatePromo = createAsyncThunk(
  "promo/update",
  async ({ id, payload }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/promo/update/${id}`,
        method: "PUT",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update promo"
      );
    }
  }
);

export const deletePromo = createAsyncThunk(
  "promo/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/promo/delete/${id}`,
        method: "DELETE",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete promo"
      );
    }
  }
);

const promoSlice = createSlice({
  name: "promo",
  initialState: {
    promos: [],
    loading: false,
    deleteLoading: false,
    error: null,
    message: null,
    deleteMessage: null,
  },
  reducers: {
    clearPromoMessage(state) {
      state.message = null;
      state.deleteMessage = null;
    },
    clearPromoError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPromo.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPromo.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Promo created successfully";
      })
      .addCase(createPromo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllPromos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPromos.fulfilled, (state, action) => {
        state.loading = false;
        state.promos = action.payload;
      })
      .addCase(getAllPromos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePromo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePromo.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Promo updated successfully";
      })
      .addCase(updatePromo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deletePromo.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deletePromo.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteMessage =
          action.payload?.message || "Promo deleted successfully";
      })
      .addCase(deletePromo.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPromoMessage, clearPromoError } = promoSlice.actions;
export default promoSlice.reducer;
