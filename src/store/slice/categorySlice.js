import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createCategory = createAsyncThunk(
  "category/create",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: "/admin/category/create",
        method: "POST",
        body: payload,
        token,
      });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create category"
      );
    }
  }
);

export const getAllCategories = createAsyncThunk(
  "category/getAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: "/admin/category/get",
        method: "GET",
        token,
      });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch categories"
      );
    }
  }
);

export const getCategoryById = createAsyncThunk(
  "category/getById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: `/admin/category/get/${id}`,
        method: "GET",
        token,
      });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch category"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, payload }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: `/admin/category/update/${id}`,
        method: "PATCH",
        body: payload,
        token,
      });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update category"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: `/admin/category/delete/${id}`,
        method: "DELETE",
        token,
      });
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete category"
      );
    }
  }
);

export const deleteCategoryImage = createAsyncThunk(
  "category/deleteImage",
  async (categoryId, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: `/admin/category/image/${categoryId}`,
        method: "DELETE",
        token,
      });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete category image"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    selectedCategory: null,
    loading: false,
    deleteLoading: false,
    error: null,
    message: null,
    deleteCategoryMessage: null,
    deleteCategoryError: null,
  },
  reducers: {
    clearCategoryMessage(state) {
      state.message = null;
      state.deleteCategoryMessage = null;
    },
    clearCategoryError(state) {
      state.error = null;
      state.deleteCategoryError = null;
    },
    clearSelectedCategory(state) {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Category created successfully";
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCategoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Category updated successfully";
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCategory.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteCategoryMessage =
          action.payload?.message || "Category deleted successfully";
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteCategoryError = action.payload;
      })
      .addCase(deleteCategoryImage.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Category image deleted successfully";
      });
  },
});

export const {
  clearCategoryMessage,
  clearCategoryError,
  clearSelectedCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
