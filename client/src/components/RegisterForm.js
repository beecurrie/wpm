import React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";

import Message from "./Message";
import Progress from "./Progress";

import InputGroup from "react-bootstrap/InputGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

export default function RegisterForm() {
  const formEmailRef = useRef();
  const formPasswordRef = useRef();
  const formRePasswordRef = useRef();
  const formLastnameRef = useRef();
  const formFirstnameRef = useRef();

  const [error, setError] = useState(null);
  const [file, setFile] = useState("");
  const [filepreview, setFilePreview] = useState(null);

  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [focused, setFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [password, setPassword] = useState("");

  const [passtype, setPassType] = useState("password");
  const [passtype1, setPassType1] = useState("password");

  const handleFocus = async (e) => {
    setFocused(true);
    setErrorMessage("Invalid email");
    try {
      const response = await axios.get("/api/wpm/user/" + e.target.value);

      if (response.data.duplicate) {
        e.target.setCustomValidity("Invalid field."); //forcefully set the :invalid pseudo CSS
        setFocused(true);
        setErrorMessage("Email already registered!");
      } else {
        e.target.setCustomValidity(""); //restores :valid pseudo CSS
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkPassword = (e) => {
    if (password.val !== e.target.value) {
      e.target.setCustomValidity("Invalid field."); //forcefully set the :invalid pseudo CSS
      setFocused(true);
      setPasswordMessage("Passwords don't match!");

      console.log("password mismatch");
    } else {
      e.target.setCustomValidity(""); //restores :valid pseudo CSS
      setPasswordMessage("");
      setFocused(false);
    }
  };

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0])); //this stuffs the filePreview state variable which is then used as the img src in the preview section
  };

  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();
    setSubmitting(true);

    const enteredEmail = formEmailRef.current.value;
    const enteredPassword = formPasswordRef.current.value;
    const enteredLastname = formLastnameRef.current.value;
    const enteredFirstname = formFirstnameRef.current.value;

    //Create Formdata - did this due to the addition of file in the submission of data
    const formData = new FormData();
    formData.append("email", enteredEmail);
    formData.append("password", enteredPassword);
    formData.append("lastname", enteredLastname);
    formData.append("firstname", enteredFirstname);

    formData.append("file", file);

    try {
      const response = await axios.post("/api/wpm/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        },
      });

      // console.log("response: ", response.data);

      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
    }
  }

  return (
    <div>
      <Container className="registration-container">
        <Nav.Item>
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
        </Nav.Item>
        <Card className="reg-box-card">
          <Card.Body>
            {message ? <Message msg={message} /> : null}

            <img
              className="profile-icon"
              src="../user.png"
              alt="profile icon"
            />

            <Card.Title className="text-center text-white">
              <h3 style={{ marginTop: "-3%" }}>User Registration</h3>
            </Card.Title>
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3 text-white" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="email"
                  ref={formEmailRef}
                  required
                  onBlur={handleFocus}
                  focused={focused.toString()}
                />
                <span className="spanerror">{errorMessage}</span>
              </Form.Group>
              <Form.Group className="mb-3 text-white" controlId="formFirstname">
                <Form.Label>Firstname</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="firstname"
                  ref={formFirstnameRef}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3 text-white" controlId="formLastname">
                <Form.Label>Lastname</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="lastname"
                  ref={formLastnameRef}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3 text-white" controlId="formLastname">
                <Form.Label>Password</Form.Label>
                <InputGroup
                  className="mb-3 text-white"
                  controlId="formPassword"
                >
                  <Form.Control
                    type={passtype}
                    placeholder="Password"
                    ref={formPasswordRef}
                    required
                    onChange={(e) => setPassword({ val: e.target.value })}
                  />
                  <InputGroup.Text>
                    <FontAwesomeIcon
                      style={{ cursor: "pointer" }}
                      icon={passtype !== "password" ? faEyeSlash : faEye}
                      onClick={() => {
                        setPassType(
                          passtype == "password" ? "text" : "password"
                        );
                      }}
                    />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Form.Group
                className="mb-3 text-white"
                controlId="formRePassword"
              >
                <Form.Label>Re-type Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={passtype1}
                    placeholder="Re-type password"
                    ref={formRePasswordRef}
                    pattern={password.val}
                    onBlur={checkPassword}
                    focused={focused.toString()}
                    required
                  />

                  <InputGroup.Text>
                    <FontAwesomeIcon
                      style={{ cursor: "pointer" }}
                      icon={passtype1 !== "password" ? faEyeSlash : faEye}
                      onClick={() => {
                        setPassType1(
                          passtype1 == "password" ? "text" : "password"
                        );
                      }}
                    />
                  </InputGroup.Text>
                </InputGroup>
                <span className="spanerror">{passwordMessage}</span>
              </Form.Group>

              <Row>
                <Col lg={filepreview ? 10 : 12}>
                  <Form.Group controlId="formFile" className="mb-3 text-white">
                    <Form.Label>Upload Photo</Form.Label>
                    <Form.Control type="file" onChange={onChange} />
                  </Form.Group>
                </Col>

                {filepreview && (
                  <Col lg={1}>
                    <img
                      className="imagePreview "
                      src={filepreview}
                      alt="preview"
                    />
                  </Col>
                )}
              </Row>
              {submitting && <Progress percentage={uploadPercentage} />}
              <div style={{ color: "yellow" }}>{error}</div>
              <div className="mt-3 d-grid">
                <Button
                  style={{
                    padding: "8px",
                    borderRadius: "15px",
                    backgroundColor: "#C5D5EA",
                  }}
                  variant="light"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
        <div>
          <Row className="mt-2">
            <Col lg={true} className="mb-3">
              <Nav.Item>
                <Nav.Link className="reg-text" href="/login">
                  Already have an account? SIGN IN HERE
                </Nav.Link>
              </Nav.Item>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}
