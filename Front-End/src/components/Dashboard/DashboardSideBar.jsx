/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import '../../App.css';
import {
  ListGroup, Fade,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

class DashboardSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'),
      groups: [],
      fadeFlag: false,
    };
    this.getDashboardSidebarDetails = this.getDashboardSidebarDetails.bind(this);
  }

  async componentDidMount() {
    const { userId } = this.state;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    const res = await axios.get('http://localhost:3001/dashboard/getGroupNames', { params: { userId } });
    this.setState({
      groups: [...res.data],
      fadeFlag: true,
    });
  }

  async getDashboardSidebarDetails() {
    const { userId } = this.state;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    const res = await axios.get('http://localhost:3001/dashboard/getGroupNames', { params: { userId } });
    this.setState({
      groups: [...res.data],
      fadeFlag: true,
    });
  }

  render() {
    const { groups, fadeFlag } = this.state;
    const { refreshBitLocal, onMyGroupsChange } = this.props;
    if (refreshBitLocal) {
      this.getDashboardSidebarDetails();
      const modifiedRefreshBitLocal = !refreshBitLocal;
      const modifiedRefreshBitLocalObject = { modifiedRefreshBitLocal };
      onMyGroupsChange(modifiedRefreshBitLocalObject);
    }
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

const mapStateToProps = (state) => ({
  refreshBitLocal: state.refreshBit,
});
const mapDispatchToProps = (dispatch) => ({
  onMyGroupsChange: (userData) => dispatch({ type: 'RENDER', value: userData }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSideBar);
