import { useQuery } from "@tanstack/react-query";

// Function for fetching products
import { getProducts } from "../services/apiProducts";

// Component to show each product
import Product from "../features/products/Product";

// Loading and error message components
import Loader from "../ui/Loader";
import Message from "../ui/Message";

// React Bootstrap components
import { Row, Col } from "react-bootstrap";
import ProductCarousel from "../ui/ProductCarousel";

const Home = () => {
  // Fetching products with using React Query
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Message variant="danger" message={error.message} />;
  }

  return (
    <>
      <ProductCarousel />
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Home;
