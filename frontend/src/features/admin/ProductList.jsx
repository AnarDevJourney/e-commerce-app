import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Function for fetching all products
import { getProducts } from "../../services/apiProducts";

// Function for creating new product
import { createProduct } from "../../services/apiProducts";

// Function for deleting product
import { deleteProduct } from "../../services/apiProducts";

// React Bootstrap components
import { Table, Button, Row, Col } from "react-bootstrap";
import Loader from "../../ui/Loader";
import Message from "../../ui/Message";

// React Icons
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const ProductList = () => {
  const navigate = useNavigate();

  // Fetching all products with using React Query
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allProducts"],
    queryFn: getProducts,
  });

  const queryClient = useQueryClient();

  // Creating new product with using React Query
  const { mutate: createNewProduct, isPending: isCreatingNewProduct } =
    useMutation({
      mutationFn: createProduct,
      onSuccess: () => {
        toast.success("New product created successfully");
        queryClient.invalidateQueries({
          queryKey: ["allProducts"],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  // Deleting product with using React Query
  const { mutate: deleteProductFromDatabase, isPending: isDeletingProduct } =
    useMutation({
      mutationFn: deleteProduct,
      onSuccess: () => {
        toast.success("Product deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["allProducts"],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  if (isLoading || isCreatingNewProduct || isDeletingProduct) {
    return <Loader />;
  }

  if (isError) {
    return <Message variant="danger" message={error.message} />;
  }

  function handleCreateNewProduct() {
    createNewProduct();
  }

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button type="button" onClick={handleCreateNewProduct}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>
      <Table bordered hover responsive className="table-sm my-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>
                <Button
                  type="button"
                  className="btn-sm"
                  variant="secondary"
                  onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                >
                  <FaEdit />
                </Button>
              </td>
              <td>
                <Button
                  type="button"
                  className="btn-sm"
                  variant="danger"
                  onClick={() => deleteProductFromDatabase(product._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ProductList;
