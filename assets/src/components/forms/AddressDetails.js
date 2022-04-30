import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import AddressPartial from "../partials/AddressPartial";
import AddressAddModal from "../partials/AddressAddModal";

function AddressDetails() {
  var navigate = useNavigate();
  const [token, setToken] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    refresh ? setRefresh(false) : setRefresh(true);
  };

  const getAddress = async () => {
    const userTokens = JSON.parse(localStorage.getItem("userTokens"));
    if (!userTokens?.access) {
      navigate("login");
    }
    const token = userTokens.access;
    setToken(token);
    try {
      const responseData = await axios.get("/api/address/", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const addressData = responseData.data.data;
      setAddressList(addressData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (unique_id) => {
    console.log("DELETE ITEM ===>", unique_id);
    try {
      const responseData = await axios.delete(`/api/address/${unique_id}/`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    } catch (error) {
      console.log(error);
    }
    getAddress();
  };

  const handleUpdate = async (unique_id, data) => {
    try {
      const responseData = await axios.patch(
        `/api/address/${unique_id}/`,
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
    getAddress();
  };

  useEffect(() => {
    getAddress();
  }, [refresh]);

  return (
    <Container className="my-3">
      <Card>
        <Card.Header as="h5">
          Address{" "}
          <Button variant="primary" onClick={() => setShow(true)}>
            Add Address
          </Button>
        </Card.Header>
        <Card.Body>
          {!!addressList.length &&
            addressList.map((item, index) => (
              <AddressPartial
                address={item}
                key={index}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
              />
            ))}
        </Card.Body>
      </Card>
      {show && (
        <AddressAddModal
          show={show}
          setShow={setShow}
          token={token}
          handleRefresh={handleRefresh}
        />
      )}
    </Container>
  );
}

export default AddressDetails;
