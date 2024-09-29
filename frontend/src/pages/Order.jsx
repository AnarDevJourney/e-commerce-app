import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useMediaQuery } from "react-responsive";

// Function for fetching order by id
import { getOrderById } from "../services/apiOrders";

// Functin for updating order to paid
import { updateToPaid } from "../services/apiOrders";

// Function for updating order to delivered
import { updateToDelivered } from "../services/apiOrders";

// React Bootstrap components
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Loader from "../ui/Loader";
import Message from "../ui/Message";

// React Icons
import { FaWallet } from "react-icons/fa";

// Credit card regex
/* ^(?:4[0-9]{12}(?:[0-9]{3})?|      # Visa: 13 or 16 digits, starting with 4
5[1-5][0-9]{14}|                  # MasterCard: 16 digits, starting with 51-55 */

// Expiration date regex mm/yy format
/* ^(0[1-9]|1[0-2])\/?([0-9]{2})$ */

const Order = () => {
  const isMdUp = useMediaQuery({ query: "(max-width: 768px)" });
  const { register, formState, handleSubmit } = useForm();
  const { errors } = formState;

  // Getting user info from redux store
  const { userInfo } = useSelector((state) => state.auth);

  // State for showing credit card form
  const [showCreditCardForm, setShowCreditCardForm] = useState(false);

  // Getting order id from URL
  const { id: orderId } = useParams();

  // Fetching order by id with using React Query
  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
  });

  const queryClient = useQueryClient();

  // Updating order to paid with using React Query
  const { mutate: updateOrderToPaid, isPending: isPendingPayment } =
    useMutation({
      mutationFn: () => updateToPaid(orderId),
      onSuccess: () => {
        toast.success("Order paid successfully");
        queryClient.invalidateQueries({
          queryKey: ["order"],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  // Updating order to delivered with using React Query
  const { mutate: updateOrderToDelivered, isPending: isPendingDeliver } =
    useMutation({
      mutationFn: () => updateToDelivered(orderId),
      onSuccess: () => {
        toast.success("Order updated to delivered successfully");
        queryClient.invalidateQueries({
          queryKey: ["order"],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  if (isLoading || isPendingPayment || isPendingDeliver) {
    return <Loader />;
  }

  if (isError) {
    return <Message variant="danger" message={error.message} />;
  }

  function onSubmit() {
    updateOrderToPaid();
  }

  function handleUpdateOrderToDelivered() {
    updateOrderToDelivered();
  }

  return (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}
              </p>
              <p>
                <strong>Address: </strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success" message="Delivered" />
              ) : (
                <Message variant="warning" message="Not delivered" />
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Mehtod</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success" message="Paid" />
              ) : (
                <Message variant="warning" message="Not Paid" />
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              <ListGroup>
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>{item.name}</Col>
                      <Col md={4}>
                        {item.qty} x {item.price} = $
                        {(item.qty * item.price).toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4} className={isMdUp ? "mt-4" : ""}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && !userInfo.isAdmin && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    variant="dark"
                    onClick={() => setShowCreditCardForm(!showCreditCardForm)}
                  >
                    <FaWallet /> <span>Pay With Debit Or Credit Card</span>
                  </Button>
                </ListGroup.Item>
              )}
              {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button type="button" onClick={handleUpdateOrderToDelivered}>
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
          {showCreditCardForm && !order.isPaid && (
            <Card className="mt-3">
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="my-3">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter card number"
                      {...register("cardNumber", {
                        required: "This field is required",
                        pattern: {
                          value:
                            /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/,
                          message:
                            "Please provide a valid Visa or MasterCard number",
                        },
                      })}
                    />
                    {errors?.cardNumber?.message && (
                      <Message
                        variant="danger"
                        message={errors.cardNumber.message}
                        margin="mt-3"
                      />
                    )}
                  </Form.Group>
                  <Form.Group className="my-3">
                    <Form.Label>Expiration Date</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="MM/YY"
                      {...register("expirationDate", {
                        required: "This field is required",
                        pattern: {
                          value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
                          message:
                            "Please provide a valid expiration date (MM/YY)",
                        },
                      })}
                    />
                    {errors?.expirationDate?.message && (
                      <Message
                        variant="danger"
                        message={errors.expirationDate.message}
                        margin="mt-3"
                      />
                    )}
                  </Form.Group>
                  <Form.Group className="my-3">
                    <Form.Label>CVV</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter CVV"
                      {...register("cvv", {
                        required: "This field is required",
                        pattern: {
                          value: /^[0-9]{3}$/,
                          message: "CVV must be 3 digits",
                        },
                      })}
                    />
                    {errors?.cvv?.message && (
                      <Message
                        variant="danger"
                        message={errors.cvv.message}
                        margin="mt-3"
                      />
                    )}
                  </Form.Group>
                  <Button type="submit">Pay</Button>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
};

export default Order;
