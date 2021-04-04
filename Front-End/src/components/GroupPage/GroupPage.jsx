import React, { Component } from 'react';
import '../../App.css';
import './GroupPage.css';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, Button, Accordion, Modal, Fade, Card, ListGroup,
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
      expenseDatas: [],
      isModalOpen: false,
      fadeFlag: false,
      authenticationToken: localStorage.getItem('token'),
      eventKey: 0,
    };
    this.getGroupDetails = this.getGroupDetails.bind(this);
    this.getExpenseDetails = this.getExpenseDetails.bind(this);
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
    const { groupDatas } = this.state;
    this.getExpenseDetails(groupDatas[0]);
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

  async getGroupDetails() {
    const { userId, groupName } = this.state;
    const res = await axios.get('http://localhost:3001/groupPage', { params: { userId, groupName } });
    this.setState({
      groupDatas: [...res.data],
      fadeFlag: true,
    });
    this.closeModal();
  }

  async getExpenseDetails(expenseDescription) {
    const { userId, groupName } = this.state;
    const res = await axios.get('http://localhost:3001/groupPage/getExpenseDetail', { params: { userId, groupName, expenseDescription } });
    this.setState({
      expenseDatas: [...res.data],
    });
  }

  openModal = () => this.setState({ isModalOpen: true });

  closeModal = () => this.setState({ isModalOpen: false });

  render() {
    const {
      groupId, groupName, groupDatas, isModalOpen, fadeFlag, authenticationToken, expenseDatas,
    } = this.state;
    let { eventKey } = this.state;
    const groupDataList = [];
    const expenseDataList = [];
    expenseDatas.forEach((expenseData) => {
      if (expenseData.status === 'added') {
        expenseDataList.unshift(
          <ListGroup.Item id="expensecreated">
            <Container>
              <Row>
                <Col xs={7}>{`Added By: ${expenseData.paidUserName}`}</Col>
                <Col>{`Amount: ${expenseData.expenseAmount}$`}</Col>
              </Row>
            </Container>
          </ListGroup.Item>,
        );
      }
      if (expenseData.status === 'owes') {
        if (expenseData.owedUserName === 'You') {
          expenseDataList.push(
            <ListGroup.Item>
              {`${expenseData.owedUserName}
            owe ${expenseData.paidUserName} ${expenseData.splitAmount}$` }
            </ListGroup.Item>,
          );
        } else {
          expenseDataList.push(
            <ListGroup.Item>
              {`${expenseData.owedUserName}
            ${expenseData.status} ${expenseData.paidUserName}
            ${expenseData.splitAmount}$` }
            </ListGroup.Item>,
          );
        }
      }
      if (expenseData.status === 'paid') {
        expenseDataList.push(
          <ListGroup.Item>
            {`${expenseData.owedUserName}
          ${expenseData.status} ${expenseData.paidUserName}
          ${expenseData.splitAmount}$` }
          </ListGroup.Item>,
        );
      }
    });
    groupDatas.forEach((groupData) => {
      groupDataList.push(
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey={eventKey.toString()} onClick={() => { this.getExpenseDetails(groupData); }}>
              {groupData}
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey={eventKey.toString()}>
            <Card.Body><ListGroup variant="flush">{expenseDataList}</ListGroup></Card.Body>
          </Accordion.Collapse>
        </Card>,
      );
      eventKey += 1;
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
                          <AddExpenseForm
                            groupId={groupId}
                            getGroupDetails={this.getGroupDetails}
                          />
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
                        <Accordion id="accordian" defaultActiveKey="0">{groupDataList}</Accordion>
                        {/* groupDataList.length === 0 ? <p>No expense created</p> : (
                          <ListGroup variant="flush">
                            {groupDataList}
                          </ListGroup>
                        ) */}
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
