import React, { Component } from 'react';
import '../../App.css';
import './GroupPage.css';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, Button, ListGroup, Modal, Fade,
} from 'react-bootstrap';
import axios from 'axios';
import Navigationbar from '../Navigationbar/Navigationbar';
import DashboardSideBar from '../Dashboard/DashboardSideBar';
import AddExpenseForm from './AddExpenseForm';

class GroupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'),
      groupId: 0,
      groupName: '',
      groupDatas: [],
      isModalOpen: false,
      fadeFlag: false,
      authenticationToken: localStorage.getItem('token'),
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // eslint-disable-next-line react/prop-types
    const { groupId, groupName } = nextProps.location.state;
    return ({
      groupId,
      groupName,
    });
  }

  async componentDidMount() {
    const { userId, groupName } = this.state;
    const res = await axios.get('http://localhost:3001/groupPage', { params: { userId, groupName } });
    this.setState({
      groupDatas: [...res.data],
      fadeFlag: true,
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    const { userId, groupName } = this.state;
    if (groupName !== prevState.groupName) {
      const res = await axios.get('http://localhost:3001/groupPage', { params: { userId, groupName } });
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        groupDatas: [...res.data],
        fadeFlag: true,
      });
    }
  }

  openModal = () => this.setState({ isModalOpen: true });

  closeModal = () => this.setState({ isModalOpen: false });

  render() {
    const {
      groupId, groupName, groupDatas, isModalOpen, fadeFlag, authenticationToken,
    } = this.state;
    const groupDataList = [];
    groupDatas.forEach((groupData) => {
      if (groupData.status === 'added') {
        groupDataList.push(
          <ListGroup.Item id="expensecreated">
            {`${groupData.expenseName} -- Added By: ${groupData.paidUserName} -- Amount: ${groupData.expenseAmount}$` }
          </ListGroup.Item>,
        );
      }
      if (groupData.status === 'owes') {
        if (groupData.owedUserName === 'You') {
          groupDataList.push(
            <ListGroup.Item>{`${groupData.expenseName} -- ${groupData.owedUserName} owe ${groupData.paidUserName} ${groupData.splitAmount}$` }</ListGroup.Item>,
          );
        } else {
          groupDataList.push(
            <ListGroup.Item>{`${groupData.expenseName} -- ${groupData.owedUserName} ${groupData.status} ${groupData.paidUserName} ${groupData.splitAmount}$` }</ListGroup.Item>,
          );
        }
      }
      if (groupData.status === 'paid') {
        groupDataList.push(
          <ListGroup.Item>{`${groupData.expenseName} -- ${groupData.owedUserName}  ${groupData.status} ${groupData.paidUserName} ${groupData.splitAmount}$` }</ListGroup.Item>,
        );
      }
    });
    return (
      <div>
        {!authenticationToken ? <Redirect to="/" /> : null}
        <Navigationbar />
        <div className="container">
          <div className="groupcontainer">
            <Container>
              <Row>
                <Col lg={2}>
                  <DashboardSideBar />
                </Col>
                <Col>
                  <div id="grouppagetop">
                    <Row>
                      <Col lg={7}>
                        <Fade in={fadeFlag}>
                          <div>
                            <h3 id="grouptitle">{groupName}</h3>
                          </div>
                        </Fade>
                      </Col>
                      <Col><Button id="addanexpense" onClick={this.openModal}>Add an expense</Button></Col>
                      <Modal show={isModalOpen}>
                        <Modal.Header id="modaltop">
                          <Modal.Title>Add an expense</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <AddExpenseForm groupId={groupId} />
                        </Modal.Body>
                        <Modal.Footer>
                          <Button onClick={this.closeModal} id="closemodal">Close</Button>
                        </Modal.Footer>
                      </Modal>
                    </Row>
                  </div>
                  <Row>
                    <Fade in={fadeFlag}>
                      <div id="groupcontent">
                        {groupDataList.length === 0 ? <p>No expense created</p> : (
                          <ListGroup variant="flush">
                            {groupDataList}
                          </ListGroup>
                        )}
                      </div>
                    </Fade>
                  </Row>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    );
  }
}

export default GroupPage;
