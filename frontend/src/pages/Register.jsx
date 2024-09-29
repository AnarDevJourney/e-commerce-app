import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Function for creating new account on the server
import { createNewAccount } from "../services/apiAuthentication";

// React Bootstrap components
import { Form, Button } from "react-bootstrap";
import FormContainer from "../ui/FormContainer";
import Message from "../ui/Message";
import Loader from "../ui/Loader";

// Email regex: /\S+@\S+\.\S+/

const Register = () => {
  const { register, formState, getValues, handleSubmit } = useForm();
  const { errors } = formState;

  const navigate = useNavigate();

  // Creating new account with using React Query
  const { mutate, isPending } = useMutation({
    mutationFn: createNewAccount,
    onSuccess: () => {
      toast.success("Account created successfully");
      // navigating to the login page
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isPending) {
    return <Loader />;
  }

  function onSubmit({ name, email, password }) {
    mutate({ name, email, password });
  }

  return (
    <FormContainer>
      <h1>Create new account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="my-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            {...register("name", {
              required: "This field is required",
            })}
          ></Form.Control>
          {errors?.name?.message && (
            <Message
              variant="danger"
              message={errors.name.message}
              margin="mt-3"
            />
          )}
        </Form.Group>
        <Form.Group className="my-3">
          <Form.Label>Email adress</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            {...register("email", {
              required: "This field is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please provide a valid email adress",
              },
            })}
          ></Form.Control>
          {errors?.email?.message && (
            <Message
              variant="danger"
              message={errors.email.message}
              margin="mt-3"
            />
          )}
        </Form.Group>
        <Form.Group className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            {...register("password", {
              required: "This field is required",
            })}
          ></Form.Control>
          {errors?.password?.message && (
            <Message
              variant="danger"
              message={errors.password.message}
              margin="mt-3"
            />
          )}
        </Form.Group>
        <Form.Group className="my-3">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword", {
              required: "This field is required",
              validate: (value) =>
                value === getValues().password || "Passwords need to match",
            })}
          ></Form.Control>
          {errors?.confirmPassword?.message && (
            <Message
              variant="danger"
              message={errors.confirmPassword.message}
              margin="mt-3"
            />
          )}
        </Form.Group>
        <Button className="my-3" type="submit">
          Register
        </Button>
      </form>
      <p>
        {" "}
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </FormContainer>
  );
};

export default Register;
