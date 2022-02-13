import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavbarComponent() {
  return (
    <Navbar bg="light" expand="x-lg px-3">
      <Navbar.Brand as={Link} to="/">
        Logo
      </Navbar.Brand>
      <Nav>
        <Nav.Link as={Link} to={"/user"}>
          Profile
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
