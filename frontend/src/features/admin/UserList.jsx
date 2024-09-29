import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Function for fetching all users data
import { getAllUsers } from "../../services/apiAuthentication";

// Function for deleting user data
import { deleteUser } from "../../services/apiAuthentication";

// React Bootstrap components
import { Table, Button } from "react-bootstrap";
import Loader from "../../ui/Loader";
import Message from "../../ui/Message";

// React Icons
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

const UserList = () => {
  // Fetching all users data with using React Query
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  const queryClient = useQueryClient();

  // Deleting user data with React Query
  const { mutate: deleteUserData, isPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["allUsers"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading || isPending) {
    return <Loader />;
  }

  if (isError) {
    return <Message variant="danger" message={error.message} />;
  }

  return (
    <>
      <h1 className="my-3">Users</h1>
      <Table bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ADMIN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.isAdmin ? (
                  <FaCheck style={{ color: "green" }} />
                ) : (
                  <FaTimes style={{ color: "red" }} />
                )}
              </td>
              <td>
                {!user.isAdmin && (
                  <Button
                    type="button"
                    className="btn-sm"
                    variant="danger"
                    onClick={() => deleteUserData(user._id)}
                  >
                    <FaTrash />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default UserList;
