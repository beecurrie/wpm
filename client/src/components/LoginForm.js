import React from "react";
import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/esm/Container";
import CardBody from "react-bootstrap/esm/CardBody";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";

//Login Screen
export default function LoginForm() {
  const formEmailRef = useRef();
  const formPasswordRef = useRef();

  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();

    const enteredEmail = formEmailRef.current.value;
    const enteredPassword = formPasswordRef.current.value;

    //Create Formdata - did this due to the addition of file in the submission of data
    // const formData = new FormData();
    // formData.append("email", enteredEmail);
    // formData.append("password", enteredPassword);

    try {
      // console.log("Entered email and password", enteredEmail, enteredPassword);
      const response = await axios.post("/api/wpm/login", {
        email: enteredEmail,
        password: enteredPassword,
      });
      console.log(response.data);
      setUser(response.data);
      if (response.data.auth) {
        localStorage.setItem("auth", "true");
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        setMsg("Login successfull!");
        navigate("/dashboard", { replace: true });
        // console.log(user);
      } else {
        localStorage.setItem("auth", "false");
        localStorage.setItem("user", null);
        setMsg("Login unsuccessful!");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.log(err);
      // setError(err.response.data.error);
    }
  }

  return (
    <Container className="login-container">
      <Nav.Link href="/">
        <div className="logo-registration">
          <img
            src="../WPM_Security-logos_white.png"
            alt="Upper left logo"
            align="left"
            width="200"
            height="120"
          />
        </div>
      </Nav.Link>

      <Card className="sign-in-box-card">
        <CardBody className="sign-in-box-card-body">
          {user && user.auth ? (
            <div className="text-black">{msg}</div>
          ) : (
            <div className="text-danger">{msg}</div>
          )}

          <div className="profile-icon">
            <img
              src="../user.png"
              alt="profile icon"
              style={{ width: "10%", opacity: "0.5", marginTop: "-3%" }}
            />
          </div>
          <Card.Title className="card-title">Sign In</Card.Title>
          <Form className="login-form" onSubmit={submitHandler}>
            <Row className="mb-3">
              <Form.Group className="mb-3" controlId="formEmail">
                <Col lg={true}>
                  <Form.Control
                    id="username"
                    type="email"
                    placeholder="Username"
                    ref={formEmailRef}
                    require
                  />
                </Col>
              </Form.Group>
            </Row>
            <Row>
              <Col lg={true}>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    ref={formPasswordRef}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={true}>
                <div id="login-btn" className="d-grid gap-2">
                  <Button
                    style={{
                      padding: "8px",
                      borderRadius: "12px",
                      backgroundColor: "#03989e",
                      color: "white",
                    }}
                    variant="light"
                    type="submit"
                  >
                    Login
                  </Button>
                </div>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col>
                {/* Edit here */}
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="check1"
                  name="option1"
                  value="something"
                />
                <label class="form-check-label">Remember me</label>
              </Col>
              <Col>
                <Nav.Link href="/forgot" className="nav-item">
                  Forgot Password?
                </Nav.Link>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      <hr
        style={{
          border: "white solid 2px",
          opacity: "1",
          borderRadius: "10px",
          marginTop: "50px",
        }}
      />
      <div>
        <Row className="mt-2">
          <Col lg={true} className="mb-3">
            <Nav.Item>
              <Nav.Link className="reg-text" href="/register">
                Don't have an account yet? REGISTER HERE
              </Nav.Link>
            </Nav.Item>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
