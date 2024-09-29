// Function for placing new order in the databse
export async function placeOrder({
  orderItems,
  shippingAddress,
  paymentMethod,
  itemsPrice,
  shippingPrice,
  taxPrice,
  totalPrice,
}) {
  const postData = {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };

  try {
    const res = await fetch(`/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Could not place new order");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function for fetching single order by id
export async function getOrderById(id) {
  try {
    const res = await fetch(`/api/orders/${id}`);

    if (!res.ok) {
      throw new Error("Could not fetch order");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Function for updating order to paid
export async function updateToPaid(id) {
  try {
    const res = await fetch(`/api/orders/${id}/pay`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Something went wrong in payment");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function for fetching logged in user orders
export async function getMyOrders() {
  try {
    const res = await fetch("/api/orders/mine");

    if (!res.ok) {
      throw new Error("Could not fetch your orders");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Function for fetching all orders
export async function getAllOrders() {
  try {
    const res = await fetch("/api/orders/");

    if (!res.ok) {
      throw new Error("Could not fetch orders");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Function for updating order to delivered
export async function updateToDelivered(id) {
  try {
    const res = await fetch(`/api/orders/${id}/deliver`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message ||
          "Something went wrong can not update order to delivered"
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
