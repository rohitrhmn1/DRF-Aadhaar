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
function BankAddModal({ show, setShow, handleRefresh, token }) {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");

  const handleClose = () => {
    setShow(false);
    handleRefresh();
  };

  const submitFormData = async () => {
    try {
      const responseData = await axios.post(
        "/api/bank/",
        {
          bank_name: bankName,
          account_number: accountNumber,
          ifsc_code: ifsc,
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
      bank_name: bankName,
      account_number: accountNumber,
      ifsc_code: ifsc,
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
            <Form.Label>Bank Name:</Form.Label>
            <Form.Control
              placeholder="Enter bank name"
              value={bankName}
              required
              onChange={(e) => setBankName(e.target.value)}
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Account  Number</Form.Label>
              <Form.Control
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>IFSC:</Form.Label>
              <Form.Control
                placeholder="Enter ifsc"
                value={ifsc}
                required
                onChange={(e) => setIfsc(e.target.value)}
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

export default BankAddModal;
