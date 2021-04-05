import React, { Component } from 'react';
import '../../App.css';
import './RecentActivity.css';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, ListGroup, Fade, Pagination, Form,
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
      paginationNumber: 0,
      pageSize: 2,
      active: 1,
    };
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  async componentDidMount() {
    const { userId, pageSize } = this.state;
    const pageNumber = 1;
    const res = await axios.get('http://localhost:3001/recentActivity', { params: { userId, pageNumber, pageSize } });
    const { recentactivitylogs } = this.state;
    this.setState({
      recentactivitylogs: recentactivitylogs.concat(res.data),
      fadeFlag: true,
    });
    const response = await axios.get('http://localhost:3001/recentActivity/getPaginationNumbers', { params: { userId, pageSize } });
    this.setState({
      paginationNumber: response.data.paginationNumber,
    });
  }

  onPageSizeChange = async (e) => {
    await this.setState({
      pageSize: e.target.value,
      fadeFlag: false,
    });
    const { userId, pageSize } = this.state;
    const res = await axios.get('http://localhost:3001/recentActivity/getPaginationNumbers', { params: { userId, pageSize } });
    this.setState({
      paginationNumber: res.data.paginationNumber,
    });
    const pageNumber = 1;
    const response = await axios.get('http://localhost:3001/recentActivity', { params: { userId, pageNumber, pageSize } });
    this.setState({
      recentactivitylogs: [...response.data],
      fadeFlag: true,
    });
  }

  onPageChange = async (pagenumber) => {
    await this.setState({
      fadeFlag: false,
    });
    const { userId, pageSize } = this.state;
    const pageNumber = pagenumber;
    const res = await axios.get('http://localhost:3001/recentActivity', { params: { userId, pageNumber, pageSize } });
    this.setState({
      recentactivitylogs: [...res.data],
      fadeFlag: true,
      active: pagenumber,
    });
  }

  render() {
    const {
      recentactivitylogs, fadeFlag, authenticationToken, paginationNumber,
    } = this.state;

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
            <ListGroup.Item>{`${recentactivitylog.owedUserName} owe ${recentactivitylog.paidUserName} ${recentactivitylog.splitAmount}$ in ${recentactivitylog.expenseName} expense in ${recentactivitylog.groupName} group` }</ListGroup.Item>,
          );
        } else {
          recentactivityloglist.push(
            <ListGroup.Item>{`${recentactivitylog.owedUserName} ${recentactivitylog.status} ${recentactivitylog.paidUserName} ${recentactivitylog.splitAmount}$ in ${recentactivitylog.expenseName} expense in ${recentactivitylog.groupName} group` }</ListGroup.Item>,
          );
        }
      }
      if (recentactivitylog.status === 'paid') {
        recentactivityloglist.push(
          <ListGroup.Item>{`${recentactivitylog.owedUserName} ${recentactivitylog.status} ${recentactivitylog.paidUserName} ${recentactivitylog.splitAmount}$ in ${recentactivitylog.expenseName} expense in ${recentactivitylog.groupName} group` }</ListGroup.Item>,
        );
      }
    });

    const { active } = this.state;
    const items = [];
    for (let number = 1; number <= paginationNumber; number += 1) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === active}
          onClick={() => {
            this.onPageChange(number);
          }}
        >
          {number}
        </Pagination.Item>,
      );
    }
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
                  <Row>
                    <Col>
                      <h3 id="recentactivitytitle">Recent Activity</h3>
                    </Col>
                    <Col>
                      <Form.Label>Page Size</Form.Label>
                      <Form.Control as="select" defaultValue={2} onChange={this.onPageSizeChange}>
                        <option value={2}>2</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                      </Form.Control>
                    </Col>
                  </Row>
                  <Fade in={fadeFlag}>
                    <div id="recentactivitycontent">
                      {recentactivityloglist.length === 0 ? <p>No recent activity</p> : (
                        <ListGroup variant="flush">
                          {recentactivityloglist}
                        </ListGroup>
                      )}
                    </div>
                  </Fade>
                  <Pagination>{items}</Pagination>
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
