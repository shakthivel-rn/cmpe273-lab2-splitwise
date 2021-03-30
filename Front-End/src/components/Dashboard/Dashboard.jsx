/* eslint-disable no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import '../../App.css';
import './Dashboard.css';
// import { Redirect } from 'react-router';
// import cookie from 'react-cookies';
// import {
//  Container, Row, Col,
// } from 'react-bootstrap';
// import Navigationbar from '../Navigationbar/Navigationbar';
// import DashboardSideBar from './DashboardSideBar';
// import Dashboardbox from './DashboardBox';
// import YouOwe from './YouOwe';
// import YouAreOwed from './YouAreOwed';
import axios from 'axios';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // loadeCookie: cookie.load('cookie'),
      sample: '',
      message: '',
    };
  }

  componentDidMount() {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.get('http://localhost:3001/dashboard/sample')
      .then((response) => {
        // update the state with the response data
        this.setState({
          sample: response.data,
        });
      })
      .catch((error) => {
        this.setState({
          message: error.response.data,
        });
      });
  }

  render() {
    // const { loadeCookie } = this.state;
    const { sample, message } = this.state;
    return (
      <div>
        <h1>Dashboard</h1>
        {sample}
        {message}
        {/*
        {!loadeCookie ? <Redirect to="/" /> : null}
        <Navigationbar />
        <div className="container">
          <div className="dashboard">
            <Container>
              <Row>
                <Col lg={2}>
                  <DashboardSideBar />
                </Col>
                <Col>
                  <Row>
                    <Col>
                      <Dashboardbox />
                    </Col>
                  </Row>
                  <div id="balancecontainer">
                    <Row>
                      <Col><YouOwe /></Col>
                      <Col><YouAreOwed /></Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div> */}
      </div>
    );
  }
}

export default Dashboard;
