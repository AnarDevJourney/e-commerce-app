import { Outlet } from "react-router-dom";

// React Bootstrap components
import { Container } from "react-bootstrap";

//Layout components
import Header from "./Header";
import Footer from "./Footer";

const AppLayout = () => {
  return (
    <div className="layout">
      <Header />
      <main>
        <Container className="py-3">
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
