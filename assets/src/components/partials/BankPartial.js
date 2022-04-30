import React, { useState } from "react";
import { Modal, Row, Col, Button, Form, Card } from "react-bootstrap";

function BankPartial({ bank, handleDelete, handleUpdate }) {
  const bankId = bank?.id;
  const [accountNumber, setAccountNumber] = useState(bank?.account_number);
  const [bankName, setBankName] = useState(bank?.bank_name);
  const [ifsc, setIfsc] = useState(bank?.ifsc);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("FORM SUBMITTED===>", {
      id: bankId,
      account_number: accountNumber,
      bank_name: bankName,
      ifsc_code: ifsc,
    });
    handleUpdate(bankId, {
      account_number: accountNumber,
      bank_name: bankName,
      ifsc_code: ifsc,
    });
  };

  return (
    <Card>
      <Card.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Account number:</Form.Label>
            <Form.Control
              placeholder="Enter street"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Bank name:</Form.Label>
              <Form.Control
                placeholder="Enter bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>IFSC:</Form.Label>
              <Form.Control
                placeholder="Enter ifsc"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
              />
            </Form.Group>
          </Row>
          <Button variant="light" className="text-dark" type="submit">
            <i className="fa-solid fa-pen-to-square"></i> Save
          </Button>
          <Button
            variant="light"
            className="text-danger"
            onClick={() => handleDelete(bank.id)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default BankPartial;
