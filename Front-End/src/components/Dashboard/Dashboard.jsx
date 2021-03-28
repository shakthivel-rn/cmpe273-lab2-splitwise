import React, { Component } from 'react';
import '../../App.css';
import './Dashboard.css';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import Navigationbar from '../Navigationbar/Navigationbar';
import DashboardSideBar from './DashboardSideBar';
import Dashboardbox from './DashboardBox';
import YouOwe from './YouOwe';
import YouAreOwed from './YouAreOwed';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadeCookie: cookie.load('cookie'),
    };
  }

  render() {
    const { loadeCookie } = this.state;
    return (
      <div>
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
        </div>
      </div>
    );
  }
}

export default Dashboard;
