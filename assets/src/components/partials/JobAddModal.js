import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";

function JobAddModal({ show, setShow, handleRefresh, token }) {
  const [companyName, setCompanyName] = useState("");
  const [role, setJobRole] = useState("");
  const [exp, setExp] = useState("");

  const handleClose = () => {
    setShow(false);
    handleRefresh();
  };

  const submitFormData = async () => {
    try {
      const responseData = await axios.post(
        "/api/jobs/",
        {
          company_name: companyName,
          job_role: role,
          years_of_experience: exp,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    submitFormData();
    handleClose();
    console.log("FORM SUBMITTED", {
      company_name: companyName,
      job_role: role,
      years_of_experience: exp,
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add bank details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Company name:</Form.Label>
            <Form.Control
              placeholder="Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Job role:</Form.Label>
              <Form.Control
                placeholder="Enter job role"
                value={role}
                onChange={(e) => setJobRole(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Years of experience:</Form.Label>
              <Form.Control
                placeholder="Enter exp"
                value={exp}
                onChange={(e) => setExp(e.target.value)}
              />
            </Form.Group>
          </Row>
          <Button variant="light" className="text-dark" type="submit">
            <i className="fa-solid fa-pen-to-square"></i> Save
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default JobAddModal;
