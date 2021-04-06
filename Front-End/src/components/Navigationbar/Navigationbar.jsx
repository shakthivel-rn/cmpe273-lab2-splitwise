/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import axios from 'axios';
import '../../App.css';
import './Navigationbar.css';
import {
  Navbar, Nav, Button, Dropdown, Image,
} from 'react-bootstrap';
// import { connect } from 'react-redux';
// import { propTypes } from 'react-bootstrap/esm/Image';

class Navigationbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'),
      authenticationToken: localStorage.getItem('token'),
      imagePreview: null,
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.getUserProfileImage = this.getUserProfileImage.bind(this);
  }

  async componentDidMount() {
    this.getUserProfileImage();
  }

  componentDidUpdate(prevProps) {
    const { refreshBit } = this.props;
    if (prevProps.refreshBit !== refreshBit) {
      this.getUserProfileImage();
    }
  }

  getUserProfileImage = async () => {
    const { userId } = this.state;
    const res = await axios.get('http://localhost:3001/profilePage/getImage', { params: { userId } });
    this.setState({
      imagePreview: res.data.userImage,
    });
  }

  handleLogout = () => {
    localStorage.removeItem('token');
    // const { onLogoutUser } = this.props;
    // onLogoutUser();
  }

  render() {
    let navLogin = null;
    let profileImage = null;
    const { authenticationToken, imagePreview } = this.state;
    if (authenticationToken) {
      profileImage = <Image src={imagePreview} width={70} roundedCircle />;
    }
    if (authenticationToken) {
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
            {profileImage}
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
