import React, { useEffect, useState } from 'react';
import '../../App.css';
import './DashboardBox.css';
import {
  Row, Col, Button, Fade, Modal, ListGroup,
} from 'react-bootstrap';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';

function Dashboardbox() {
  const [userId] = useState(sessionStorage.getItem('userId'));
  const [totalBalance, setTotalBalance] = useState(0);
  const [youOwe, setYouOwe] = useState(0);
  const [youAreOwed, setYouAreOwed] = useState(0);
  const [fadeFlag, setFadeFlag] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [settledBalanceFlag, setSettledBalanceFlag] = useState(false);

  useEffect(() => {
    const getPaidAndOwedAmount = async () => {
      const res = await axios.get('http://localhost:3001/dashboard/getTotalPaidAndOwedAmount', { params: { userId } });
      setYouOwe(res.data.totalOwedAmount);
      setYouAreOwed(res.data.totalPaidAmount);
      setTotalBalance(res.data.totalPaidAmount - res.data.totalOwedAmount);
      setFadeFlag(true);
    };
    const getFriendsDetails = async () => {
      const res = await axios.get('http://localhost:3001/dashboard/getSettleModalDetails', { params: { userId } });
      setFriends([...res.data]);
    };
    getPaidAndOwedAmount();
    getFriendsDetails();
  }, [userId]);

  const onSettleUp = async (friendId) => {
    const data = { userId, friendId };
    await axios.post('http://localhost:3001/dashboard/settleAmount', data)
      .then(() => {
        setSettledBalanceFlag(true);
      });
  };

  const friendsDetails = [];
  friends.forEach((friend) => {
    friendsDetails.push(
      <ListGroup.Item>
        <Row>
          <Col lg={8}>{friend.name}</Col>
          <Col>
            <Button className="acceptinvitebutton" onClick={() => onSettleUp(friend.user_id)}>
              Settle Up
            </Button>
          </Col>
        </Row>
      </ListGroup.Item>,
    );
  });

  const openModal = () => setModalOpen(true);

  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <div id="dashboardcontainer">
        {settledBalanceFlag ? (
          <SweetAlert
            success
            title="Settled"
            onConfirm={() => {
              setSettledBalanceFlag(false);
            }}
          />
        ) : null}
        <div>
          <Row>
            <Col lg={8}><h3 id="dashboardtitle">Dashboard</h3></Col>
            <Col><Button id="addabill" href="/dashboard">Add a bill</Button></Col>
            <Col>
              <Button onClick={openModal} id="settleup">Settle Up</Button>
            </Col>
            <Modal show={isModalOpen}>
              <Modal.Header id="modaltop">
                <Modal.Title>Settle Up</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ListGroup id="settleFriends" variant="flush">
                  {friendsDetails}
                </ListGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={closeModal} id="closemodal">Close</Button>
              </Modal.Footer>
            </Modal>
          </Row>
        </div>
        <div id="balance">
          <Row>
            <div className="balancedisplay">
              <Col>
                total balance
                <br />
                <Fade in={fadeFlag}>
                  <div>
                    {totalBalance}
                    $
                  </div>
                </Fade>
              </Col>
            </div>
            <div className="balancedisplay">
              <Col>
                you owe
                <br />
                <Fade in={fadeFlag}>
                  <div>
                    {youOwe}
                    $
                  </div>
                </Fade>
              </Col>
            </div>
            <Col>
              you are owed
              <br />
              <Fade in={fadeFlag}>
                <div>
                  {youAreOwed}
                  $
                </div>
              </Fade>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default Dashboardbox;
