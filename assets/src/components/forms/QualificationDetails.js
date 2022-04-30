import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import QualificationPartial from "../partials/qualificationPartial";
import QualificationAddModal from "../partials/QualificationAddModal";

function QualificationDetails() {
  var navigate = useNavigate();
  const [token, setToken] = useState("");
  const [qualificationList, setQualificationList] = useState([]);
  const [show, setShow] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const handleRefresh = () => {
    refresh ? setRefresh(false) : setRefresh(true);
  };

  const getQualification = async () => {
    const userTokens = JSON.parse(localStorage.getItem("userTokens"));
    if (!userTokens?.access) {
      navigate("/login");
    }
    const token = userTokens.access;
    setToken(token);
    try {
      const responseData = await axios.get("/api/qualifications/", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const qualificationData = responseData.data.data;
      setQualificationList(qualificationData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    console.log("DELETE ITEM ===>", id);
    try {
      const responseData = await axios.delete(`/api/qualifications/${id}/`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    } catch (error) {
      console.log(error);
    }
    getQualification();
  };
  const handleUpdate = async (id, data) => {
    try {
      const responseData = await axios.patch(
        `/api/qualifications/${id}/`,
        data,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    getQualification();
  };

  useEffect(() => {
    getQualification();
  }, [refresh]);

  return (
    <Container className="my-3">
      <Card>
        <Card.Header as="h5">
          Qualification:
          <Button variant="primary" onClick={() => setShow(true)}>
            Add Qualification
          </Button>
        </Card.Header>
        <Card.Body>
          {!!qualificationList.length &&
            qualificationList.map((item, index) => (
              <QualificationPartial
                qualification={item}
                key={index}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
              />
            ))}
        </Card.Body>
      </Card>
      {show && (
        <QualificationAddModal
          show={show}
          setShow={setShow}
          token={token}
          handleRefresh={handleRefresh}
        />
      )}
    </Container>
  );
}

export default QualificationDetails;
