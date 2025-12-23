import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getAdminProfile = createAsyncThunk(
  "user/getAdminProfile",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/me",
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch profile");
    }
  }
);

export const updateAdminProfile = createAsyncThunk(
  "user/updateAdminProfile",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/me",
        method: "PATCH",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update profile"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/change-password",
        method: "PATCH",
        body: payload,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to change password"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
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
    clearUser(state) {
      state.email = null;
      state.firstName = null;
      state.lastName = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(getAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAdminProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.firstName = action.payload?.firstName;
        state.lastName = action.payload?.lastName;
        state.message =
          action.payload?.message || "Profile updated successfully";
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Password changed successfully";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessage, clearError, clearUser } = userSlice.actions;
export default userSlice.reducer;
