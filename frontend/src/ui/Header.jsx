import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Function for logout
import { logout } from "../services/apiAuthentication";

// Function for clearing local storage and user info from redux
import { clearUserInfo } from "../features/authentication/authSlice";

// React Bootstrap components
import { Navbar, Container, Nav, Badge, NavDropdown } from "react-bootstrap";
import Loader from "./Loader";

// React Icons
import { FaShoppingCart, FaUser } from "react-icons/fa";

const Header = () => {
  // Getting cart items from redux store for showing number of items in the cart icon
  const { cartItems } = useSelector((state) => state.cart);
  // Getting logged in user info
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Using log out function with React Query
  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      toast.success(`${data.message}`);
      dispatch(clearUserInfo());
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isPending) {
    return <Loader />;
  }

  function handleLogOut() {
    mutate();
  }

  return (
    <header>
      <Navbar expand="md" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            <Link to="/" className="link">
              ByteStore
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              <Nav.Link>
                <Link className="link" to="/cart">
                  <FaShoppingCart />{" "}
                  <span style={{ marginLeft: "6px" }}>Cart</span>
                  {cartItems.length > 0 && (
                    <Badge style={{ marginLeft: "4px" }}>
                      {cartItems.reduce((acc, current) => acc + current.qty, 0)}
                    </Badge>
                  )}
                </Link>
              </Nav.Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name}>
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogOut}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link>
                  <Link className="link" to="/login">
                    <FaUser />{" "}
                    <span style={{ marginLeft: "6px" }}>Sign In</span>
                  </Link>
                </Nav.Link>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin">
                  <NavDropdown.Item as={Link} to="/admin/productlist">
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/orderlist">
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/userlist">
                    Users
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
