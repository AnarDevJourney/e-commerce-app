// Function for fetching products
export async function getProducts() {
  try {
    const res = await fetch(`/api/products/`);

    if (!res.ok) {
      throw new Error("Could not fetch products");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Function for fetching single product by id
export async function getProduct(id) {
  try {
    const res = await fetch(`/api/products/${id}`);

    if (!res.ok) {
      throw new Error("Could not fetch product");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function createProduct() {
  try {
    const res = await fetch(`/api/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || "Something went wrong can not create new product"
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function for updating product data
export async function updateProduct({
  id,
  name,
  price,
  image,
  brand,
  category,
  countInStock,
  description,
}) {
  const putData = {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    description,
  };

  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Could not update product");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function for uploading image
export async function uploadImage(imageFile) {
  try {
    const formData = new FormData();

    formData.append("image", imageFile);

    const res = await fetch(`/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || "Something went wrong, image upload failed"
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function for deleting product
export async function deleteProduct(id) {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Could not delete product");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function for creating review
export async function createProductReview({ id, rating, comment }) {
  const postData = {
    rating,
    comment,
  };

  try {
    const res = await fetch(`/api/products/${id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Could not create review");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function for fetching top 3 products
export async function getTopProducts() {
  try {
    const res = await fetch(`/api/products/top`);

    if (!res.ok) {
      throw new Error("Could not fetch products");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
