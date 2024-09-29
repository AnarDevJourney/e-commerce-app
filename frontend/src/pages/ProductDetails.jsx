import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

// Function for fetching product details by id
import { getProduct } from "../services/apiProducts";

// Function for creating product review
import { createProductReview } from "../services/apiProducts";

// React Bootstrap components
import { Button, Row, Col, ListGroup, Image, Form } from "react-bootstrap";

// Component to show rating of product
import Rating from "../ui/Rating";

// Loader and error message components
import Loader from "../ui/Loader";
import Message from "../ui/Message";

// Function for adding items to the cart
import { addToCart } from "../features/cart/cartSlice";

// Function for formating iso date into readable date
import { formatReadableDate } from "../utils/helpers";

const ProductDetails = () => {
  // Getting user info from redux store
  const { userInfo } = useSelector((state) => state.auth);

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleGoBack() {
    navigate(-1);
  }

  // Getting product id from url
  const { id: productId } = useParams();

  // Fetching product details with using React Query
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
  });

  const queryClient = useQueryClient();

  // Adding review to the product with using React Query
  const { mutate: addReview, isPending: isAddingReview } = useMutation({
    mutationFn: createProductReview,
    onSuccess: () => {
      toast.success("Review added successfully");
      queryClient.invalidateQueries({
        queryKey: ["product"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleAddToCart() {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  }

  function handleAddReview(e) {
    e.preventDefault();
    addReview({ id: productId, rating, comment });
  }

  if (isLoading || isAddingReview) {
    return <Loader />;
  }

  if (isError) {
    return <Message variant="danger" message={error.message} />;
  }

  return (
    <>
      <Button variant="secondary" onClick={handleGoBack}>
        Go Back
      </Button>
      <>
        <Row className="my-4">
          <Col md={5} className="my-3">
            <Image src={product.image} fluid />
          </Col>
          <Col md={4} className="my-3">
            <ListGroup>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
              <ListGroup.Item>
                Description: {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3} className="my-3">
            <ListGroup>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                  </Col>
                </Row>
              </ListGroup.Item>
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Button
                  disabled={product.countInStock === 0}
                  onClick={handleAddToCart}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <h2 className="my-2">Reviews</h2>
            {product.reviews.length === 0 ? (
              <Message message="No Reviews" />
            ) : (
              <ListGroup>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{formatReadableDate(review.createdAt)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
            <ListGroup.Item>
              <h2 className="mt-3">Write a Customer Review</h2>
              {userInfo ? (
                <Form onSubmit={handleAddReview}>
                  <Form.Group className="my-2">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as="select"
                      required
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="my-2">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Form.Group>
                  <Button type="submit">Submit</Button>
                </Form>
              ) : (
                <p>
                  Please <Link to="/login">sign in</Link> to write a review{" "}
                </p>
              )}
            </ListGroup.Item>
          </Col>
        </Row>
      </>
    </>
  );
};

export default ProductDetails;
