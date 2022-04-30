import React, { useState } from "react";
import { Modal, Row, Col, Button, Form, Card } from "react-bootstrap";

function JobPartial({ job, handleDelete, handleUpdate }) {
  const jobId = job?.id;
  const [companyName, setCompanyName] = useState(job.company_name);
  const [role, setJobRole] = useState(job.job_role);
  const [exp, setExp] = useState(job.years_of_experience);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("FORM SUBMITTED===>", {
      id: jobId,
      company_name: companyName,
      job_role: role,
      years_of_experience: exp,
    });
    handleUpdate(jobId, {
      company_name: companyName,
      job_role: role,
      years_of_experience: exp,
    });
  };

  return (
    <Card>
      <Card.Body>
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
          <Button
            variant="light"
            className="text-danger"
            onClick={() => handleDelete(job.id)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default JobPartial;
