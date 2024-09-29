import { Link } from "react-router-dom";

// React Bootstrap components
import { Card } from "react-bootstrap";

// Component to show product rating
import Rating from "../../ui/Rating";

const Product = ({ product }) => {
  return (
    <Card className="p-3 my-3">
      <Link to={`/product/${product._id}`} className="link">
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`} className="link">
          <Card.Title className="product-name">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
