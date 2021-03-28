import React, { Component } from 'react';
import '../../App.css';
import './MyGroups.css';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, ListGroup, Fade, Button,
} from 'react-bootstrap';
import cookie from 'react-cookies';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import Navigationbar from '../Navigationbar/Navigationbar';
import DashboardSideBar from '../Dashboard/DashboardSideBar';

class MyGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: sessionStorage.getItem('userId'),
      inviteList: [],
      fadeFlag: false,
      inviteFlag: false,
      redirectPage: '',
      groupList: [],
      leaveGroupFlag: false,
      errorLeaveGroupFlag: false,
      loadedCookie: cookie.load('cookie'),
    };
    this.handleAcceptInvite = this.handleAcceptInvite.bind(this);
  }

  async componentDidMount() {
    const { userId } = this.state;
    const resGroupNames = await axios.get('http://localhost:3001/dashboard/getGroupNames', { params: { userId } });
    this.setState({
      groupList: [...resGroupNames.data],
    });
    const resGroupInvites = await axios.get('http://localhost:3001/myGroups', { params: { userId } });
    this.setState({
      inviteList: [...resGroupInvites.data],
      fadeFlag: true,
    });
  }

  handleAcceptInvite(groupId) {
    const { userId } = this.state;
    const data = {
      userId,
      groupId,
    };
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3001/myGroups/acceptGroupInvite', data)
      .then(() => {
        this.setState({
          inviteFlag: true,
        });
      });
  }

  handleLeaveGroup(groupId) {
    const { userId } = this.state;
    const data = {
      userId,
      groupId,
    };
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3001/myGroups/leaveGroup', data)
      .then(() => {
        this.setState({
          leaveGroupFlag: true,
        });
      })
      .catch(() => {
        this.setState({
          errorLeaveGroupFlag: true,
        });
      });
  }

  render() {
    const {
      inviteList, fadeFlag, inviteFlag, redirectPage,
      groupList, leaveGroupFlag, errorLeaveGroupFlag, userId, loadedCookie,
    } = this.state;
    const groupListDetails = [];
    const inviteListDetails = [];
    groupList.forEach((groupListItem) => {
      groupListDetails.push(
        <ListGroup.Item>
          <Row>
            <Col lg={8}>{groupListItem.group_name}</Col>
            <Col>
              <Button className="acceptinvitebutton" onClick={() => this.handleLeaveGroup(groupListItem.group_id)}>
                Leave
              </Button>
            </Col>
          </Row>
        </ListGroup.Item>,
      );
    });
    inviteList.forEach((inviteListItem) => {
      if (inviteListItem.creatorId === Number(userId)) {
        inviteListDetails.push(
          <ListGroup.Item>
            <Row>
              <Col lg={8}>{`Rejoin ${inviteListItem.groupName} group`}</Col>
              <Col>
                <Button className="acceptinvitebutton" onClick={() => this.handleAcceptInvite(inviteListItem.groupId)}>
                  Join
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>,
        );
      } else {
        inviteListDetails.push(
          <ListGroup.Item>
            <Row>
              <Col lg={8}>{`${inviteListItem.creatorUser} invited you to join ${inviteListItem.groupName} group`}</Col>
              <Col>
                <Button className="acceptinvitebutton" onClick={() => this.handleAcceptInvite(inviteListItem.groupId)}>
                  Join
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>,
        );
      }
    });
    return (
      <div>
        {inviteFlag ? (
          <SweetAlert
            success
            title="Joined group successfully"
            onConfirm={() => {
              this.setState({
                redirectPage: <Redirect to="/dashboard" />,
              });
            }}
          />
        ) : null}
        {leaveGroupFlag ? (
          <SweetAlert
            success
            title="Left group successfully"
            onConfirm={() => {
              this.setState({
                redirectPage: <Redirect to="/dashboard" />,
              });
            }}
          />
        ) : null}
        {errorLeaveGroupFlag ? (
          <SweetAlert
            warning
            title="Clear your pending bills to leave the group"
            onConfirm={() => {
              this.setState({
                errorLeaveGroupFlag: false,
              });
            }}
          />
        ) : null}
        {!loadedCookie ? <Redirect to="/" /> : null}
        {redirectPage}
        <Navigationbar />
        <div className="container">
          <div className="mygroups">
            <Container>
              <Row>
                <Col lg={2}>
                  <DashboardSideBar />
                </Col>
                <Col>
                  <Fade in={fadeFlag}>
                    <div id="invitecontainer">
                      <Row>
                        <Container>
                          <h3 className="groupinvitetitle">My Groups</h3>
                          {groupListDetails.length === 0 ? <p>You are not part of any group</p>
                            : (
                              <ListGroup variant="flush">
                                {groupListDetails}
                              </ListGroup>
                            )}
                        </Container>
                      </Row>
                      <Row>
                        <Container>
                          <h3 className="groupinvitetitle">Group Invites</h3>
                          {inviteListDetails.length === 0 ? <p>No group invites</p> : (
                            <ListGroup variant="flush">
                              {inviteListDetails}
                            </ListGroup>
                          )}
                        </Container>
                      </Row>
                    </div>
                  </Fade>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    );
  }
}

export default MyGroups;
