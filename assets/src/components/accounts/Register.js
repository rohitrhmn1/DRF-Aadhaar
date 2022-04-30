import axios from "axios";
import React, { useState } from "react";
import { Card, Form, FormControl, Container, Button } from "react-bootstrap";

function Register() {
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const submitData = async () => {
    const responseData = await axios.post("/api/auth/register/", {
      username: username,
      password1: password1,
      password2: password2,
    });

    const userTokens = responseData.data.data;
    localStorage.setItem("userTokens", JSON.stringify(userTokens));
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("FORM SUBMIT DATA====>", {
      username: username,
      password1: password1,
      password2: password2,
    });

    submitData();
  };
  return (
    <Container>
      <Card>
        <Card.Header>Register</Card.Header>
        <Card.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Enter username</Form.Label>
              <FormControl
                type="username"
                required
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password1">
              <Form.Label>Enter password</Form.Label>
              <FormControl
                type="password"
                required
                placeholder="Enter password"
                autoComplete="new-password"
                onChange={(e) => setPassword1(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password2">
              <Form.Label>Confirm password</Form.Label>
              <FormControl
                type="password"
                required
                placeholder="Confirm password"
                autoComplete="new-password"
                onChange={(e) => setPassword2(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Register;
