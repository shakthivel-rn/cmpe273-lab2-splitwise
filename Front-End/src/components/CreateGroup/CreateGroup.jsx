import React, { Component } from 'react';
import '../../App.css';
import './CreateGroup.css';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import {
  Container, Row, Col, Form, Figure, Button, Fade,
} from 'react-bootstrap';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import Navigationbar from '../Navigationbar/Navigationbar';

class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: sessionStorage.getItem('userId'),
      groupName: '',
      inputs: ['Enter Group Member Email'],
      memberEmails: [],
      fadeFlag: false,
      inputEmails: [],
      invalidGroupNameFlag: false,
      groupCreatedFlag: false,
      redirectPage: false,
      loadedCookie: cookie.load('cookie'),
    };
    this.appendInput = this.appendInput.bind(this);
    this.removeInput = this.removeInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeGroupName = this.handleChangeGroupName.bind(this);
    this.submitGroup = this.submitGroup.bind(this);
  }

  async componentDidMount() {
    const res = await axios.get('http://localhost:3001/createGroup/getMemberEmails');
    this.setState({
      fadeFlag: true,
      inputEmails: [...res.data],
    });
  }

  handleChangeGroupName(e) {
    this.setState({
      groupName: e.target.value,
    });
  }

  handleChange(event, i) {
    const { memberEmails } = this.state;
    memberEmails[i] = event.target.value;
    this.setState({
      memberEmails,
    });
  }

  submitGroup = (e) => {
    e.preventDefault();
    const {
      memberEmails, groupName, userId,
    } = this.state;
    const data = {
      userId,
      memberEmails,
      groupName,
    };
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3001/createGroup', data)
      .then(() => {
        this.setState({
          groupCreatedFlag: true,
        });
      })
      .catch(() => {
        this.setState({
          invalidGroupNameFlag: true,
        });
      });
  }

  appendInput() {
    const { inputs } = this.state;
    const newInput = 'Enter Group Member Email';
    this.setState({
      inputs: inputs.concat(newInput),
    });
  }

  removeInput() {
    const { inputs, memberEmails } = this.state;
    inputs.pop();
    memberEmails.pop();
    this.setState({
      inputs,
      memberEmails,
    });
  }

  render() {
    const {
      inputs, fadeFlag, inputEmails, invalidGroupNameFlag,
      groupCreatedFlag, redirectPage, loadedCookie,
    } = this.state;
    const inputEmailsList = inputEmails.map((inputEmail) => (
      <option value={inputEmail.email}>{inputEmail.email}</option>
    ));
    const formInputs = inputs.map((input, i) => (
      <Form.Control as="select" onChange={(e) => this.handleChange(e, i)} className="my-1 mr-sm-2" custom required>
        <option>Choose Member Email</option>
        {inputEmailsList}
      </Form.Control>

    ));
    return (
      <div>
        {groupCreatedFlag ? (
          <SweetAlert
            success
            title="Group created"
            onConfirm={() => {
              this.setState({
                redirectPage: <Redirect to="/dashboard" />,
              });
            }}
          />
        ) : null}
        {invalidGroupNameFlag ? (
          <SweetAlert
            warning
            title="Groupname already exist"
            onConfirm={() => {
              this.setState({
                invalidGroupNameFlag: false,
              });
            }}
          />
        ) : null}
        {!loadedCookie ? <Redirect to="/" /> : null}
        {redirectPage}
        <Navigationbar />
        <div className="container">
          <div className="creategroup">
            <h1>Create new group page:</h1>
            <div className="groupdetails">
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
                            src={`${window.location.origin}/group.png`}
                          />
                        </Figure>
                        <Form>
                          <Form.Group>
                            <Form.File id="userimage" label="Change your avatar" />
                          </Form.Group>
                        </Form>
                      </Col>
                      <Col>
                        <p>START A NEW GROUP</p>
                        <p>My group shall be called...</p>
                        <Form method="post" onSubmit={this.submitGroup}>
                          <Form.Group controlId="formGroupName">
                            <Form.Control type="text" onChange={this.handleChangeGroupName} name="groupname" placeholder="Enter Group Name" required />
                          </Form.Group>
                          <p>GROUP MEMBERS</p>
                          {formInputs}
                          <Button className="groupButtons" onClick={this.appendInput}>Add Member</Button>
                          <Button className="groupButtons" onClick={this.removeInput}>Remove Member</Button>
                          <Button className="groupButtons" type="submit">
                            Submit
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

export default CreateGroup;
