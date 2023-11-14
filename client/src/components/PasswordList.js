import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

import { Breakpoint } from "react-socks"; //added: 21-Oct-23 by GAG

import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import PasswordForm from "./PasswordForm";

import { usePasswordsContext } from "../hooks/usePasswordsContext";
import Button from "react-bootstrap/esm/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEraser,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { auto } from "async";

function PasswordList() {
  const { passwords, dispatch } = usePasswordsContext();

  const [editshow, setShow] = useState(false);
  const [passtype, setPassType] = useState("password");
  const [passtype1, setPassType1] = useState("password");

  const handleClose = () => setShow(false);

  const formUsernameRef = useRef();
  const formPasswordRef = useRef();
  const formRePasswordRef = useRef();

  const formUrlRef = useRef();
  const formRemarksRef = useRef();

  const [error, setError] = useState(null);

  const [focused] = useState(false);
  const [passwordMessage] = useState("");

  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [pwid, setPwId] = useState("");
  const [delshow, setDelShow] = useState(false);
  const [pwidx, setPwIdx] = useState(null);

  useEffect(() => {
    const fetchPasswords = async () => {
      setIsLoading(true);
      try {
        const email = JSON.parse(localStorage.getItem("user")).email;
        // console.log(email);
        const response = await axios.get("/api/wpm/allpasswords/" + email);

        // console.log("Client side: ", response.data);
        dispatch({ type: "SET_PASSWORDS", payload: response.data }); //now using 'dispatch' for global state management -- 19-Oct-23
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };

    fetchPasswords();
  }, [dispatch]);

  const handleClick = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleDelClose = () => setDelShow(false);
  // const handleEditClose = () => setUndercons(false);

  const handleDelConfirm = async () => {
    // console.log("Clicked Confirm Delete button");
    try {
      const response = await axios.delete(`/api/wpm/${pwid}`);
      dispatch({ type: "DELETE_PASSWORD", payload: pwid });
      // console.log(response);
    } catch (err) {
      console.log(err);
    }
    handleDelClose();
  };

  const handleClickEdit = (id, idx) => {
    // console.log("Clicked Edit button on ID: ", id);
    setShow(true);
    setPwId(id);
    setPwIdx(idx);
  };

  async function submitHandler(e) {
    e.preventDefault();

    const enteredUsername = formUsernameRef.current.value;
    const enteredPassword = formPasswordRef.current.value;
    const enteredUrl = formUrlRef.current.value;
    const enteredRemarks = formRemarksRef.current.value;

    const formData = {
      username: enteredUsername,
      password: enteredPassword,
      url: enteredUrl,
      remarks: enteredRemarks,
    };

    try {
      const response = await axios.patch(`/api/wpm/${pwid}`, formData); //use PATCH to update and pass on the object ID of the record to change: Gilberto/11-Nov-23
      dispatch({ type: "UPDATE_PASSWORD", payload: [pwidx, response.data] }); //pass as payload the index of the array to update and the updated data as returned by the backend: Gilberto/11-Nov-23

      // console.log(response.data);

      // navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
    }
    setShow(false);
  }

  const handleClickDelete = (id) => {
    // console.log("ID to be deleted: ", id);
    setDelShow(true);
    setPwId(id);
  };
  const NoPassswords = () => {
    return (
      <div>
        <Container
          style={{
            width: "18rem",
            marginRight: { auto },
            marginLeft: { auto },
          }}
        >
          <Card>
            <Card.Body>
              <Card.Subtitle style={{ textAlign: "center", padding: 10 }}>
                No passwords to display
              </Card.Subtitle>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  };
  const ShowPasswords = () => {
    return (
      <div>
        <Row>
          {passwords &&
            passwords.map((pw, idx) => {
              return (
                <Col key={idx}>
                  <Card style={{ marginBottom: 5 }} bg={"dark"} text={"white"}>
                    <Card.Header style={{ textAlign: "right" }}>
                      <h3>{idx + 1}</h3>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text>Username: {pw.username}</Card.Text>
                      <Card.Text>
                        Password: {showPassword ? pw.password : "************"}
                      </Card.Text>
                      <Card.Text>URL: {pw.url}</Card.Text>
                      <Card.Text>Remarks: {pw.remarks}</Card.Text>

                      <FontAwesomeIcon
                        icon={faEraser}
                        className="text-danger"
                        style={{
                          fontSize: "16px",
                          cursor: "pointer",
                          float: "right",
                        }}
                        onClick={() => handleClickDelete(pw._id)}
                      />
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="text-primary"
                        style={{
                          fontSize: "16px",
                          marginRight: "5px",
                          cursor: "pointer",
                          float: "right",
                        }}
                        onClick={() => handleClickEdit(pw._id, idx)} //pass back the Object ID of the record to update and the index of the array to update: Gilberto/11-Nov-23
                      />
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </div>
    );
  };
  return (
    <Container>
      <Row>
        <Col>
          <PasswordForm />
        </Col>
        <Col>
          <Breakpoint small down>
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="text-warning"
              style={{
                fontSize: "30px",
                margin: "5px",
                cursor: "pointer",
                float: "right",
              }}
              onClick={handleClick}
            />
          </Breakpoint>
          <Breakpoint medium up>
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="text-warning"
              style={{
                fontSize: "30px",
                margin: "5px",
                cursor: "pointer",
                float: "right",
              }}
              onClick={handleClick}
            />
          </Breakpoint>
        </Col>
      </Row>
      <Container>
        <Modal
          show={delshow}
          onHide={handleDelClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this record?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDelClose}>
              No
            </Button>
            <Button variant="primary" onClick={() => handleDelConfirm()}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      <Container>
        <Modal className="edit-pass-modal" show={editshow} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={submitHandler}>
              <Col lg={true}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="username"
                    ref={formUsernameRef}
                    required
                    focused={focused.toString()}
                  />
                  <span className="newpass-error">{passwordMessage}</span>
                </Form.Group>
              </Col>
              <Col lg={true}>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
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
                            passtype === "password" ? "text" : "password"
                          );
                        }}
                      />
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col lg={true}>
                <Form.Group className="mb-3" controlId="formRePassword">
                  <Form.Label>Re-type Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={passtype1}
                      placeholder="Re-type password"
                      ref={formRePasswordRef}
                      focused={focused.toString()}
                      required
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

                  <span className="newpass-error">{passwordMessage}</span>
                </Form.Group>
                <Col lg={true}>
                  <Form.Group className="mb-3" controlId="formFirstname">
                    <Form.Label>URL</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="url"
                      ref={formUrlRef}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col lg={true}>
                  <Form.Group className="mb-3" controlId="formLastname">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="remarks"
                      ref={formRemarksRef}
                      required
                    />
                  </Form.Group>
                </Col>
              </Col>

              {error}
              <Button
                style={{
                  padding: "8px",
                  borderRadius: "15px",
                  backgroundColor: "#B3C5D7",
                  width: "30%",
                  float: "right",
                }}
                variant="light"
                type="submit"
              >
                Submit
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </Container>

      {isLoading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div>{passwords.length > 0 ? <ShowPasswords /> : <NoPassswords />}</div>
        // <ShowPasswords />
      )}
    </Container>
  );
}

export default PasswordList;
