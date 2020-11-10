import React from 'react';

import Navbar from 'react-bootstrap/NavBar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChalkboardTeacher, faSignInAlt, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function NavBar(props) {
  return <Navbar expand="lg" variant="dark" fixed="top">
    <Link to="/" className="navbar-brand"><FontAwesomeIcon icon={faChalkboardTeacher} />Seat Booking</Link>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        {props.user !== undefined && props.user !== null ?
          (props.role === "1" ? 
          <><Link to="/" className="nav-link">Booking</Link></>  : 
          <><Link to="/" className="nav-link">Dashboard</Link></>) : ''}
      </Nav>
      <Nav>
        {props.user !== undefined && props.user !== null ?
          <NavDropdown title={<span><FontAwesomeIcon icon={faUser} /> {props.name}</span>} id="collasible-nav-dropdown">
            <NavDropdown.Item href="/#" onClick={() => props.logout()}><FontAwesomeIcon icon={faSignOutAlt} />&nbsp;Logout</NavDropdown.Item>
          </NavDropdown> :<></>}
      </Nav>
    </Navbar.Collapse>
  </Navbar>

}

export default NavBar;