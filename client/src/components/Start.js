import NavBar from "./NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Footer from "./Footer";

function Start() {
  return (
    <>
      <NavBar />
      <Container fluid>
        <Row></Row>
        <footer>
          <Footer />
        </footer>
      </Container>
    </>
  );
}

export default Start;
