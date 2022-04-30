import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  FormControl,
  Button,
  Form,
  Alert,
} from "react-bootstrap";

import axios from "axios";

function Search() {
  const [aadhaar, setAadhaar] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [activeStatus, setActiveStatus] = useState(0);

  const handleSearch = async () => {
    try {
      const responseData = await axios.get(
        `/api/search/?aadhaar=${aadhaar}&filter_active=${activeStatus}`
      );
      const searchResult = responseData.data;
      setUserDetails(searchResult.data);
      setShowResults(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <Container md={8} className="my-3">
      <Row className="mb-3">
        <Card>
          <Card.Body>
            <Form onSubmit={handleFormSubmit}>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Enter aadhaar number"
                  aria-label="Enter aadhaar number"
                  aria-describedby="aadhaar-search"
                  onChange={(e) => setAadhaar(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  id="search-btn"
                  type="submit"
                >
                  Search
                </Button>
              </InputGroup>
              <Form.Group as={Col} controlId="filterActiveStatus">
                <Form.Label>Filter Active</Form.Label>
                <Form.Select
                  defaultValue={0}
                  onChange={(e) => setActiveStatus(e.target.value)}
                >
                  <option value={0}>Filter active users</option>
                  <option value={1}>Filter inactive users</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Row>
      {showResults &&
        (Object.keys(userDetails).length ? (
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
                      <span className="fw-bold">Aadhaar Number: </span>
                      {userDetails.aadhaar.number}
                    </Card.Text>

                    <Card.Text>
                      <span className="fw-bold">Active status: </span>
                      {userDetails.is_active ? "Active" : "Inactive"}
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
                  </Col>
                </Row>
                <Row className="mb-3">
                  <h3>Contact details</h3>
                  <hr />
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
                </Row>
                <Row className="mb-3">
                  <h3>Address details</h3>
                  <hr />
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
                </Row>

                <Row className="mb-3">
                  <h3>Qualification Details</h3>
                  <hr />
                  <Row xs={"auto"} className="gap-2">
                    {userDetails.qualification?.map((item, index) => (
                      <Col key={index}>
                        <Card>
                          <Card.Body>
                            <Card.Text>
                              <span className="fw-bold">
                                Institution name:{" "}
                              </span>
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
                </Row>
                <Row className="mb-3">
                  <h3>Past Job Experience Details</h3>
                  <hr />
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
                </Row>
                <Row className="mb-3">
                  <h3>Bank Details</h3>
                  <hr />
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
                </Row>
              </Card.Body>
            </Card>
          </Row>
        ) : (
          <Alert key={"success"} variant={"warning"}>
            No results found
          </Alert>
        ))}
      {false && (false ? <>False</> : <>True</>)}
    </Container>
  );
}

export default Search;

/**
 * 
 * {
    "success": true,
    "detail": "Search details",
    "data": {
        "name": null,
        "username": "rohitrhmn1",
        "date_of_birth": null,
        "gender": "Not specified",
        "date_joined": "2022-04-29T11:31:40.386181+05:30",
        "blood_group": "A+",
        "last_login": "2022-04-29T22:14:58.339063+05:30",
        "unique_id": "908ef7eb-a07f-4063-829e-04a9941fd78f",
        "is_active": true,
        "is_staff": true,
        "is_superuser": true,
        "email": [
            {
                "id": 1,
                "email": "rohitrhmn1@outlook.in"
            },
            {
                "id": 2,
                "email": "rohitrhmn1@yahoo.com"
            },
            {
                "id": 4,
                "email": "test@email.com"
            }
        ],
        "phone": [
            {
                "id": 1,
                "phone": "9876543210"
            },
            {
                "id": 2,
                "phone": "9876543211"
            },
            {
                "id": 3,
                "phone": "9876543212"
            }
        ],
        "address": [
            {
                "unique_id": "1b74e3c6-1bfa-455a-bca0-f391bdb9b622",
                "street": "Some street details",
                "state": "WB",
                "city": "Kolkata",
                "pincode": "700001"
            },
            {
                "unique_id": "401394ec-c472-4302-929a-3800ede35a00",
                "street": "Some street details 2",
                "state": "WB",
                "city": "Kolkata",
                "pincode": "700001"
            }
        ],
        "qualification": [
            {
                "id": 1,
                "institution_name": "SOME INST",
                "year_of_passing": "2022",
                "percentage": "100.00"
            }
        ],
        "past_job_experience": [
            {
                "id": 1,
                "company_name": "SOME ABC",
                "job_role": "Eng",
                "years_of_experience": 4
            }
        ],
        "aadhaar": {
            "number": "304150658087",
            "is_active": true
        },
        "bank": [
            {
                "id": 1,
                "account_number": "1231312312",
                "bank_name": "STATE BANK OF INDIA",
                "ifsc_code": "SBIN1010101"
            }
        ]
    }
}
 */
