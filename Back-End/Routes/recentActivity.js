/* eslint-disable no-underscore-dangle */
const express = require('express');
const Users = require('../ModelsMongoDB/Users');
const Groups = require('../ModelsMongoDB/Groups');
const Transactions = require('../ModelsMongoDB/Transactions');

const router = express.Router();

router.get('/', async (req, res) => {
  const allUsers = await Users.find({});
  const allUsersNames = {};
  allUsers.forEach((allUser) => {
    allUsersNames[allUser._id] = allUser.name;
  });
  const user = await Users.findOne({ _id: req.query.userId });
  const groupIds = user.joinedGroups;
  const memberGroups = await Groups.find({ _id: groupIds });
  const memberGroupsNames = memberGroups.map((memberGroup) => memberGroup.name);
  const groupTransactions = await Transactions.find({ groupName: memberGroupsNames }).sort({ time: 'desc' });
  const result = groupTransactions.map((groupTransaction) => {
    if (groupTransaction.paidUserId.equals(groupTransaction.owedUserId)
      && groupTransaction.paidUserId.equals(user._id)) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        groupName: groupTransaction.groupName,
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
        groupName: groupTransaction.groupName,
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
        groupName: groupTransaction.groupName,
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
        groupName: groupTransaction.groupName,
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
        groupName: groupTransaction.groupName,
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
        groupName: groupTransaction.groupName,
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
        groupName: groupTransaction.groupName,
        paidUserName: allUsersNames[groupTransaction.paidUserId],
        owedUserName: 'You',
        splitAmount: groupTransaction.splitAmount,
        status: 'owes',
      });
    }

    return ({
      expenseName: groupTransaction.expenseDescription,
      expenseAmount: groupTransaction.expenseAmount,
      groupName: groupTransaction.groupName,
      paidUserName: allUsersNames[groupTransaction.paidUserId],
      owedUserName: allUsersNames[groupTransaction.owedUserId],
      splitAmount: groupTransaction.splitAmount,
      status: 'owes',
    });
  });
  res.send(result);
});

module.exports = router;
