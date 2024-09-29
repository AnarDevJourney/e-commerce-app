// Function for login
export async function login(email, password) {
  const postData = {
    email,
    password,
  };

  try {
    const res = await fetch(`/api/users/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Could not login");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function for logout
export async function logout() {
  try {
    const res = await fetch(`/api/users/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Could not logout");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function for creating new account
export async function createNewAccount({ name, email, password }) {
  const postData = {
    name,
    email,
    password,
  };

  try {
    const res = await fetch(`/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Could not create new user");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function for updating profile
export async function updateUserProfile({ name, email, password }) {
  const putData = {
    name,
    email,
    password,
  };

  try {
    const res = await fetch(`/api/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Could not update your profile");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function for get all users
export async function getAllUsers() {
  try {
    const res = await fetch("/api/users");

    if (!res.ok) {
      throw new Error("Could not fetch users");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Function for delete user
export async function deleteUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Could not delete user");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
