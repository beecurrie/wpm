import NavBar from "./NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

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
