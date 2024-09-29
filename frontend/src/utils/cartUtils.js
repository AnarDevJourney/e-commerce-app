export function updateCart(state) {
  // Calculating items price
  state.itemsPrice = state.cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  // Calculating shipping price (if order is greater than 100$ shipping is free else 10$)
  state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;

  // Calculating tax price (15% of cart items price)
  state.taxPrice = (0.15 * state.itemsPrice).toFixed(2);

  // Calculating total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // Saving state in local storage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
}
