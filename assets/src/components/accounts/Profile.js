import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import { Container, Row, Col, Card, Button } from "react-bootstrap";
import ProfilePartial from "../partials/ProfilePartial";

function Profile() {
  const [userDetails, setUserDetails] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [showAddressModal, setShowAddressModal] = useState(false);

  const [token, setToken] = useState("");
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    refresh ? setRefresh(false) : setRefresh(true);
  };

  var navigate = useNavigate();

  const getProfile = async () => {
    const userTokens = JSON.parse(localStorage.getItem("userTokens"));
    if (!userTokens?.access) {
      navigate("login");
    }
    const token = userTokens.access;
    setToken(token);
    try {
      const responseData = await axios.get("/api/auth/profile/", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const profileData = responseData.data.data;
      setUserDetails(profileData);
      console.log(profileData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, [refresh]);

  return (
    Object.keys(userDetails).length && (
      <Container className="my-3">
        <Row>
          <Card>
            <Card.Body>
              <Row className="mb-3">
                <Col md={4}>
                  <div className="d-flex flex-column text-center align-items-center">
                    <img
                      className="rounded-circle my-3"
                      src={
                        userDetails?.image || "../../../static/img/person.png"
                      }
                      alt=""
                      width={"150px"}
                    />
                  </div>
                </Col>
                <Col md={8}>
                  <Card.Text>
                    <span className="fw-bold">Aadhaar number: </span>
                    {userDetails?.aadhaar?.number}
                  </Card.Text>
                  <Card.Text>
                    <span className="fw-bold">Name: </span>
                    {userDetails.name}
                  </Card.Text>
                  <Card.Text>
                    <span className="fw-bold">Date of birth: </span>
                    {userDetails.date_of_birth}
                  </Card.Text>
                  <Card.Text>
                    <span className="fw-bold">Blood group: </span>
                    {userDetails.blood_group}
                  </Card.Text>
                  <Card.Text>
                    <span className="fw-bold">Gender: </span>
                    {userDetails.gender}
                  </Card.Text>
                  <Button
                    variant="light"
                    className="text-dark"
                    onClick={() => setShowProfileModal(true)}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>Edit
                  </Button>
                </Col>
              </Row>

              <Card className="mb-3">
                <Card.Header as="h5">
                  Contact details{" "}
                  <Button variant="light" className="text-dark">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-2">
                    <p className="fw-bold">Email: </p>
                    <Row xs={"auto"} className="gap-2">
                      {userDetails.email?.map((item, index) => (
                        <Col key={index}>
                          <Card body>{item.email}</Card>
                        </Col>
                      ))}
                    </Row>
                  </Row>
                  <Row>
                    <p className="fw-bold">Phone numbers: </p>
                    <Row xs={"auto"} className="gap-2">
                      {userDetails.phone?.map((item, index) => (
                        <Col key={index}>
                          <Card body>{item.phone}</Card>
                        </Col>
                      ))}
                    </Row>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header as="h5">
                  Address details
                  <Button
                    variant="light"
                    className="text-dark"
                    as={Link}
                    to="/address"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Row xs={"auto"} className="gap-2">
                    {userDetails.address?.map((item, index) => (
                      <Col key={index}>
                        <Card>
                          <Card.Body>
                            <Card.Text>
                              <span className="fw-bold">Street: </span>
                              {item.street}
                            </Card.Text>
                            <Card.Text>
                              <span className="fw-bold">State: </span>
                              {item.state}
                            </Card.Text>
                            <Card.Text>
                              <span className="fw-bold">City: </span>
                              {item.city}
                            </Card.Text>
                            <Card.Text>
                              <span className="fw-bold">Pincode: </span>
                              {item.pincode}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header as="h5">
                  Qualification Details
                  <Button
                    variant="light"
                    className="text-dark"
                    as={Link}
                    to="/qualification"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Row xs={"auto"} className="gap-2">
                    {userDetails.qualification?.map((item, index) => (
                      <Col key={index}>
                        <Card>
                          <Card.Body>
                            <Card.Text>
                              <span className="fw-bold">Institution name:</span>
                              {item.institution_name}
                            </Card.Text>
                            <Card.Text>
                              <span className="fw-bold">Year of passing: </span>
                              {item.year_of_passing}
                            </Card.Text>
                            <Card.Text>
                              <span className="fw-bold">Percentage: </span>
                              {item.percentage}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header as="h5">
                  Past Job Experience Details
                  <Button
                    variant="light"
                    className="text-dark"
                    as={Link}
                    to="/job"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Row xs={"auto"} className="gap-2">
                    {userDetails.past_job_experience?.map((item, index) => (
                      <Col key={index}>
                        <Card>
                          <Card.Body>
                            <Card.Text>
                              <span className="fw-bold">Company name: </span>
                              {item.company_name}
                            </Card.Text>
                            <Card.Text>
                              <span className="fw-bold">Job role: </span>
                              {item.job_role}
                            </Card.Text>
                            <Card.Text>
                              <span className="fw-bold">
                                Years of experience:
                              </span>
                              {item.years_of_experience}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header as="h5">
                  Bank Details
                  <Button
                    variant="light"
                    className="text-dark"
                    as={Link}
                    to="/bank"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Row xs={"auto"} className="gap-2">
                    {userDetails.bank?.map((item, index) => (
                      <Col key={index}>
                        <Card>
                          <Card.Body>
                            <Card.Text>
                              <span className="fw-bold">Account number: </span>
                              {item.account_number}
                            </Card.Text>
                            <Card.Text>
                              <span className="fw-bold">Bank name: </span>
                              {item.bank_name}
                            </Card.Text>
                            <Card.Text>
                              <span className="fw-bold">IFSC: </span>
                              {item.ifsc_code}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Row>
        {showProfileModal && (
          <ProfilePartial
            show={showProfileModal}
            setShow={setShowProfileModal}
            handleRefresh={handleRefresh}
            profileDetails={userDetails}
            token={token}
          />
        )}
      </Container>
    )
  );
}

export default Profile;
