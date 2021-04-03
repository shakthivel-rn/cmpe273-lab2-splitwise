/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import '../../App.css';
import {
  ListGroup, Fade,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

class DashboardSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'),
      groups: [],
      fadeFlag: false,
    };
  }

  async componentDidMount() {
    const { userId } = this.state;
    const res = await axios.get('http://localhost:3001/dashboard/getGroupNames', { params: { userId } });
    this.setState({
      groups: [...res.data],
      fadeFlag: true,
    });
  }

  render() {
    const { groups, fadeFlag } = this.state;
    const groupNames = groups.map((group) => (
      <ListGroup.Item>
        <Link to={{
          pathname: '/grouppage',
          state: {
            groupId: group._id,
            groupName: group.name,
          },
        }}
        >
          {group.name}
        </Link>

      </ListGroup.Item>
    ));
    return (
      <div>
        <ListGroup>
          <ListGroup.Item>
            <Link to="/dashboard">Dashboard</Link>
          </ListGroup.Item>
          <ListGroup.Item>
            <Link to="/recentactivity">Recent Activity</Link>
          </ListGroup.Item>
          <ListGroup.Item>
            <Link to="/mygroups">My Groups</Link>
          </ListGroup.Item>
        </ListGroup>
        <p id="grouptag">GROUPS</p>
        <Fade in={fadeFlag}>
          <div>
            <ListGroup>
              {groupNames}
            </ListGroup>
          </div>
        </Fade>
      </div>
    );
  }
}

export default DashboardSideBar;
