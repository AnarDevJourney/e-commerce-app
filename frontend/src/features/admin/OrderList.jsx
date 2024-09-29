import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// Function for fetching all orders
import { getAllOrders } from "../../services/apiOrders";

// Function for converting iso date into readable date
import { formatReadableDate } from "../../utils/helpers";

// React Bootstrap components
import { Table, Button } from "react-bootstrap";
import Loader from "../../ui/Loader";
import Message from "../../ui/Message";

// React Icons
import { FaTimes } from "react-icons/fa";

const OrderList = () => {
  const navigate = useNavigate();

  // Fetching all orders with using React Query
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allOrders"],
    queryFn: getAllOrders,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Message variant="danger" message={error.message} />;
  }
  return (
    <>
      <h1 className="my-3">Orders</h1>
      <Table bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user.name}</td>
              <td>{formatReadableDate(order.createdAt)}</td>
              <td>${order.totalPrice}</td>
              <td>
                {order.isPaid ? (
                  formatReadableDate(order.paidAt)
                ) : (
                  <FaTimes style={{ color: "red" }} />
                )}
              </td>
              <td>
                {order.isDelivered ? (
                  formatReadableDate(order.deliveredAt)
                ) : (
                  <FaTimes style={{ color: "red" }} />
                )}
              </td>
              <td>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(`/order/${order._id}`)}
                >
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default OrderList;
