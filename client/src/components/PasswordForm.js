import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function PasswordForm() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formUsernameRef = useRef();
  const formPasswordRef = useRef();
  const formRePasswordRef = useRef();
  const formUrlRef = useRef();
  const formRemarksRef = useRef();

  const [error, setError] = useState(null);
  const [file, setFile] = useState("");
  const [message, setMessage] = useState("");

  const [focused, setFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [password, setPassword] = useState("");

  const handleFocus = async (e) => {
    setFocused(true);
    setErrorMessage("Invalid email");
    try {
      //   const response = await axios.get("/api/wpm/user/" + e.target.value);
      //   if (response.data.duplicate) {
      //     e.target.setCustomValidity("Invalid field."); //forcefully set the :invalid pseudo CSS
      //     setFocused(true);
      //     setErrorMessage("Email already registered!");
      //   } else {
      //     e.target.setCustomValidity(""); //restores :valid pseudo CSS
      //   }
    } catch (error) {
      console.log(error);
    }
  };

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

  //   const onChange = (e) => {
  //     setFile(e.target.files[0]);

  //     setFilePreview(URL.createObjectURL(e.target.files[0]));

  //     // Image preview
  //     const reader = new FileReader();
  //     reader.onload = function (e) {
  //       reader.readAsDataURL(e.target.files[0]);

  //       return true;
  //     };
  //   };

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

      console.log(response.data);

      setMessage("New record saved");
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
    }
    setShow(false);
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow} style={{ margin: 10 }}>
        New Password
      </Button>

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
                  onBlur={handleFocus}
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
