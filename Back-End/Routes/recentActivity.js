const express = require('express');
const UsersGroups = require('../models/Users_Groups')();
const Users = require('../models/Users')();
const Expenses = require('../models/Expenses')();
const Transactions = require('../models/Transactions')();
const Groups = require('../models/Groups')();

const router = express.Router();

router.get('/', async (req, res) => {
  const memberGroups = await UsersGroups.findAll({
    where: {
      user_id: req.query.userId,
    },
    attributes: ['group_id'],
  });
  const groupIds = memberGroups.map((memberGroup) => memberGroup.dataValues.group_id);
  const allUsers = await Users.findAll({
    attributes: ['user_id', 'name'],
  });
  const allExpenses = await Expenses.findAll({
    attributes: ['expense_id', 'expense_description', 'expense_amount'],
  });
  const allGroups = await Groups.findAll({
    attributes: ['group_id', 'group_name'],
  });
  const userNames = {};
  const expenseNames = {};
  const groupNames = {};
  const expenseAmount = {};
  allUsers.forEach((eachUser) => {
    userNames[eachUser.dataValues.user_id] = eachUser.dataValues.name;
  });
  allExpenses.forEach((eachExpense) => {
    expenseNames[eachExpense.dataValues.expense_id] = eachExpense.dataValues.expense_description;
    expenseAmount[eachExpense.dataValues.expense_id] = eachExpense.dataValues.expense_amount;
  });
  allGroups.forEach((eachGroup) => {
    groupNames[eachGroup.dataValues.group_id] = eachGroup.dataValues.group_name;
  });
  const groupTransactions = await Transactions.findAll({
    attributes: [
      'expense_id',
      'group_id',
      'paid_user_id',
      'owed_user_id',
      'split_amount',
      'status',
    ],
    where: {
      group_id: groupIds,
    },
    order: [
      ['updatedAt', 'DESC'],
    ],
  });
  const result = groupTransactions.map((groupTransaction) => {
    if (groupTransaction.dataValues.paid_user_id === groupTransaction.dataValues.owed_user_id
      && groupTransaction.dataValues.paid_user_id === Number(req.query.userId)) {
      return ({
        expenseName: expenseNames[groupTransaction.dataValues.expense_id],
        expenseAmount: expenseAmount[groupTransaction.dataValues.expense_id],
        groupName: groupNames[groupTransaction.dataValues.group_id],
        paidUserName: 'You',
        owedUserName: 'You',
        splitAmount: groupTransaction.dataValues.split_amount,
        status: 'added',
      });
    }

    if (groupTransaction.dataValues.paid_user_id === groupTransaction.dataValues.owed_user_id) {
      return ({
        expenseName: expenseNames[groupTransaction.dataValues.expense_id],
        expenseAmount: expenseAmount[groupTransaction.dataValues.expense_id],
        groupName: groupNames[groupTransaction.dataValues.group_id],
        paidUserName: userNames[groupTransaction.dataValues.paid_user_id],
        owedUserName: userNames[groupTransaction.dataValues.owed_user_id],
        splitAmount: groupTransaction.dataValues.split_amount,
        status: 'added',
      });
    }

    if (groupTransaction.dataValues.status === true
      && groupTransaction.dataValues.paid_user_id === Number(req.query.userId)) {
      return ({
        expenseName: expenseNames[groupTransaction.dataValues.expense_id],
        expenseAmount: expenseAmount[groupTransaction.dataValues.expense_id],
        groupName: groupNames[groupTransaction.dataValues.group_id],
        paidUserName: 'You',
        owedUserName: userNames[groupTransaction.dataValues.owed_user_id],
        splitAmount: groupTransaction.dataValues.split_amount,
        status: 'paid',
      });
    }

    if (groupTransaction.dataValues.status === true
      && groupTransaction.dataValues.owed_user_id === Number(req.query.userId)) {
      return ({
        expenseName: expenseNames[groupTransaction.dataValues.expense_id],
        expenseAmount: expenseAmount[groupTransaction.dataValues.expense_id],
        groupName: groupNames[groupTransaction.dataValues.group_id],
        paidUserName: userNames[groupTransaction.dataValues.paid_user_id],
        owedUserName: 'You',
        splitAmount: groupTransaction.dataValues.split_amount,
        status: 'paid',
      });
    }

    if (groupTransaction.dataValues.status === true) {
      return ({
        expenseName: expenseNames[groupTransaction.dataValues.expense_id],
        expenseAmount: expenseAmount[groupTransaction.dataValues.expense_id],
        groupName: groupNames[groupTransaction.dataValues.group_id],
        paidUserName: userNames[groupTransaction.dataValues.paid_user_id],
        owedUserName: userNames[groupTransaction.dataValues.owed_user_id],
        splitAmount: groupTransaction.dataValues.split_amount,
        status: 'paid',
      });
    }

    if (groupTransaction.dataValues.paid_user_id === Number(req.query.userId)) {
      return ({
        expenseName: expenseNames[groupTransaction.dataValues.expense_id],
        expenseAmount: expenseAmount[groupTransaction.dataValues.expense_id],
        groupName: groupNames[groupTransaction.dataValues.group_id],
        paidUserName: 'You',
        owedUserName: userNames[groupTransaction.dataValues.owed_user_id],
        splitAmount: groupTransaction.dataValues.split_amount,
        status: 'owes',
      });
    }

    if (groupTransaction.dataValues.owed_user_id === Number(req.query.userId)) {
      return ({
        expenseName: expenseNames[groupTransaction.dataValues.expense_id],
        expenseAmount: expenseAmount[groupTransaction.dataValues.expense_id],
        groupName: groupNames[groupTransaction.dataValues.group_id],
        paidUserName: userNames[groupTransaction.dataValues.paid_user_id],
        owedUserName: 'You',
        splitAmount: groupTransaction.dataValues.split_amount,
        status: 'owes',
      });
    }

    return ({
      expenseName: expenseNames[groupTransaction.dataValues.expense_id],
      expenseAmount: expenseAmount[groupTransaction.dataValues.expense_id],
      groupName: groupNames[groupTransaction.dataValues.group_id],
      paidUserName: userNames[groupTransaction.dataValues.paid_user_id],
      owedUserName: userNames[groupTransaction.dataValues.owed_user_id],
      splitAmount: groupTransaction.dataValues.split_amount,
      status: 'owes',
    });
  });
  res.send(result);
});

module.exports = router;
