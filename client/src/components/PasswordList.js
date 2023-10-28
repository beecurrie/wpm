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

import PasswordForm from "./PasswordForm";

import { usePasswordsContext } from "../hooks/usePasswordsContext";
import Button from "react-bootstrap/esm/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEraser } from "@fortawesome/free-solid-svg-icons";
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
        <Breakpoint small down>
          {passwords &&
            passwords.map((pw, idx) => {
              return (
                <Card style={{ marginBottom: 5 }} key={idx}>
                  <Card.Body>
                    <Card.Title>
                      {idx + 1}. Username: {pw.username}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Password: {showPassword ? pw.password : "************"}
                    </Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">
                      URL: {pw.url}
                    </Card.Subtitle>
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
              );
            })}
        </Breakpoint>
        <Breakpoint large up>
          {passwords && (
            <Table striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username </th>
                  <th>Password</th>
                  <th>URL</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {passwords.map((pw, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{pw.username}</td>
                      <td>{showPassword ? pw.password : "************"}</td>
                      <td>{pw.url}</td>
                      <td>{pw.remarks}</td>
                      <td>
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-primary"
                          style={{
                            fontSize: "16px",
                            marginRight: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleClickEdit(pw.id)}
                        />
                        <FontAwesomeIcon
                          icon={faEraser}
                          className="text-danger"
                          style={{ fontSize: "16px", cursor: "pointer" }}
                          onClick={() => handleClickDelete(pw._id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Breakpoint>
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
            <Button
              onClick={handleClick}
              style={{ margin: 10, float: "right" }}
              variant="warning"
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </Breakpoint>
          <Breakpoint medium up>
            <Button
              onClick={handleClick}
              style={{ margin: 10, float: "right" }}
              variant="warning"
            >
              {showPassword ? "Hide" : "Show"} Passwords
            </Button>
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
