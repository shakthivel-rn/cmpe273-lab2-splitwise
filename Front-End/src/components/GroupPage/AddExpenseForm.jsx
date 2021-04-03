import React, { Component } from 'react';
import '../../App.css';
import './AddExpenseForm.css';
import axios from 'axios';
import {
  Button, Form,
} from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Redirect } from 'react-router';

class AddExpenseForm extends Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line react/prop-types
    const { groupId } = props;
    this.state = {
      userId: localStorage.getItem('userId'),
      groupId,
      expenseDescription: '',
      expenseAmount: 0,
      membersNotAcceptedFlag: false,
      expenseCreatedFlag: false,
      redirectPage: '',
    };
    this.handleChangeExpenseDescription = this.handleChangeExpenseDescription.bind(this);
    this.handleChangeExpenseAmount = this.handleChangeExpenseAmount.bind(this);
    this.submitExpense = this.submitExpense.bind(this);
  }

  handleChangeExpenseDescription = (e) => {
    this.setState({
      expenseDescription: e.target.value,
    });
  }

  handleChangeExpenseAmount = (e) => {
    this.setState({
      expenseAmount: e.target.value,
    });
  }

  submitExpense = (e) => {
    e.preventDefault();
    const {
      userId,
    } = this.state;
    const {
      groupId, expenseDescription, expenseAmount,
    } = this.state;
    // userId = Number(userId);
    const data = {
      userId,
      groupId,
      expenseDescription,
      expenseAmount,
    };
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3001/createExpense', data)
      .then(() => {
        this.setState({
          expenseCreatedFlag: true,
        });
      })
      .catch(() => {
        this.setState({
          membersNotAcceptedFlag: true,
        });
      });
  }

  render() {
    const { membersNotAcceptedFlag, expenseCreatedFlag, redirectPage } = this.state;
    return (
      <div>
        {expenseCreatedFlag ? (
          <SweetAlert
            success
            title="Expense created"
            onConfirm={() => {
              this.setState({
                redirectPage: <Redirect to="/dashboard" />,
              });
            }}
          />
        ) : null}
        {membersNotAcceptedFlag ? (
          <SweetAlert
            warning
            title="Members invite status pending"
            onConfirm={() => {
              this.setState({
                membersNotAcceptedFlag: false,
              });
            }}
          />
        ) : null}
        {redirectPage}
        <div className="expenseForm">
          <Form method="post" onSubmit={this.submitExpense}>
            <Form.Group controlId="formExpenseDescription">
              <Form.Control onChange={this.handleChangeExpenseDescription} type="text" placeholder="Enter a description" />
            </Form.Group>

            <Form.Group controlId="formExpenseAmount">
              <Form.Control onChange={this.handleChangeExpenseAmount} type="number" placeholder="$ 0.0" />
            </Form.Group>
            <Button id="submitExpenseButton" type="submit">Save</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default AddExpenseForm;
