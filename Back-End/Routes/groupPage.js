/* eslint-disable no-underscore-dangle */
const express = require('express');
const Users = require('../ModelsMongoDB/Users');
const Transactions = require('../ModelsMongoDB/Transactions');

const router = express.Router();

router.get('/', async (req, res) => {
  const allUsers = await Users.find({});
  const allUsersNames = {};
  allUsers.forEach((allUser) => {
    allUsersNames[allUser._id] = allUser.name;
  });
  const user = await Users.findOne({ _id: req.query.userId });
  const groupTransactions = await Transactions.find({ groupName: req.query.groupName }).sort({ time: 'desc' });
  const result = groupTransactions.map((groupTransaction) => {
    if (groupTransaction.paidUserId.equals(groupTransaction.owedUserId)
      && groupTransaction.paidUserId.equals(user._id)) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        paidUserName: 'You',
        owedUserName: 'You',
        splitAmount: groupTransaction.splitAmount,
        status: 'added',
      });
    }

    if (groupTransaction.paidUserId.equals(groupTransaction.owedUserId)) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        paidUserName: allUsersNames[groupTransaction.paidUserId],
        owedUserName: allUsersNames[groupTransaction.owedUserId],
        splitAmount: groupTransaction.splitAmount,
        status: 'added',
      });
    }

    if (groupTransaction.paymentStatus === true
      && groupTransaction.paidUserId.equals(user._id)) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        paidUserName: 'You',
        owedUserName: allUsersNames[groupTransaction.owedUserId],
        splitAmount: groupTransaction.splitAmount,
        status: 'paid',
      });
    }

    if (groupTransaction.paymentStatus === true
      && groupTransaction.owedUserId.equals(user._id)) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        paidUserName: allUsersNames[groupTransaction.paidUserId],
        owedUserName: 'You',
        splitAmount: groupTransaction.splitAmount,
        status: 'paid',
      });
    }
    if (groupTransaction.paymentStatus === true) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        paidUserName: allUsersNames[groupTransaction.paidUserId],
        owedUserName: allUsersNames[groupTransaction.owedUserId],
        splitAmount: groupTransaction.splitAmount,
        status: 'paid',
      });
    }

    if (groupTransaction.paidUserId.equals(user._id)) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        paidUserName: 'You',
        owedUserName: allUsersNames[groupTransaction.owedUserId],
        splitAmount: groupTransaction.splitAmount,
        status: 'owes',
      });
    }

    if (groupTransaction.owedUserId.equals(user._id)) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        paidUserName: allUsersNames[groupTransaction.paidUserId],
        owedUserName: 'You',
        splitAmount: groupTransaction.splitAmount,
        status: 'owes',
      });
    }

    return ({
      expenseName: groupTransaction.expenseDescription,
      expenseAmount: groupTransaction.expenseAmount,
      paidUserName: allUsersNames[groupTransaction.paidUserId],
      owedUserName: allUsersNames[groupTransaction.owedUserId],
      splitAmount: groupTransaction.splitAmount,
      status: 'owes',
    });
  });
  /* const allUsers = await Users.findAll({
    attributes: ['user_id', 'name'],
  });
  const allExpenses = await Expenses.findAll({
    attributes: ['expense_id', 'expense_description', 'expense_amount'],
  });
  const userNames = {};
  const expenseNames = {};
  const expenseAmount = {};
  allUsers.forEach((eachUser) => {
    userNames[eachUser.dataValues.user_id] = eachUser.dataValues.name;
  });
  allExpenses.forEach((eachExpense) => {
    expenseNames[eachExpense.dataValues.expense_id] = eachExpense.dataValues.expense_description;
    expenseAmount[eachExpense.dataValues.expense_id] = eachExpense.dataValues.expense_amount;
  });
  const groupTransactions = await Transactions.findAll({
    attributes: [
      'expense_id',
      'paid_user_id',
      'owed_user_id',
      'split_amount',
      'status',
    ],
    where: {
      group_id: req.query.groupId,
    },
    order: [
      ['createdAt', 'DESC'],
    ],
  });
  const result = groupTransactions.map((groupTransaction) => {
    if (groupTransaction.dataValues.paid_user_id === groupTransaction.dataValues.owed_user_id
      && groupTransaction.dataValues.paid_user_id === Number(req.query.userId)) {
      return ({
        expenseName: expenseNames[groupTransaction.dataValues.expense_id],
        expenseAmount: expenseAmount[groupTransaction.dataValues.expense_id],
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
        paidUserName: userNames[groupTransaction.dataValues.paid_user_id],
        owedUserName: 'You',
        splitAmount: groupTransaction.dataValues.split_amount,
        status: 'owes',
      });
    }

    return ({
      expenseName: expenseNames[groupTransaction.dataValues.expense_id],
      expenseAmount: expenseAmount[groupTransaction.dataValues.expense_id],
      paidUserName: userNames[groupTransaction.dataValues.paid_user_id],
      owedUserName: userNames[groupTransaction.dataValues.owed_user_id],
      splitAmount: groupTransaction.dataValues.split_amount,
      status: 'owes',
    });
  });
  res.status(200).send(result); */
  res.send(result);
});

module.exports = router;
