import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Breakpoint } from "react-socks"; //added: 21-Oct-23 by GAG

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

import { usePasswordsContext } from "../hooks/usePasswordsContext";

function PasswordForm() {
  const { passwords, dispatch } = usePasswordsContext();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formUsernameRef = useRef();
  const formPasswordRef = useRef();
  const formRePasswordRef = useRef();
  const formUrlRef = useRef();
  const formRemarksRef = useRef();

  const [error, setError] = useState(null);

  const [focused, setFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [password, setPassword] = useState("");

  const checkPassword = (e) => {
    if (password.val !== e.target.value) {
      e.target.setCustomValidity("Invalid field."); //forcefully set the :invalid pseudo CSS
      setFocused(true);
      setPasswordMessage("Passwords don't match!");
    } else {
      e.target.setCustomValidity(""); //restores :valid pseudo CSS
      setFocused(false);
    }
  };

  const navigate = useNavigate();

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
      const response = await axios.post("/api/wpm", formData);
      dispatch({ type: "CREATE_PASSWORD", payload: response.data }); //now using 'dispatch' for global state management -- 19-Oct-23

      console.log(response.data);

      // navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
    }
    setShow(false);
  }

  return (
    <>
      <Breakpoint small down>
        <Button variant="primary" onClick={handleShow} style={{ margin: 10 }}>
          New
        </Button>
      </Breakpoint>
      <Breakpoint medium up>
        <Button variant="primary" onClick={handleShow} style={{ margin: 10 }}>
          New Password
        </Button>
      </Breakpoint>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Password</Modal.Title>
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
                <span className="spanerror">{errorMessage}</span>
              </Form.Group>
            </Col>
            <Col lg={true}>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  ref={formPasswordRef}
                  required
                  onChange={(e) => setPassword({ val: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col lg={true}>
              <Form.Group className="mb-3" controlId="formRePassword">
                <Form.Label>Re-type Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Re-type password"
                  ref={formRePasswordRef}
                  pattern={password.val}
                  onBlur={checkPassword}
                  focused={focused.toString()}
                  required
                />
                <span className="spanerror">{passwordMessage}</span>
              </Form.Group>
            </Col>

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

            {error}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

export default PasswordForm;
