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
import CardHeader from "react-bootstrap/esm/CardHeader";
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
    <Container>
      <Nav.Item style={{backgroundColor: "black"}}>
          <Nav.Link href="/">
            <div className="logo-registration">
              <img
                src="../WPM_Logo.png"
                alt="Upper left logo"
                align="left"
                width="200"
                height="50"
              />
            </div>
          </Nav.Link>
        </Nav.Item>
      <div className="h1-login">
        <h1>Web-based Password Manager</h1>
      </div>
      
      <Card className="sign-in-box-card">
        <CardHeader className="card-header text-center text-black">
        <h3>SIGN-IN</h3>
        </CardHeader>
        <CardBody className="sign-in-box-card-body">
          {user && user.auth ? (
            <div className="text-black">{msg}</div>
          ) : (
            <div className="text-danger">{msg}</div>
          )}
          <Form onSubmit={submitHandler}>
            <Row className="mt-3">
              <Col lg={true}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="email"
                    ref={formEmailRef}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={true}>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
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
              <Col lg={8}></Col>
              <Col lg={4}>
                <div className="d-grid gap-2">
                  <Button
                    style={{
                      padding: "8px",
                      borderRadius: "15px",
                      backgroundColor: "#C5D5EA",
                    }}
                    variant="light"
                    type="submit"
                  >
                    Sign-in
                  </Button>
                </div>
              </Col>
              <div>
              <Row className="mt-5">
                <Col lg={6}>
                  <p className="sign-in-text">Don't have an account yet?</p>
                  <Nav.Item className="nav-item">
                    <Nav.Link href="/register">Register</Nav.Link>
                  </Nav.Item>
                </Col>
                <Col lg={6}>
                  <p className="sign-in-text">Re-set your password here.</p>
                  <Nav.Item className="nav-item">
                    <Nav.Link href="/forgot">
                      Forgot Password?
                    </Nav.Link>
                  </Nav.Item>
                </Col>
              </Row>
              </div>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
}
