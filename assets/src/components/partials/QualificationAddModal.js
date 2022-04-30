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

function QualificationAddModal({ show, setShow, token, handleRefresh }) {
  const [instName, setInstName] = useState("");
  const [yearOfPassing, setYearOfPassing] = useState("");
  const [percent, setPercent] = useState("");

  const handleClose = () => {
    setShow(false);
    handleRefresh();
  };

  const submitFormData = async () => {
    try {
      const responseData = await axios.post(
        "/api/qualifications/",
        {
          institution_name: instName,
          year_of_passing: yearOfPassing,
          percentage: percent,
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
      institution_name: instName,
      year_of_passing: yearOfPassing,
      percentage: percent,
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Institution name:</Form.Label>
              <Form.Control
                placeholder="Enter Institution name"
                value={instName}
                onChange={(e) => setInstName(e.target.value)}
              />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} className="mb-3">
                <Form.Label>year of passing:</Form.Label>
                <Form.Control
                  placeholder="year of passing"
                  value={yearOfPassing}
                  onChange={(e) => setYearOfPassing(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} className="mb-3">
                <Form.Label>Percentage:</Form.Label>
                <Form.Control
                  placeholder="Enter percent"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                />
              </Form.Group>
            </Row>
            <Button variant="light" className="text-dark" type="submit">
              <i className="fa-solid fa-pen-to-square"></i> Save
            </Button>
            <Button
              variant="light"
              className="text-danger"
              onClick={() => handleDelete(qualification.id)}
            >
              <i className="fa-solid fa-trash-can"></i>
            </Button>
          </Form>
        </Modal.Body>
      </Modal.Header>
    </Modal>
  );
}

export default QualificationAddModal;
