import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addUserToFeed: (state, action) => {
      return action.payload;
    },
    removeUserFromFeed: (state, action) => {
      const newFeed = state.filter((user) => user._id !== action.payload);
      return newFeed;
    },
    clearFeed: (state) => {
      return null;
    },
  },
});

export const { addUserToFeed, removeUserFromFeed, clearFeed } =
  feedSlice.actions;
export default feedSlice.reducer;
