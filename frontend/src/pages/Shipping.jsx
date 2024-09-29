import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingAdress } from "../features/cart/cartSlice";

// React Bootstrap components
import { Form, Button } from "react-bootstrap";
import FormContainer from "../ui/FormContainer";

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Getting cart state from redux store
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Form states
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  // Saving shipping adress to redux store and local storage and navigating to the next page (payment)
  function handleCountinue(e) {
    e.preventDefault();
    dispatch(saveShippingAdress({ address, city, postalCode, country }));
    navigate("/payment");
  }

  return (
    <FormContainer>
      <h1>Shipping</h1>
      <form onSubmit={handleCountinue}>
        <Form.Group className="my-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-3">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-3">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Button className="my-3" type="submit">
          Continue
        </Button>
      </form>
    </FormContainer>
  );
};

export default Shipping;
