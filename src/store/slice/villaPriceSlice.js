import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const setVillaSpecialPrice = createAsyncThunk(
  "villaPrice/setSpecialPrice",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/villa/set-price",
        method: "POST",
        body: payload,
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to set villa special price"
      );
    }
  }
);

export const getVillaWeeklyPrice = createAsyncThunk(
  "villaPrice/getWeeklyPrice",
  async (villaId, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/villa/weekly-price/${villaId}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch weekly villa price"
      );
    }
  }
);

const villaPriceSlice = createSlice({
  name: "villaPrice",
  initialState: {
    weeklyPrice: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearVillaPriceMessage(state) {
      state.message = null;
    },
    clearVillaPriceError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setVillaSpecialPrice.pending, (state) => {
        state.loading = true;
      })
      .addCase(setVillaSpecialPrice.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Villa price updated successfully";
      })
      .addCase(setVillaSpecialPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getVillaWeeklyPrice.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVillaWeeklyPrice.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklyPrice = action.payload?.prices;
      })
      .addCase(getVillaWeeklyPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVillaPriceMessage, clearVillaPriceError } =
  villaPriceSlice.actions;

export default villaPriceSlice.reducer;
