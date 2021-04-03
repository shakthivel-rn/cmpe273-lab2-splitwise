import React, { Component } from 'react';
import '../../App.css';
import './RecentActivity.css';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, ListGroup, Fade,
} from 'react-bootstrap';
import axios from 'axios';
import Navigationbar from '../Navigationbar/Navigationbar';
import DashboardSideBar from '../Dashboard/DashboardSideBar';

class RecentActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'),
      recentactivitylogs: [],
      fadeFlag: false,
      authenticationToken: localStorage.getItem('token'),
    };
  }

  async componentDidMount() {
    const { userId } = this.state;
    const res = await axios.get('http://localhost:3001/recentActivity', { params: { userId } });
    const { recentactivitylogs } = this.state;
    this.setState({
      recentactivitylogs: recentactivitylogs.concat(res.data),
      fadeFlag: true,
    });
  }

  render() {
    const { recentactivitylogs, fadeFlag, authenticationToken } = this.state;

    const recentactivityloglist = [];
    recentactivitylogs.forEach((recentactivitylog) => {
      if (recentactivitylog.status === 'added') {
        recentactivityloglist.push(
          <ListGroup.Item>{`${recentactivitylog.paidUserName} ${recentactivitylog.status} ${recentactivitylog.expenseName} expense of ${recentactivitylog.expenseAmount}$ in ${recentactivitylog.groupName} group` }</ListGroup.Item>,
        );
      }
      if (recentactivitylog.status === 'owes') {
        if (recentactivitylog.owedUserName === 'You') {
          recentactivityloglist.push(
            <ListGroup.Item>{`${recentactivitylog.owedUserName} owe ${recentactivitylog.paidUserName} ${recentactivitylog.splitAmount}$ in ${recentactivitylog.expenseName} expense` }</ListGroup.Item>,
          );
        } else {
          recentactivityloglist.push(
            <ListGroup.Item>{`${recentactivitylog.owedUserName} ${recentactivitylog.status} ${recentactivitylog.paidUserName} ${recentactivitylog.splitAmount}$ in ${recentactivitylog.expenseName} expense` }</ListGroup.Item>,
          );
        }
      }
      if (recentactivitylog.status === 'paid') {
        recentactivityloglist.push(
          <ListGroup.Item>{`${recentactivitylog.owedUserName} ${recentactivitylog.status} ${recentactivitylog.paidUserName} ${recentactivitylog.splitAmount}$ in ${recentactivitylog.expenseName} expense` }</ListGroup.Item>,
        );
      }
    });
    return (
      <div>
        {!authenticationToken ? <Redirect to="/" /> : null }
        <Navigationbar />
        <div className="container">
          <div className="recentactivity">
            <Container>
              <Row>
                <Col lg={2}>
                  <DashboardSideBar />
                </Col>
                <Col>
                  <h3 id="recentactivitytitle">Recent Activity</h3>
                  <Fade in={fadeFlag}>
                    <div id="recentactivitycontent">
                      {recentactivityloglist.length === 0 ? <p>No recent activity</p> : (
                        <ListGroup variant="flush">
                          {recentactivityloglist}
                        </ListGroup>
                      )}
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

export default RecentActivity;
