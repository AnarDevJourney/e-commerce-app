import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

// Function for fetching top 3 products
import { getTopProducts } from "../services/apiProducts";

// React Bootstrap components
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";

const ProductCarousel = () => {
  // Fetching top 3 products with using React Query
  const {
    data: topProducts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["topProducts"],
    queryFn: getTopProducts,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Message variant="danger" message={error.message} />;
  }
  return (
    <Carousel pause="hover" className="mb-4 bg-dark rounded text-center">
      {topProducts.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption>
              <h2 className="text-white text-center">
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
