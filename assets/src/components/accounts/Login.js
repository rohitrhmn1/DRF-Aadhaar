import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem("userTokens"));
    if (tokens?.access) {
      navigate("/");
    }
  }, []);

  const submitFormData = async () => {
    try {
      const responseData = await axios.post("/api/auth/login/", {
        username: username,
        password: password,
      });
      const tokens = responseData.data.data;
      localStorage.setItem("userTokens", JSON.stringify(tokens));
      console.log(tokens);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
    submitFormData();
  };

  return (
    <Container md={6} className="mt-3">
      <Card>
        <Card.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="username"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
