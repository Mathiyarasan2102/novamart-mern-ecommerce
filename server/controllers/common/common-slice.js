import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// delete feature image
export const deleteFeatureImage = createAsyncThunk(
  "common/deleteFeatureImage",
  async (id) => {
    const response = await axios.delete(`/api/feature-image/${id}`);
    return response.data;
  }
);

const commonSlice = createSlice({
  name: "commonFeature",
  initialState: {
    featureImageList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.featureImageList = state.featureImageList.filter(
            (img) => img._id !== action.meta.arg
          );
        }
      });
  },
});

export default commonSlice.reducer;
