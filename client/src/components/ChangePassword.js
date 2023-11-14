import React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/esm/Container";
import NavBar from "./NavBar";
import Card from "react-bootstrap/Card";

import InputGroup from "react-bootstrap/InputGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

export default function ChangePassword() {
  const formOldPasswordRef = useRef();
  const formPasswordRef = useRef();
  const formRePasswordRef = useRef();

  const [focused, setFocused] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [password, setPassword] = useState("");

  const [passtype, setPassType] = useState("password");
  const [passtype1, setPassType1] = useState("password");
  const [passtype2, setPassType2] = useState("password");

  const navigate = useNavigate();

  function onChange(e) {
    setPassword(e.target.value);
  }

  const checkPassword = (e) => {
    if (password !== e.target.value) {
      e.target.setCustomValidity("Passwords don't match!"); //forcefully set the :invalid pseudo CSS
      setFocused(true);
      setErrorMessage("Passwords don't match!");
    } else {
      e.target.setCustomValidity(""); //restores :valid pseudo CSS
      setErrorMessage("");
      setFocused(false);
    }
  };

  const checkOldPassword = async (e) => {
    // console.log(e.target.value);
    const enteredEmail = JSON.parse(localStorage.getItem("user")).email;
    const enteredOldPassword = e.target.value;

    try {
      await axios.post(`/api/wpm/checkpasswd/`, {
        email: enteredEmail,
        oldpassword: enteredOldPassword,
      });

      setPasswordMessage("");
      setFocused(false);
    } catch (err) {
      setPasswordMessage("Wrong password");
      setFocused(true);
    }
  };

  async function submitHandler(e) {
    e.preventDefault();

    const enteredEmail = JSON.parse(localStorage.getItem("user")).email;
    const enteredPassword = formPasswordRef.current.value;
    const enteredOldPassword = formOldPasswordRef.current.value;

    try {
      const response = await axios.post("/api/wpm/passwd", {
        email: enteredEmail,
        password: enteredPassword,
        oldpassword: enteredOldPassword,
      });

      if (!response.data.valid) {
        setErrorMessage("Change password unsuccessful");
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container fluid>
      <NavBar />
      <Row>
        <Col sm={4} className="m-auto mt-5">
          <Card style={{ backgroundColor: "#3b2113" }}>
            <Card.Header className="card-header text-center text-black">
              <h3 className="text-white">Change Password</h3>
            </Card.Header>
            {}
            <Card.Body>
              <Form onSubmit={submitHandler}>
                <Row className="mt-3">
                  <Col lg={true}>
                    <Form.Group className="mb-3 text-white">
                      <Form.Label>Old Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={passtype}
                          placeholder="Old password"
                          ref={formOldPasswordRef}
                          required
                          onBlur={checkOldPassword}
                        />
                        <InputGroup.Text>
                          <FontAwesomeIcon
                            style={{ cursor: "pointer" }}
                            icon={passtype !== "password" ? faEyeSlash : faEye}
                            onClick={() => {
                              setPassType(
                                passtype === "password" ? "text" : "password"
                              );
                            }}
                          />
                        </InputGroup.Text>
                      </InputGroup>
                      <span className="spanerror">{passwordMessage}</span>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={true}>
                    <Form.Group className="mb-3 text-white">
                      <Form.Label>New Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={passtype1}
                          placeholder="New password"
                          ref={formPasswordRef}
                          required
                          onChange={onChange}
                        />
                        <InputGroup.Text>
                          <FontAwesomeIcon
                            style={{ cursor: "pointer" }}
                            icon={passtype1 !== "password" ? faEyeSlash : faEye}
                            onClick={() => {
                              setPassType1(
                                passtype1 === "password" ? "text" : "password"
                              );
                            }}
                          />
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
                <Col lg={true}>
                  <Form.Group className="mb-3 text-white">
                    <Form.Label>Re-type Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={passtype2}
                        placeholder="Re-type password"
                        ref={formRePasswordRef}
                        onBlur={checkPassword}
                        focused={focused.toString()}
                        required
                      />
                      <InputGroup.Text>
                        {" "}
                        <FontAwesomeIcon
                          style={{ cursor: "pointer" }}
                          icon={passtype2 !== "password" ? faEyeSlash : faEye}
                          onClick={() => {
                            setPassType2(
                              passtype2 === "password" ? "text" : "password"
                            );
                          }}
                        />
                      </InputGroup.Text>
                    </InputGroup>
                    <span className="spanerror">{errorMessage}</span>
                  </Form.Group>
                </Col>

                <Row className="mt-5">
                  <Col sm={6}></Col>
                  <Col sm={6}>
                    <div className="d-grid">
                      <Button
                        style={{
                          padding: "8px",
                          borderRadius: "15px",
                          backgroundColor: "#B3C5D7",
                        }}
                        variant="light"
                        type="submit"
                      >
                        Submit
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
