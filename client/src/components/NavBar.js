import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChalkboardTeacher, faUser, faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function NavBar(props) {
  return <Navbar expand="lg" variant="dark" fixed="top">
    <Link to="/" className="navbar-brand"><FontAwesomeIcon icon={faChalkboardTeacher} />Seat Booking</Link>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        {props.user !== undefined && props.user !== null ?
          (props.role === "1" ? 
          <><Link to="/" className="nav-link">My Reservations</Link><Link to="/BookingHistory" className="nav-link">Booking</Link></>  :
          props.role === "4" ? 
          <>
          <Link to="/analytics" className="nav-link">Analytics</Link></> : 
          props.role === "3" ? 
          <>
          <Link to="/" className="nav-link">Officer Dashboard</Link></> : 
          <>
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/notification" className="nav-link">
              <FontAwesomeIcon icon={faBell} style={props.notifications.find((n)=>{return n.SentStatus==0})?{ 'color': '#79daad' }:null}/>
            </Link>
            <Link to="/allbookings" className="nav-link">All Bookings</Link>
          </>):''}

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