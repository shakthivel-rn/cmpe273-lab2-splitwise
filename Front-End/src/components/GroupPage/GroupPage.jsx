/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import '../../App.css';
import './GroupPage.css';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, Button, Accordion, Modal, Fade, Card, ListGroup, Form,
} from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { BsXCircleFill } from 'react-icons/bs';
import SweetAlert from 'react-bootstrap-sweetalert';
import Navigationbar from '../Navigationbar/Navigationbar';
import DashboardSideBar from '../Dashboard/DashboardSideBar';
import AddExpenseForm from './AddExpenseForm';

class GroupPage extends Component {
  constructor(props) {
    super(props);
    const { userIdRedux } = props;
    this.state = {
      userId: userIdRedux,
      groupId: 0,
      groupName: '',
      groupDatas: [],
      expenseDatas: [],
      isModalOpen: false,
      fadeFlag: false,
      expenseFadeFlag: false,
      authenticationToken: localStorage.getItem('token'),
      eventKey: 0,
      comment: '',
      comments: [],
      expenseId: undefined,
      commentIndex: undefined,
      deleteFlag: false,
    };
    this.getGroupDetails = this.getGroupDetails.bind(this);
    this.getExpenseDetails = this.getExpenseDetails.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
    this.onSubmitComment = this.onSubmitComment.bind(this);
    this.onDeleteComment = this.onDeleteComment.bind(this);
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

  async getGroupDetails() {
    const { userId, groupName } = this.state;
    const res = await axios.get('http://localhost:3001/groupPage', { params: { userId, groupName } });
    this.setState({
      groupDatas: [...res.data],
      fadeFlag: true,
    });
    this.closeModal();
  }

  async getExpenseDetails(expenseId) {
    const { userId, groupName } = this.state;
    const res = await axios.get('http://localhost:3001/groupPage/getExpenseDetail', { params: { userId, groupName, expenseId } });
    this.setState({
      expenseDatas: [...res.data],
      expenseFadeFlag: true,
    });
    const response = await axios.get('http://localhost:3001/groupPage/getComments', { params: { userId, expenseId } });
    this.setState({
      comments: [...response.data],
    });
  }

  handleChangeComment = (e) => {
    this.setState({
      comment: e.target.value,
    });
  }

  onSubmitComment = (expenseId) => {
    const { userId, comment } = this.state;
    const data = {
      expenseId,
      userId,
      comment,
    };
    axios.post('http://localhost:3001/groupPage/postComment', data)
      .then(() => {
        this.getExpenseDetails(expenseId);
      });
  }

  onDeleteComment = (expenseId, commentIndex) => {
    const data = {
      expenseId,
      commentIndex,
    };
    axios.post('http://localhost:3001/groupPage/deleteComment', data)
      .then(() => {
        this.getExpenseDetails(expenseId);
      });
  }

  openModal = () => this.setState({ isModalOpen: true });

  closeModal = () => this.setState({ isModalOpen: false });

  render() {
    const {
      groupId, groupName, groupDatas, isModalOpen, fadeFlag, authenticationToken,
      expenseDatas, expenseFadeFlag, comments, expenseId, commentIndex, deleteFlag,
    } = this.state;
    let { eventKey } = this.state;
    const groupDataList = [];
    const expenseDataList = [];
    const commentsDataList = [];
    comments.forEach((comment, i) => {
      if (comment.userName === 'You') {
        commentsDataList.push(
          <ListGroup.Item>
            {`${comment.userName}: ${comment.commentDetails}` }
            {'     '}
            <BsXCircleFill onClick={() => {
              this.setState({
                expenseId: comment.expenseId,
                commentIndex: i,
                deleteFlag: true,
              });
            }}
            />
          </ListGroup.Item>,
        );
      } else {
        commentsDataList.push(
          <ListGroup.Item>
            {`${comment.userName}: ${comment.commentDetails}` }
            {'     '}
          </ListGroup.Item>,
        );
      }
    });
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
            <Accordion.Toggle id="expense" as={Button} variant="link" eventKey={eventKey.toString()} onClick={() => { this.getExpenseDetails(groupData.expenseId); }}>
              {groupData.expenseDescription}
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey={eventKey.toString()}>
            <Card.Body>
              <Fade in={expenseFadeFlag}>
                <ListGroup variant="flush">
                  <div>
                    {expenseDataList}
                  </div>
                  <div>
                    <h5 id="commentsheading">Notes and Comments</h5>
                    <Container>
                      <Row>
                        <Col>
                          <ListGroup variant="flush">
                            {commentsDataList}
                            {' '}
                          </ListGroup>
                        </Col>
                        <Col>
                          <Form inline>
                            <Form.Control onChange={this.handleChangeComment} as="textarea" placeholder="Add comment" rows={3} />
                            <Button id="commentbutton" onClick={() => { this.onSubmitComment(groupData.expenseId); }} className="mb-2">
                              Post
                            </Button>
                          </Form>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </ListGroup>
              </Fade>
            </Card.Body>
          </Accordion.Collapse>
        </Card>,
      );
      eventKey += 1;
    });
    return (
      <div>
        {!authenticationToken ? <Redirect to="/" /> : null}
        {deleteFlag ? (
          <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={() => {
              this.onDeleteComment(expenseId, commentIndex);
              this.setState({
                deleteFlag: false,
              });
            }}
            onCancel={() => {
              this.setState({
                deleteFlag: false,
              });
            }}
            focusCancelBtn
          />
        ) : null}
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
                        <Accordion id="accordian">{groupDataList}</Accordion>
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

const mapStateToProps = (state) => ({
  userIdRedux: state.id,
});

export default connect(mapStateToProps)(GroupPage);
