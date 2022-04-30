import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BankPartial from "../partials/BankPartial";
import BankAddModal from "../partials/BankAddModal";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import JobPartial from "../partials/JobPartial";
import JobAddModal from "../partials/JobAddModal";

function JobDetails() {
  const [token, setToken] = useState("");
  const [jobList, setJobList] = useState([]);
  const [show, setShow] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const handleRefresh = () => {
    refresh ? setRefresh(false) : setRefresh(true);
  };

  const getJobs = async () => {
    const userTokens = JSON.parse(localStorage.getItem("userTokens"));
    if (!userTokens?.access) {
      navigate("/login");
    }
    const token = userTokens.access;
    setToken(token);
    try {
      const responseData = await axios.get("/api/jobs/", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const jobData = responseData.data.data;
      setJobList(jobData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    console.log("DELETE ITEM ===>", id);
    try {
      const responseData = await axios.delete(`/api/jobs/${id}/`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    } catch (error) {
      console.log(error);
    }
    getJobs();
  };
  const handleUpdate = async (id, data) => {
    try {
      const responseData = await axios.patch(`/api/jobs/${id}/`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    } catch (error) {
      console.log(error);
    }
    getJobs();
  };

  useEffect(() => {
    getJobs();
  }, [refresh]);

  return (
    <Container className="my-3">
      <Card>
        <Card.Header as="h5">
          Jobs:
          <Button variant="primary" onClick={() => setShow(true)}>
            Add job
          </Button>
        </Card.Header>
        <Card.Body>
          {!!jobList.length &&
            jobList.map((item, index) => (
              <JobPartial
                job={item}
                key={index}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
              />
            ))}
        </Card.Body>
      </Card>
      {show && (
        <JobAddModal
          show={show}
          setShow={setShow}
          token={token}
          handleRefresh={handleRefresh}
        />
      )}
    </Container>
  );
}

export default JobDetails;
