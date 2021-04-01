/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const Users = require('../ModelsMongoDB/Users');
const Groups = require('../ModelsMongoDB/Groups');

const router = express.Router();

router.post('/acceptGroupInvite', async (req, res) => {
  const group = await Groups.findOne({ _id: req.body.groupId });
  const user = await Users.findOne({ _id: req.body.userId });
  group.groupMembers.push(user._id);
  await group.save();
  const elementPos = user.invitedGroups.map((x) => x._id).indexOf(req.body.groupId);
  user.joinedGroups.push(user.invitedGroups[elementPos]);
  user.invitedGroups.splice(elementPos, elementPos + 1);
  await user.save();
  res.send();
});

/* router.get('/', async (req, res) => {

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
  res.send();
}); */

module.exports = router;
