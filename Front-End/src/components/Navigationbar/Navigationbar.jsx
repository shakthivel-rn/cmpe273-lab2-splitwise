import React, { Component } from 'react';
import '../../App.css';
import './Navigationbar.css';
import cookie from 'react-cookies';
import {
  Navbar, Nav, Button, Dropdown,
} from 'react-bootstrap';
// import { connect } from 'react-redux';
// import { propTypes } from 'react-bootstrap/esm/Image';

class Navigationbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedCookie: cookie.load('cookie'),
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout = () => {
    cookie.remove('cookie', { path: '/' });
    // const { onLogoutUser } = this.props;
    // onLogoutUser();
  }

  render() {
    let navLogin = null;
    const { loadedCookie } = this.state;
    if (loadedCookie) {
      navLogin = (
        <Nav className="ml-auto">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">
              Menu
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/profilepage">Profile Page</Dropdown.Item>
              <Dropdown.Item href="/creategroup">Create Group</Dropdown.Item>
              <Dropdown.Item onClick={this.handleLogout} href="/">Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      );
    } else {
      navLogin = (
        <Nav className="ml-auto">
          <Button id="navbarlogin" className="mr-sm-2 navbarbuttons" href="/login">Login</Button>
          <Button className="navbarbuttons" href="/register">Sign Up</Button>
        </Nav>
      );
    }
    return (
      <div>
        <Navbar id="nav-bar">
          <div className="container">
            <Navbar.Brand id="nav-brand" href="/dashboard">
              <img
                alt=""
                src={`${window.location.origin}/splitwise-logo.png`}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              {' '}
              Splitwise
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            {navLogin}
          </div>
        </Navbar>
      </div>
    );
  }
}

/* const mapDispatchToProps = (dispatch) => ({
  onLogoutUser: () => dispatch({ type: 'REMOVE_USER' }),
});

Navigationbar.defaultProps = {
  onLogoutUser: () => {},
};

Navigationbar.propTypes = {
  onLogoutUser: propTypes.func,
}; */
export default Navigationbar;
