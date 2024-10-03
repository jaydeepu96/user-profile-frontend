import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create new user
export const createUserProfile = createAsyncThunk(
  "user/createProfile",
  async (data) => {
    const response = await axios.post("/api/users/create", data);
    return response.data;
  }
);

// Fetch all users
export const fetchUserProfiles = createAsyncThunk(
  "user/fetchProfiles",
  async () => {
    const response = await axios.get("/api/users");
    return response.data;
  }
);

// Update user profile
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
    profiles: [],
    status: "idle",
    error: null,
  },
  reducers: {
    resetFormState(state) {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfiles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfiles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profiles = action.payload;
      })
      .addCase(fetchUserProfiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createUserProfile.fulfilled, (state, action) => {
        state.profiles.push(action.payload);
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        const index = state.profiles.findIndex(
          (profile) => profile.userID === action.payload.userID
        );
        if (index !== -1) {
          state.profiles[index] = action.payload;
        }
      });
  },
});

export const { resetFormState } = userSlice.actions;
export default userSlice.reducer;
