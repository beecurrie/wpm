import NavBar from "./NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Footer from "./Footer";
import PasswordList from "./PasswordList";

function Start() {
  return (
    <>
      <NavBar />
      <Container fluid>
        <Row>
          <PasswordList />
        </Row>
      </Container>
    </>
  );
}

export default Start;
