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

function AddressAddModal({ show, setShow, handleRefresh, token }) {
  const [street, setStreet] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const handleClose = () => {
    setShow(false);
    handleRefresh();
  };

  const submitFormData = async () => {
    try {
      const responseData = await axios.post(
        "/api/address/",
        {
          street: street,
          state: state,
          city: city,
          pincode: pincode,
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
      street: street,
      state: state,
      city: city,
      pincode: pincode,
      token: token,
    });
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add address details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Street</Form.Label>
            <Form.Control
              placeholder="Enter street"
              value={street}
              required
              onChange={(e) => setStreet(e.target.value)}
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Control
                placeholder="Enter state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>City:</Form.Label>
              <Form.Control
                placeholder="Enter city"
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Pincode: </Form.Label>
              <Form.Control
                placeholder="Enter pincode"
                value={pincode}
                required
                onChange={(e) => setPincode(e.target.value)}
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

export default AddressAddModal;
