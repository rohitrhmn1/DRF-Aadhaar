import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BankPartial from "../partials/BankPartial";
import BankAddModal from "../partials/BankAddModal";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

function BankDetails() {
  var navigate = useNavigate();
  const [token, setToken] = useState("");
  const [bankList, setBankList] = useState([]);
  const [show, setShow] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const handleRefresh = () => {
    refresh ? setRefresh(false) : setRefresh(true);
  };

  const getBank = async () => {
    const userTokens = JSON.parse(localStorage.getItem("userTokens"));
    if (!userTokens?.access) {
      navigate("/login");
    }
    const token = userTokens.access;
    setToken(token);
    try {
      const responseData = await axios.get("/api/bank/", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const bankData = responseData.data.data;
      setBankList(bankData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    console.log("DELETE ITEM ===>", id);
    try {
      const responseData = await axios.delete(`/api/bank/${id}/`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    } catch (error) {
      console.log(error);
    }
    getBank();
  };
  const handleUpdate = async (id, data) => {
    try {
      const responseData = await axios.patch(`/api/bank/${id}/`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    } catch (error) {
      console.log(error);
    }
    getBank();
  };

  useEffect(() => {
    getBank();
  }, [refresh]);

  return (
    <Container className="my-3">
      <Card>
        <Card.Header as="h5">
          Bank:
          <Button variant="primary" onClick={() => setShow(true)}>
            Add bank
          </Button>
        </Card.Header>
        <Card.Body>
          {!!bankList.length &&
            bankList.map((item, index) => (
              <BankPartial
                bank={item}
                key={index}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
              />
            ))}
        </Card.Body>
      </Card>
      {show && (
        <BankAddModal
          show={show}
          setShow={setShow}
          token={token}
          handleRefresh={handleRefresh}
        />
      )}
    </Container>
  );
}

export default BankDetails;
