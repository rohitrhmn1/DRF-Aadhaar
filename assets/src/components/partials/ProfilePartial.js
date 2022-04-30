import axios from "axios";
import React, { useState } from "react";
import { Modal, Row, Col, Button, Form } from "react-bootstrap";

function ProfilePartial({
  show,
  setShow,
  handleRefresh,
  profileDetails,
  token,
}) {
  const handleClose = () => {
    setShow(false);
    handleRefresh();
  };
  const [fullName, setFullName] = useState(profileDetails?.name || "");
  const [gender, setGender] = useState(profileDetails?.gender || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    profileDetails?.date_of_birth || ""
  );
  const [bloodGroup, setBloodGroup] = useState(
    profileDetails?.blood_group || ""
  );

  const submitData = async () => {
    try {
      const responseData = await axios.patch(
        "/api/auth/profile/",
        {
          name: fullName,
          gender: gender,
          date_of_birth: dateOfBirth,
          blood_group: bloodGroup,
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
    console.log("FORM SUBMITTED", {
      fullName: fullName,
      gender: gender,
      dateOfBirth: dateOfBirth,
      bloodGroup: bloodGroup,
    });
    submitData();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Profile details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full name:</Form.Label>
            <Form.Control
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Gender</Form.Label>

              <Form.Select
                defaultValue={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Choose</option>
                <option value="m">Male</option>
                <option value="f">Female</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Date of birth:</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Blood Group: </Form.Label>

              <Form.Select
                onChange={(e) => setBloodGroup(e.target.value)}
                defaultValue={bloodGroup}
              >
                <option value="">Choose</option>
                <option value="A+">A positive</option>
                <option value="A-">A negative</option>
                <option value="B+">B positive</option>
                <option value="B-">B negative </option>
                <option value="O+">O positive</option>
                <option value="O-">O negative</option>
                <option value="AB+">AB positive</option>
                <option value="AB-">AB negative</option>
              </Form.Select>
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

export default ProfilePartial;
