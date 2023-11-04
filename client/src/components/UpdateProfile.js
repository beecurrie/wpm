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
import NavBar from "./NavBar";
import Footer from "./Footer";

import Message from "./Message";
import Progress from "./Progress";
import { usePasswordsContext } from "../hooks/usePasswordsContext";

export default function UpdateProfile({
  shownav,
  userdata,
  setUndercons,
  index,
}) {
  // const user = JSON.parse(localStorage.getItem("user")); //get user info from localStorage - not the right way. Get the user from what was clicked to be edited

  const formLastnameRef = useRef(userdata.lastname);
  const formFirstnameRef = useRef(userdata.firstname);

  const [error, setError] = useState(null);
  const [file, setFile] = useState("");
  const [filepreview, setFilePreview] = useState("");

  const [uploadedFile, setUploadedFile] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const { usersList, dispatch } = usePasswordsContext(); //using global state management via context

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0])); //this stuffs the filePreview state variable which is then used as the img src in the preview section
  };

  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();
    setSubmitting(true);

    const enteredLastname = formLastnameRef.current.value;
    const enteredFirstname = formFirstnameRef.current.value;

    console.log("File: ", file);

    //Create Formdata - did this due to the addition of file in the submission of data
    const formData = new FormData();

    formData.append("lastname", enteredLastname);
    formData.append("firstname", enteredFirstname);
    formData.append("file", file);

    try {
      const response = await axios.post(
        "/api/wpm/user/" + userdata.email,
        formData,
        {
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
        }
      );
      if (!shownav) {
        dispatch({
          type: "UPDATE_USER",
          payload: (usersList[index] = response.data),
        }); //now using 'dispatch' for global state management
        setUndercons(false);
      } else {
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/dashboard ", { replace: true });
      }
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
    }
  }

  return (
    <>
      <NavBar />
      <div>
        <Container className="update-profile-container">
          <Card className="update-profile-box">
            <Card.Body>
              {message ? <Message msg={message} /> : null}
              <img
                className="profile-icon"
                src="../user.png"
                alt="profile icon"
              />

              <Card.Title className="text-center text-white">
                <h3 style={{ marginTop: "-3%" }}>Update User Profile</h3>
              </Card.Title>

              <Form onSubmit={submitHandler}>
                <Row>
                  <Col lg={true}>
                    <Form.Group
                      className="mb-3 text-white"
                      controlId="formFirstname"
                    >
                      <Form.Label>Firstname</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={userdata.firstname}
                        ref={formFirstnameRef}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={true}>
                    <Form.Group
                      className="mb-3 text-white"
                      controlId="formLastname"
                    >
                      <Form.Label>Lastname</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={userdata.lastname}
                        ref={formLastnameRef}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col lg={filepreview ? 10 : 12}>
                    <Form.Group
                      controlId="formFile"
                      className="mb-3 text-white"
                    >
                      <Form.Label>Upload Photo</Form.Label>
                      <Form.Control type="file" onChange={onChange} required />
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
        </Container>
      </div>
    </>
  );
}
