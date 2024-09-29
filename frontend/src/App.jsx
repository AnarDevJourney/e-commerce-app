import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import store from "./store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

// Importing pages
import Home from "./pages/Home";
import AppLayout from "./ui/AppLayout";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/Order";
import Profile from "./pages/Profile";
import OrderList from "./features/admin/OrderList";
import ProductList from "./features/admin/ProductList";
import ProductEdit from "./features/admin/ProductEdit";
import UserList from "./features/admin/UserList";
import PageNotFound from "./pages/PageNotFound";
import PrivateRoute from "./features/authentication/PrivateRoute";
import AdminRoute from "./features/admin/AdminRoute";
import ScrollToTop from "./ui/ScrollToTop";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="" element={<PrivateRoute />}>
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/placeorder" element={<PlaceOrder />} />
                <Route path="/order/:id" element={<Order />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="" element={<AdminRoute />}>
                <Route path="/admin/orderlist" element={<OrderList />} />
                <Route path="/admin/productlist" element={<ProductList />} />
                <Route
                  path="/admin/product/:id/edit"
                  element={<ProductEdit />}
                />
                <Route path="/admin/userlist" element={<UserList />} />
              </Route>
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "42px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)",
            },
          }}
        />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
