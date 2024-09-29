// React Bootstrap components
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col>
            <p className="text-center">ByteStore &copy; 2024</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
