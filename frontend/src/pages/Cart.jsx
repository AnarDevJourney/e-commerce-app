import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

// Function to add items to the cart (in this page it is using for updating quantity)
import { addToCart } from "../features/cart/cartSlice";

// Function to remove item from cart
import { removeFromCart } from "../features/cart/cartSlice";

// React Bootstrap components
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
  ListGroupItem,
} from "react-bootstrap";
import Message from "../ui/Message";

// React Icons
import { FaTrash } from "react-icons/fa";

const Cart = () => {
  const isMdUp = useMediaQuery({ query: "(max-width: 768px)" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Getting cart state from redux store
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const { itemsPrice } = cart;
  // Getting user info from redux store
  const { userInfo } = useSelector((state) => state.auth);

  function handleGoProductDetails(id) {
    navigate(`/product/${id}`);
  }

  function handleAddToCart(product, qty) {
    dispatch(addToCart({ ...product, qty }));
  }

  function handleRemoveFromCart(id) {
    dispatch(removeFromCart(id));
  }

  function handleCheckout() {
    if (!userInfo) {
      navigate("/login");
    } else {
      navigate("/shipping");
    }
  }
  return (
    <Row>
      <Col md={8}>
        <h1 className="mb-4">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message message={`Your cart is empty`} />
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <p
                      onClick={() => handleGoProductDetails(item._id)}
                      style={{ cursor: "pointer" }}
                    >
                      {item.name}
                    </p>
                  </Col>
                  <Col md={2} className={isMdUp ? "my-2" : ""}>
                    ${item.price}
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        handleAddToCart(item, Number(e.target.value))
                      }
                      className={isMdUp ? "my-2" : ""}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => handleRemoveFromCart(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4} className={isMdUp ? "my-4" : ""}>
        <Card>
          <ListGroup>
            <ListGroup.Item>
              <h2>
                Subtotal (
                {cartItems.reduce((acc, current) => acc + current.qty, 0)})
                items
              </h2>
              ${itemsPrice}
            </ListGroup.Item>
            <ListGroupItem>
              <Button
                type="button"
                disabled={cartItems.length === 0}
                onClick={handleCheckout}
              >
                Proceed To Checkout
              </Button>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default Cart;
