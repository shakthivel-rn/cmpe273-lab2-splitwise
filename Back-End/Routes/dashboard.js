const express = require('express');
const Sequelize = require('sequelize');
const Transactions = require('../models/Transactions')();
const Groups = require('../models/Groups')();
const UsersGroups = require('../models/Users_Groups')();
const Users = require('../models/Users')();
const { checkAuth } = require('../Utils/passport');

const router = express.Router();

router.get('/sample', checkAuth, (req, res) => {
  res.send('You are authorized');
});

router.get('/getGroupNames', async (req, res) => {
  const memberGroups = await UsersGroups.findAll({
    where: {
      user_id: req.query.userId,
      invite_status: true,
    },
  });
  const groupIds = memberGroups.map((memberGroup) => memberGroup.dataValues.group_id);
  let groupNames = await Groups.findAll({
    where: {
      group_id: groupIds,
    },
    attributes: ['group_id', 'group_name'],
  });
  groupNames = JSON.parse(JSON.stringify(groupNames));
  res.send(groupNames);
});

router.get('/getTotalPaidAndOwedAmount', async (req, res) => {
  const totalPaidAmount = await Transactions.sum('split_amount',
    {
      where: {
        paid_user_id: req.query.userId,
        status: 0,
      },
    });
  const totalOwedAmount = await Transactions.sum('split_amount',
    {
      where: {
        owed_user_id: req.query.userId,
        status: 0,
      },
    });
  res.send({ totalPaidAmount, totalOwedAmount });
});

router.get('/getIndividualOwedAmount', async (req, res) => {
  const allUsers = await Users.findAll({
    attributes: ['user_id', 'name'],
  });
  const allGroups = await Groups.findAll({
    attributes: ['group_id', 'group_name'],
  });
  const userNames = {};
  const groupNames = {};
  allUsers.forEach((eachUser) => {
    userNames[eachUser.dataValues.user_id] = eachUser.dataValues.name;
  });
  allGroups.forEach((eachGroup) => {
    groupNames[eachGroup.dataValues.group_id] = eachGroup.dataValues.group_name;
  });
  const individualOwedAmounts = await Transactions.findAll({
    attributes: [
      'group_id',
      'paid_user_id',
      [Sequelize.fn('sum', Sequelize.col('split_amount')), 'individual_owed_amount'],
    ],
    group: [
      'group_id',
      'paid_user_id',
    ],
    where: {
      owed_user_id: req.query.userId,
      status: 0,
    },
  });
  const result = individualOwedAmounts.map((individualOwedAmount) => ({
    groupName: groupNames[individualOwedAmount.dataValues.group_id],
    paidUserName: userNames[individualOwedAmount.dataValues.paid_user_id],
    individualOwedAmount: individualOwedAmount.dataValues.individual_owed_amount,
  }));
  res.send(result);
});

router.get('/getIndividualPaidAmount', async (req, res) => {
  const allUsers = await Users.findAll({
    attributes: ['user_id', 'name'],
  });
  const allGroups = await Groups.findAll({
    attributes: ['group_id', 'group_name'],
  });
  const userNames = {};
  const groupNames = {};
  allUsers.forEach((eachUser) => {
    userNames[eachUser.dataValues.user_id] = eachUser.dataValues.name;
  });
  allGroups.forEach((eachGroup) => {
    groupNames[eachGroup.dataValues.group_id] = eachGroup.dataValues.group_name;
  });
  const individualPaidsAmounts = await Transactions.findAll({
    attributes: [
      'group_id',
      'owed_user_id',
      [Sequelize.fn('sum', Sequelize.col('split_amount')), 'individual_paid_amount'],
    ],
    group: [
      'group_id',
      'owed_user_id',
    ],
    where: {
      paid_user_id: req.query.userId,
      status: 0,
    },
  });
  const result = individualPaidsAmounts.map((individualPaidAmount) => ({
    groupName: groupNames[individualPaidAmount.dataValues.group_id],
    owedUserName: userNames[individualPaidAmount.dataValues.owed_user_id],
    individualPaidAmount: individualPaidAmount.dataValues.individual_paid_amount,
  }));
  res.send(result);
});

router.get('/getSettleModalDetails', async (req, res) => {
  /* const memberGroups = await UsersGroups.findAll({
    where: {
      user_id: req.query.userId,
      invite_status: true,
    },
  });
  const groupIds = memberGroups.map((memberGroup) => memberGroup.dataValues.group_id);
  const groupMembers = await UsersGroups.findAll({
    where: {
      group_id: groupIds,
      invite_status: true,
    },
  });
  let memberIds = [];
  groupMembers.forEach((groupMember) => {
    if (groupMember.dataValues.user_id !== Number(req.query.userId)) {
      memberIds.push(groupMember.dataValues.user_id);
    }
  }); */
  const groupMembers = await Transactions.findAll({
    where: {
      owed_user_id: req.query.userId,
      status: 0,
    },
  });
  let memberIds = groupMembers.map((groupMember) => (groupMember.dataValues.paid_user_id));
  memberIds = [...new Set(memberIds)];
  const groupFriends = await Users.findAll({
    where: {
      user_id: memberIds,
    },
    attributes: ['user_id', 'name'],
  });
  res.send(JSON.parse(JSON.stringify(groupFriends)));
});

router.post('/settleAmount', async (req, res) => {
  await Transactions.update({ status: true }, {
    where: {
      owed_user_id: req.body.userId,
      paid_user_id: req.body.friendId,
    },
  });
  res.sendStatus(200);
});

module.exports = router;
