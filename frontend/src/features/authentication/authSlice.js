import { createSlice } from "@reduxjs/toolkit";

// getting initial state(user info) from local storage if there is no user info in the local storage it will be null
const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Function for saving user info into the redux store and local storage
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    // Function for logout(setting user info to null and clearing localstorage)
    clearUserInfo: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
});

// Exporting actions and reducer
export const { setCredentials, clearUserInfo } = authSlice.actions;

const authSliceReducer = authSlice.reducer;
export default authSliceReducer;
