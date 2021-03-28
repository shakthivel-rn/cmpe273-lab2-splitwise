const express = require('express');
const UsersGroups = require('../models/Users_Groups')();
const Expenses = require('../models/Expenses')();
const Transactions = require('../models/Transactions')();

const router = express.Router();

router.post('/', async (req, res) => {
  let status = 500;
  const groupMembers = await UsersGroups.findAll({
    where: {
      group_id: req.body.groupId,
      invite_status: true,
    },
  });
  const groupMembersList = groupMembers.map((groupMember) => groupMember.user_id);
  if (groupMembersList.length > 1) {
    const expense = await Expenses.create({
      group_id: req.body.groupId,
      expense_description: req.body.expenseDescription,
      expense_amount: req.body.expenseAmount,
    });
    const splitAmount = (expense.dataValues.expense_amount / groupMembers.length);
    const finalMap = groupMembers.map((groupMember) => (
      req.body.userId === groupMember.dataValues.user_id
        ? {
          group_id: req.body.groupId,
          expense_id: expense.dataValues.expense_id,
          paid_user_id: req.body.userId,
          owed_user_id: groupMember.user_id,
          split_amount: splitAmount,
          status: true,
        }
        : {
          group_id: req.body.groupId,
          expense_id: expense.dataValues.expense_id,
          paid_user_id: req.body.userId,
          owed_user_id: groupMember.user_id,
          split_amount: splitAmount,
          status: false,
        }));
    await Transactions.bulkCreate(finalMap);
    status = 200;
  }
  res.sendStatus(status);
});
module.exports = router;
