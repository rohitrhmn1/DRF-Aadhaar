import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

function QualificationPartial({ qualification, handleDelete, handleUpdate }) {
  const qualificationId = qualification?.id;
  const [instName, setInstName] = useState(qualification?.institution_name);
  const [yearOfPassing, setYearOfPassing] = useState(
    qualification?.year_of_passing
  );
  const [percent, setPercent] = useState(qualification?.percentage);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("FORM SUBMITTED===>", {
      id: qualificationId,
      institution_name: instName,
      year_of_passing: yearOfPassing,
      percentage: percent,
    });
    handleUpdate(qualificationId, {
      institution_name: instName,
      year_of_passing: yearOfPassing,
      percentage: percent,
    });
  };

  return (
    <Card>
      <Card.Body>
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
      </Card.Body>
    </Card>
  );
}

export default QualificationPartial;
