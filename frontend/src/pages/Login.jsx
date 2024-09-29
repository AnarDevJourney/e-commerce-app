import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// Function for login
import { login } from "../services/apiAuthentication";

// Function for saving user info in redux store and local storage
import { setCredentials } from "../features/authentication/authSlice";

// React Bootstrap components
import { Form, Button } from "react-bootstrap";
import FormContainer from "../ui/FormContainer";
import Loader from "../ui/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Using login function with React Query
  const { mutate, isPending } = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      toast.success("Successfully signed in");
      // saving login data in the local storage and redux
      dispatch(setCredentials({ ...data }));
      // navigating to the home page
      navigate("/");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  if (isPending) {
    return <Loader />;
  }

  function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) return;
    mutate();
  }
  return (
    <FormContainer>
      <h1>Sign in</h1>
      <form onSubmit={handleLogin}>
        <Form.Group className="my-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button className="my-3" type="submit">
          Sign in
        </Button>
      </form>
      <p>
        {" "}
        New Customer? <Link to="/register">Register</Link>
      </p>
    </FormContainer>
  );
};

export default Login;
