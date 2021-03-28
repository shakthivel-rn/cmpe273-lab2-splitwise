import React, { Component } from 'react';
import '../../App.css';
import './Profilepage.css';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import {
  Container, Row, Col, Form, Button, Figure, Fade,
} from 'react-bootstrap';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import Navigationbar from '../Navigationbar/Navigationbar';

class Profilepage extends Component {
  constructor(props) {
    super(props);
    const userId = sessionStorage.getItem('userId');
    this.state = {
      userId,
      name: 'Your Name',
      email: 'Your Email',
      phone: 'Your Phonenumber',
      defaultcurrency: 'Choose Currency',
      timezone: 'Choose Timezone',
      language: 'Choose Language',
      fadeFlag: false,
      loadedCookie: cookie.load('cookie'),
      imageURL: null,
    };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePhone = this.handleChangePhone.bind(this);
    this.handleChangeDefautCurrency = this.handleChangeDefautCurrency.bind(this);
    this.handleChangeTimezone = this.handleChangeTimezone.bind(this);
    this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.editName = this.editName.bind(this);
    this.editEmail = this.editEmail.bind(this);
    this.editPhone = this.editPhone.bind(this);
    this.editDefaultCurrency = this.editDefaultCurrency.bind(this);
    this.editTimeZone = this.editTimeZone.bind(this);
    this.editLanguage = this.editLanguage.bind(this);
  }

  async componentDidMount() {
    const { userId } = this.state;
    const res = await axios.get('http://localhost:3001/profilePage/getUserDetails', { params: { userId } });
    this.setState({
      name: res.data[0].name,
      email: res.data[0].email,
      phone: res.data[0].phone_number ? res.data[0].phone_number : 'Your Phonenumber',
      defaultcurrency: res.data[0].default_currency ? res.data[0].default_currency : 'Choose Currency',
      timezone: res.data[0].timezone ? res.data[0].timezone : 'Choose Timezone',
      language: res.data[0].language ? res.data[0].language : 'Choose Language',
      fadeFlag: true,
      submitFlag: false,
      errorFlag: false,
      imageURL: localStorage.getItem(`userImage${userId}`),
    });
  }

  handleImage = (e) => {
    const { userId } = this.state;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.addEventListener('load', () => {
      localStorage.setItem(`userImage${userId}`, reader.result);
    });
  }

  handleChangeName = (e) => {
    this.setState({
      name: e.target.value,
    });
  }

  handleChangeEmail = (e) => {
    this.setState({
      email: e.target.value,
    });
  }

  handleChangePhone = (e) => {
    this.setState({
      phone: e.target.value,
    });
  }

  handleChangeDefautCurrency = (e) => {
    this.setState({
      defaultcurrency: e.target.value,
    });
  }

  handleChangeTimezone = (e) => {
    this.setState({
      timezone: e.target.value,
    });
  }

  handleChangeLanguage = (e) => {
    this.setState({
      language: e.target.value,
    });
  }

  editName = (e) => {
    e.preventDefault();
    const { name, userId } = this.state;
    const data = {
      name,
      userId,
    };
    axios.defaults.withCredentials = true;
    axios.put('http://localhost:3001/profilePage/editName', data)
      .then(() => {
        this.setState({
          submitFlag: true,
        });
      });
  }

  editEmail = (e) => {
    e.preventDefault();
    const { email, userId } = this.state;
    const data = {
      email,
      userId,
    };
    axios.defaults.withCredentials = true;
    axios.put('http://localhost:3001/profilePage/editEmail', data)
      .then(() => {
        this.setState({
          submitFlag: true,
        });
      })
      .catch(() => {
        this.setState({
          errorFlag: true,
        });
      });
  }

  editPhone = (e) => {
    e.preventDefault();
    const { phone, userId } = this.state;
    const data = {
      phone,
      userId,
    };
    axios.defaults.withCredentials = true;
    axios.put('http://localhost:3001/profilePage/editPhoneNumber', data)
      .then(() => {
        this.setState({
          submitFlag: true,
        });
      });
  }

  editDefaultCurrency = (e) => {
    e.preventDefault();
    const { defaultcurrency, userId } = this.state;
    const data = {
      defaultcurrency,
      userId,
    };
    axios.defaults.withCredentials = true;
    axios.put('http://localhost:3001/profilePage/editDefaultCurrency', data)
      .then(() => {
        this.setState({
          submitFlag: true,
        });
      });
  }

  editTimeZone = (e) => {
    e.preventDefault();
    const { timezone, userId } = this.state;
    const data = {
      timezone,
      userId,
    };
    axios.defaults.withCredentials = true;
    axios.put('http://localhost:3001/profilePage/editTimeZone', data)
      .then(() => {
        this.setState({
          submitFlag: true,
        });
      });
  }

  editLanguage = (e) => {
    e.preventDefault();
    const { language, userId } = this.state;
    const data = {
      language,
      userId,
    };
    axios.defaults.withCredentials = true;
    axios.put('http://localhost:3001/profilePage/editLanguage', data)
      .then(() => {
        this.setState({
          submitFlag: true,
        });
      });
  }

  render() {
    const {
      name, email, phone, defaultcurrency, timezone, language,
      fadeFlag, submitFlag, errorFlag, loadedCookie, imageURL,
    } = this.state;
    return (
      <div>
        {submitFlag ? (
          <SweetAlert
            success
            title="Edit successfully done"
            onConfirm={() => {
              this.setState({
                submitFlag: false,
              });
            }}
          />
        ) : null}
        {errorFlag ? (
          <SweetAlert
            warning
            title="Email already exists"
            onConfirm={() => {
              this.setState({
                errorFlag: false,
              });
            }}
          />
        ) : null}
        { !loadedCookie ? <Redirect to="/" /> : null }
        <Navigationbar />
        <div className="container">
          <div className="profilepage">
            <h1>Your Account</h1>
            <div className="userdetails">
              <Container>
                <Fade in={fadeFlag}>
                  <div>
                    <Row>
                      <Col lg={3}>
                        <Figure>
                          <Figure.Image
                            width={171}
                            height={180}
                            alt="171x180"
                            src={imageURL === null ? `${window.location.origin}/dummy_user.png` : imageURL}
                          />
                        </Figure>
                        <Form>
                          <Form.Group>
                            <Form.File id="userimage" label="Change your avatar" onChange={this.handleImage} />
                          </Form.Group>
                        </Form>
                      </Col>
                      <Col>
                        <p>Your Name</p>
                        <Form method="post" onSubmit={this.editName} inline>
                          <Form.Group controlId="editUserName">
                            <Form.Control onChange={this.handleChangeName} className="mb-2 mr-sm-2" id="username" placeholder={name} />
                          </Form.Group>
                          <Button type="submit" className="mb-2 editProfileButton">
                            Edit
                          </Button>
                        </Form>
                        <br />
                        <p>Your email address</p>
                        <Form method="post" onSubmit={this.editEmail} inline>
                          <Form.Group controlId="editUserEmail">
                            <Form.Control onChange={this.handleChangeEmail} className="mb-2 mr-sm-2" id="useremail" placeholder={email} />
                          </Form.Group>
                          <Button type="submit" className="mb-2 editProfileButton">
                            Edit
                          </Button>
                        </Form>
                        <br />
                        <p>Your phone number</p>
                        <Form method="post" onSubmit={this.editPhone} inline>
                          <Form.Group controlId="editUserPhone">
                            <Form.Control onChange={this.handleChangePhone} className="mb-2 mr-sm-2" id="userphone" placeholder={phone} />
                          </Form.Group>
                          <Button type="submit" className="mb-2 editProfileButton">
                            Edit
                          </Button>
                        </Form>
                      </Col>
                      <Col>
                        <p>Your default currency</p>
                        <Form method="post" onSubmit={this.editDefaultCurrency} inline>
                          <Form.Control onChange={this.handleChangeDefautCurrency} as="select" className="my-1 mr-sm-2" id="defaultcurrency" custom>
                            <option value="Choose Currency">{defaultcurrency}</option>
                            <option value="USD">USD</option>
                            <option value="KWD">KWD</option>
                            <option value="BHD">BHD</option>
                            <option value="GBP">GBP</option>
                            <option value="EUR">EUR</option>
                            <option value="CAD">CAD</option>
                          </Form.Control>
                          <Button type="submit" className="my-1 editProfileButton">
                            Edit
                          </Button>
                        </Form>
                        <br />
                        <p>Your time zone</p>
                        <Form method="post" onSubmit={this.editTimeZone} inline>
                          <Form.Control onChange={this.handleChangeTimezone} as="select" className="my-1 mr-sm-2" id="defaulttimezone" custom>
                            <option value="Choose Timezone">{timezone}</option>
                            <option value="Atlantic Standard Time (AST)">Atlantic Standard Time (AST)</option>
                            <option value="Eastern Standard Time (EST)">Eastern Standard Time (EST)</option>
                            <option value="Central Standard Time (CST)">Central Standard Time (CST)</option>
                            <option value="Mountain Standard Time (MST)">Mountain Standard Time (MST)</option>
                            <option value="Pacific Standard Time (PST)">Pacific Standard Time (PST)</option>
                            <option value="Alaskan Standard Time (AKST)">Alaskan Standard Time (AKST)</option>
                            <option value="Hawaii-Aleutian Standard Time (HST)">Hawaii-Aleutian Standard Time (HST)</option>
                            <option value="Samoa standard time (UTC-11)">Samoa standard time (UTC-11)</option>
                            <option value="Chamorro Standard Time (UTC+10)">Chamorro Standard Time (UTC+10)</option>
                          </Form.Control>
                          <Button type="submit" className="my-1 editProfileButton">
                            Edit
                          </Button>
                        </Form>
                        <br />
                        <p>Language</p>
                        <Form method="post" onSubmit={this.editLanguage} inline>
                          <Form.Control onChange={this.handleChangeLanguage} as="select" className="my-1 mr-sm-2" id="defaultlanguage" custom>
                            <option value="Choose Language">{language}</option>
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Japanese">Japanese</option>
                            <option value="French">French</option>
                          </Form.Control>
                          <Button type="submit" className="my-1 editProfileButton">
                            Edit
                          </Button>
                        </Form>
                      </Col>
                    </Row>
                  </div>
                </Fade>
              </Container>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default Profilepage;
