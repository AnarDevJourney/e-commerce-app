import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMediaQuery } from "react-responsive";

// Function for update user profile
import { updateUserProfile } from "../services/apiAuthentication";

// Function for fetching logged in user orders
import { getMyOrders } from "../services/apiOrders";

// Function for saving user info in redux store and local storage
import { setCredentials } from "../features/authentication/authSlice";

// Function for converting iso date into readable date
import { formatReadableDate } from "../utils/helpers";

// React Bootstrap components
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import Loader from "../ui/Loader";
import Message from "../ui/Message";

// React Icons
import { FaTimes } from "react-icons/fa";

// Email regex: /\S+@\S+\.\S+/

const Profile = () => {
  const isMdUp = useMediaQuery({ query: "(max-width: 768px)" });
  const { register, formState, getValues, handleSubmit } = useForm();
  const { errors } = formState;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Getting user info from redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Updating user profile with using React Query
  const { mutate, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      dispatch(setCredentials(data));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Fetching logged in user orders with using React Query
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["myOrders"],
    queryFn: getMyOrders,
  });

  if (isPending || isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Message variant="danger" message={error.message} />;
  }

  function onSubmit({ name, email, password }) {
    mutate({ name, email, password });
  }
  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              defaultValue={userInfo.name}
              {...register("name")}
            />
            {errors?.name?.message && (
              <Message
                variant="danger"
                message={errors.name.message}
                margin="mt-3"
              />
            )}
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              defaultValue={userInfo.email}
              {...register("email", {
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please provide a valid email adress",
                },
              })}
            />
            {errors?.email?.message && (
              <Message
                variant="danger"
                message={errors.email.message}
                margin="mt-3"
              />
            )}
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              {...register("password")}
            />
            {errors?.password?.message && (
              <Message
                variant="danger"
                message={errors.password.message}
                margin="mt-3"
              />
            )}
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === getValues().password || "Passwords need to match",
              })}
            />
            {errors?.confirmPassword?.message && (
              <Message
                variant="danger"
                message={errors.confirmPassword.message}
                margin="mt-3"
              />
            )}
          </Form.Group>
          <Button type="submit">Update</Button>
        </Form>
      </Col>
      <Col md={9} className={isMdUp ? "mt-4" : ""}>
        <h2>My Orders</h2>

        <Row>
          {orders.map((order) => (
            <Col key={order._id} sm={12} md={6} lg={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>Order ID: {order._id}</Card.Title>
                  <Card.Text>
                    <strong>Date:</strong> {formatReadableDate(order.createdAt)}
                  </Card.Text>
                  <Card.Text>
                    <strong>Total:</strong> ${order.totalPrice}
                  </Card.Text>
                  <Card.Text>
                    <strong>Paid:</strong>{" "}
                    {order.isPaid ? (
                      formatReadableDate(order.paidAt)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </Card.Text>
                  <Card.Text>
                    <strong>Delivered:</strong>{" "}
                    {order.isDelivered ? (
                      formatReadableDate(order.deliveredAt)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </Card.Text>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default Profile;
