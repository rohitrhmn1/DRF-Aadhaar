import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <Navbar expand="lg" id="navbar" variant="dark" bg="dark">
      <Container fluid>
        <Navbar.Brand to="/" as={NavLink}>
          Aadhaar KYC
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink
              to="/"
              className={(status) =>
                "nav-link" + (status.isActive ? " active" : "")
              }
            >
              Home
            </NavLink>
            <NavLink
              to="login"
              className={(status) =>
                "nav-link" + (status.isActive ? " active" : "")
              }
            >
              Login
            </NavLink>
            <NavLink
              to="register"
              className={(status) =>
                "nav-link" + (status.isActive ? " active" : "")
              }
            >
              Register
            </NavLink>
            <NavLink
              to="profile"
              className={(status) =>
                "nav-link" + (status.isActive ? " active" : "")
              }
            >
              Profile
            </NavLink>
            <NavLink
              to="search"
              className={(status) =>
                "nav-link" + (status.isActive ? " active" : "")
              }
            >
              Search By Aadhaar
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
