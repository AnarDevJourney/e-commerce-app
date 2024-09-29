import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// Function for saving payment method
import { savePaymentMethod } from "../features/cart/cartSlice";

// React Bootstrap components
import { Form, Button } from "react-bootstrap";
import FormContainer from "../ui/FormContainer";

const Payment = () => {
  const [paymentMehtod, setPaymentMethod] = useState("Credit Card");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleContinue(e) {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMehtod));
    navigate("/placeorder");
  }
  return (
    <FormContainer>
      <h1>Payment Method</h1>
      <form onSubmit={handleContinue}>
        <Form.Group className="my-3">
          <Form.Label>Select Method</Form.Label>
          <Form.Check
            type="radio"
            label="Credit Card"
            value="Credit Card"
            checked
            onChange={(e) => setPaymentMethod(e.target.value)}
          ></Form.Check>
        </Form.Group>
        <Button type="submit">Continue</Button>
      </form>
    </FormContainer>
  );
};

export default Payment;
