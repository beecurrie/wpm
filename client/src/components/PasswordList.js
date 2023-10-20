import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import PasswordForm from "./PasswordForm";

import { usePasswordsContext } from "../hooks/usePasswordsContext";
import Button from "react-bootstrap/esm/Button";

function PasswordList() {
  const { passwords, dispatch } = usePasswordsContext();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <Container>
      <Row>
        <Col>
          <PasswordForm />
        </Col>
        <Col>
          <Button
            onClick={handleClick}
            style={{ margin: 10, float: "right" }}
            variant="warning"
          >
            {showPassword ? "Hide" : "Show"} Passwords
          </Button>
        </Col>
      </Row>

      {isLoading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Username </th>
              <th>Password</th>
              <th>URL</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {passwords &&
              passwords.map((pw, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{pw.username}</td>
                    <td>{showPassword ? pw.password : "************"}</td>
                    <td>{pw.url}</td>
                    <td>{pw.remarks}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default PasswordList;
