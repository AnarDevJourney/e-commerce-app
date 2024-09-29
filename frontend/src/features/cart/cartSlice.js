import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../utils/cartUtils";

// Getting initial state from local storage if there is cart items else it is just empty object
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "Credit Card" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Function for adding item to the cart
    addToCart: (state, action) => {
      // action.payload is product
      const item = action.payload;

      // Checking if added item already exist or not
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state);
    },

    // Function for removing item from cart
    removeFromCart: (state, action) => {
      // action.id is product id
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );

      return updateCart(state);
    },

    // Function for saving shipping adress
    saveShippingAdress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },

    // Function for saving payment method
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },

    // Function for clearing cart
    clearCart: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },
  },
});

// Exporting actions and reducer
export const {
  addToCart,
  removeFromCart,
  saveShippingAdress,
  savePaymentMethod,
  clearCart,
} = cartSlice.actions;

const cartSliceReducer = cartSlice.reducer;
export default cartSliceReducer;
