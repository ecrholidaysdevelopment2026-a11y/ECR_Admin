import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  clearTokenRefresh,
  setupTokenRefresh,
} from "../../utils/setupTokenRefresh";
import { FetchApi } from "../../api/FetchApi";

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await FetchApi({
        endpoint: "/admin/login",
        method: "POST",
        body: { email, password },
      });

      const data = response?.data;
      if (data?.admin?.accessToken) {
        localStorage.setItem("tokenExpiry", Date.now() + 50 * 60 * 1000);
        localStorage.setItem("loginTimestamp", Date.now());
        setupTokenRefresh(thunkAPI.dispatch);
      }
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Token refresh failed");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.refreshToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/refresh",
        method: "POST",
        token,
      });

      const data = response?.data;
      if (data?.admin?.accessToken) {
        localStorage.setItem("tokenExpiry", Date.now() + 50 * 60 * 1000);
        setupTokenRefresh(thunkAPI.dispatch);
      }

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Token refresh failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: null,
    firstName: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearMessage(state) {
      state.message = null;
    },
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.email = null;
      state.firstName = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.clear();
      clearTokenRefresh();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action?.payload?.admin?.accessToken;
        state.refreshToken = action?.payload?.admin?.refreshToken;
        state.email = action?.payload?.admin?.email;
        state.firstName = action?.payload?.admin?.firstName;
        state.lastName = action?.payload?.admin?.lastName;
        state.message = action?.payload?.message || "Login successful";
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload?.admin?.accessToken;
        state.refreshToken =
          action.payload?.admin?.refreshToken || state.refreshToken;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.refreshError = action.payload || "Failed to refresh token";
      });
  },
});

export const { clearMessage, clearError, logout } = authSlice.actions;
export default authSlice.reducer;
