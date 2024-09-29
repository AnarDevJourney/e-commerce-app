// React Bootstrap component to show loader spinner
import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <div className="loader-container">
      <Spinner
        animation="border"
        variant="primary"
        style={{ width: "100px", height: "100px" }}
      />
    </div>
  );
};

export default Loader;
