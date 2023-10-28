import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import { Breakpoint } from "react-socks"; //added: 21-Oct-23 by GAG

import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";

import PasswordForm from "./PasswordForm";

import { usePasswordsContext } from "../hooks/usePasswordsContext";
import Button from "react-bootstrap/esm/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEraser,
  faCirclePlus,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { auto } from "async";

function PasswordList() {
  const { passwords, dispatch } = usePasswordsContext();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [pwid, setPwId] = useState("");
  const [delshow, setDelShow] = useState(false);

  useEffect(() => {
    const fetchPasswords = async () => {
      setIsLoading(true);
      try {
        const email = JSON.parse(localStorage.getItem("user")).email;
        // console.log(email);
        const response = await axios.get("/api/wpm/allpasswords/" + email);

        console.log("Client side: ", response.data);
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
    console.log("Clicked Confirm Delete button");
    try {
      const response = await axios.delete(`/api/wpm/${pwid}`);
      dispatch({ type: "DELETE_PASSWORD", payload: pwid });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
    handleDelClose();
  };

  const handleClickEdit = (obs_id, user, idx) => {
    console.log("Clicked Edit button");
  };

  const handleClickDelete = (id) => {
    console.log("ID to be deleted: ", id);
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
                <Col>
                  <Card
                    style={{ marginBottom: 5 }}
                    key={idx}
                    bg={"dark"}
                    text={"white"}
                  >
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
                        onClick={() => handleClickEdit(pw.id)}
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
