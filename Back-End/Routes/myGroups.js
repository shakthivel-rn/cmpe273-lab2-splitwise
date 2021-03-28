const express = require('express');
const UsersGroups = require('../models/Users_Groups')();
const Users = require('../models/Users')();
const Groups = require('../models/Groups')();
const Transactions = require('../models/Transactions')();

const router = express.Router();

router.get('/', async (req, res) => {
  const pendingInvites = await UsersGroups.findAll({
    where: {
      user_id: req.query.userId,
      invite_status: false,
    },
  });

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

  const inviteDetails = pendingInvites.map((pendingInvite) => ({
    groupId: pendingInvite.dataValues.group_id,
    groupName: groupNames[pendingInvite.dataValues.group_id],
    creatorUser: userNames[pendingInvite.dataValues.creator_id],
    creatorId: pendingInvite.dataValues.creator_id,
  }
  ));
  res.send(inviteDetails);
});

router.post('/acceptGroupInvite', async (req, res) => {
  await UsersGroups.update({ invite_status: true }, {
    where: {
      user_id: req.body.userId,
      group_id: req.body.groupId,
    },
  });
  res.sendStatus(200);
});

router.post('/leaveGroup', async (req, res) => {
  let status = 500;
  const groupOwedAmount = await Transactions.sum('split_amount',
    {
      where: {
        group_id: req.body.groupId,
        owed_user_id: req.body.userId,
        status: 0,
      },
    });
  if (groupOwedAmount === 0) {
    await UsersGroups.update({ invite_status: false }, {
      where: {
        user_id: req.body.userId,
        group_id: req.body.groupId,
      },
    });
    status = 200;
  }
  res.sendStatus(status);
});

module.exports = router;
