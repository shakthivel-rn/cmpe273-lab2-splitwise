/* eslint-disable no-underscore-dangle */
const express = require('express');
const Users = require('../ModelsMongoDB/Users');
const Groups = require('../ModelsMongoDB/Groups');
const Transactions = require('../ModelsMongoDB/Transactions');

const router = express.Router();

router.post('/', async (req, res) => {
  const creatorUser = await Users.findOne({ _id: req.body.userId });
  const group = await Groups.findOne({ _id: req.body.groupId });
  const otherUsers = await Users.find({ _id: group.groupMembers });
  if (group.groupMembers.length > 1) {
    const transactions = group.groupMembers.map((groupMember) => {
      if (groupMember.equals(creatorUser._id)) {
        const transactionModel = new Transactions({
          groupName: group.name,
          expenseDescription: req.body.expenseDescription,
          expenseAmount: req.body.expenseAmount,
          paidUserId: creatorUser._id,
          owedUserId: groupMember._id,
          splitAmount: (req.body.expenseAmount / group.groupMembers.length).toFixed(2),
          paymentStatus: true,
        });
        return transactionModel;
      }
      const transactionModel = new Transactions({
        groupName: group.name,
        expenseDescription: req.body.expenseDescription,
        expenseAmount: req.body.expenseAmount,
        paidUserId: creatorUser._id,
        owedUserId: groupMember._id,
        splitAmount: (req.body.expenseAmount / group.groupMembers.length).toFixed(2),
        paymentStatus: false,
      });
      return transactionModel;
    });
    const allTransactions = await Transactions.insertMany(transactions);
    const transactionIds = allTransactions.map((allTransaction) => allTransaction._id);
    group.groupTransactions = [...group.groupTransactions, ...transactionIds];
    group.save();
    otherUsers.forEach((otherUser) => {
      const newOtherUser = otherUser;
      newOtherUser.transactions.push.apply(otherUser.transactions, transactionIds);
      newOtherUser.save();
    });
  }
  res.send();
});
module.exports = router;
