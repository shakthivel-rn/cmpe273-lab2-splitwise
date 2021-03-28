import axios from 'axios';
import React, { Component } from 'react';
import '../../App.css';
import './YouOwe.css';
import {
  ListGroup, Fade,
} from 'react-bootstrap';

class YouOwe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: sessionStorage.getItem('userId'),
      youowes: [],
      fadeFlag: false,
    };
  }

  async componentDidMount() {
    const { userId } = this.state;
    const res = await axios.get('http://localhost:3001/dashboard/getIndividualOwedAmount', { params: { userId } });
    const { youowes } = this.state;
    this.setState({
      youowes: youowes.concat(res.data),
      fadeFlag: true,
    });
  }

  render() {
    const { youowes, fadeFlag } = this.state;
    const youowelist = youowes.map((youowe) => <ListGroup.Item>{`You owe ${youowe.paidUserName} ${youowe.individualOwedAmount}$ in ${youowe.groupName}` }</ListGroup.Item>);
    return (
      <div>
        <div id="youowecontainer">
          <h4 id="youowetitle">You Owe</h4>
          <Fade in={fadeFlag}>
            <div>
              {youowelist.length === 0 ? <p>You do not owe anything</p> : (
                <ListGroup variant="flush">
                  {youowelist}
                </ListGroup>
              )}
            </div>
          </Fade>
        </div>
      </div>
    );
  }
}

export default YouOwe;
