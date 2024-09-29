import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMediaQuery } from "react-responsive";

// Function for fetching product data
import { getProduct } from "../../services/apiProducts";

// Function for updating product data
import { updateProduct } from "../../services/apiProducts";

// Function for uploading product image
import { uploadImage } from "../../services/apiProducts";

// React Bootstrap components
import { Form, Button } from "react-bootstrap";
import FormContainer from "../../ui/FormContainer";
import Loader from "../../ui/Loader";
import Message from "../../ui/Message";

const ProductEdit = () => {
  const isMdUp = useMediaQuery({ query: "(max-width: 768px)" });
  const navigate = useNavigate();

  // Getting product id from URL
  const { id: productId } = useParams();

  // Edit form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Fetching product data by id with using React Query
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["editingProduct", productId],
    queryFn: () => getProduct(productId),
  });

  const queryClient = useQueryClient();

  // Updating product data with using React Query
  const { mutate: updateProductData, isPending: isUpdatingProduct } =
    useMutation({
      mutationFn: updateProduct,
      onSuccess: () => {
        toast.success("Product updated successfully");
        queryClient.invalidateQueries({
          queryKey: ["editingProduct", "allProducts"],
        });
        navigate("/admin/productlist");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  // Uploading image with using React Query
  const { mutate: uploadProductImage, isPending: isUploadingImage } =
    useMutation({
      mutationFn: uploadImage,
      onSuccess: (data) => {
        toast.success("Image uploaded successfully");
        setImage(data.image); // Set the uploaded image URL in the state
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  // Filling edit form fields with actual product data that we fetched
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  if (isLoading || isUpdatingProduct || isUploadingImage) {
    return <Loader />;
  }

  if (isError) {
    return <Message variant="danger" message={error.message} />;
  }

  function handleGoBack() {
    navigate(-1);
  }

  // Handle image file selection
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    if (imageFile) {
      uploadProductImage(imageFile, {
        onSuccess: (data) => {
          // Update product data with the uploaded image URL
          updateProductData({
            id: productId,
            name,
            price,
            image: data.image, // Use the uploaded image URL
            brand,
            category,
            countInStock,
            description,
          });
        },
      });
    } else {
      // If no image upload, update directly
      updateProductData({
        id: productId,
        name,
        price,
        image, // Use the existing image URL (if any)
        brand,
        category,
        countInStock,
        description,
      });
    }
  }

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleGoBack}
        className={isMdUp ? "mb-4" : ""}
      >
        Go Back
      </Button>
      <FormContainer>
        <h1>Edit Product</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="Enter name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              placeholder="Enter price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              placeholder="Enter brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              placeholder="Enter count in stock"
              type="number"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              placeholder="Enter category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              placeholder="Enter image URL"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <Form.Control type="file" onChange={handleImageChange} />
          </Form.Group>
          <Button type="submit">Update</Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductEdit;
