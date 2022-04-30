import React, { useState } from "react";
import { Modal, Row, Col, Button, Form, Card } from "react-bootstrap";

function AddressPartial({ address, handleDelete, handleUpdate }) {
  const address_id = address?.unique_id || "";
  const [street, setStreet] = useState(address?.street || "");
  const [state, setState] = useState(address?.state || "");
  const [city, setCity] = useState(address?.city || "");
  const [pincode, setPincode] = useState(address?.pincode || "");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("FORM SUBMITTED", {
      unique_id: address_id,
      street: street,
      state: state,
      city: city,
      pincode: pincode,
    });

    handleUpdate(address_id, {
      street: street,
      state: state,
      city: city,
      pincode: pincode,
    });
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Street</Form.Label>
            <Form.Control
              placeholder="Enter street"
              value={street}
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
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>City:</Form.Label>
              <Form.Control
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Pincode: </Form.Label>
              <Form.Control
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </Form.Group>
          </Row>
          <Button variant="light" className="text-dark" type="submit">
            <i className="fa-solid fa-pen-to-square"></i> Save
          </Button>
          <Button
            variant="light"
            className="text-danger"
            onClick={() => handleDelete(address.unique_id)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default AddressPartial;
