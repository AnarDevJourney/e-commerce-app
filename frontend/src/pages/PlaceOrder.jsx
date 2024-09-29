import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMediaQuery } from "react-responsive";

// Function to place new order in the database
import { placeOrder } from "../services/apiOrders";

// Function for clearing cart after placing order
import { clearCart } from "../features/cart/cartSlice";

// React Bootstrap components
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import Loader from "../ui/Loader";

const PlaceOrder = () => {
  const isMdUp = useMediaQuery({ query: "(max-width: 768px)" });
  // Getting cart state from redux
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: placeOrder,
    onSuccess: (data) => {
      toast.success("Your order placed successfully");
      dispatch(clearCart());
      navigate(`/order/${data._id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isPending) {
    return <Loader />;
  }

  function handlePlaceOrder() {
    mutate({
      orderItems: cart.cartItems,
      shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });
  }

  return (
    <>
      <Row>
        <Col md={8}>
          <ListGroup>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              <ListGroup>
                {cart.cartItems.map((item, index) => (
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
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={cart.length === 0}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrder;
