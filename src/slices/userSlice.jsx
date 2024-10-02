import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createUserProfile = createAsyncThunk(
  "user/createProfile",
  async (data) => {
    const response = await axios.post("/api/users/create", data);
    return response.data;
  }
);

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (userId) => {
    const response = await axios.get(`/api/users/${userId}`);
    return response.data;
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ userId, data }) => {
    const response = await axios.put(`/api/users/${userId}`, data);
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export default userSlice.reducer;
