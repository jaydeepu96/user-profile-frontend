import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice"; // Correct the path

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
