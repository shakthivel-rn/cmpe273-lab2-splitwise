/* eslint-disable no-underscore-dangle */
const express = require('express');
const Users = require('../ModelsMongoDB/Users');
const Groups = require('../ModelsMongoDB/Groups');

const router = express.Router();

router.post('/', async (req, res) => {
  const creatorUser = await Users.findOne({ _id: req.body.userId });
  const otherUsers = await Users.find({ email: req.body.memberEmails });
  const newGroupModel = new Groups({
    name: req.body.groupName,
    creatorId: creatorUser._id,
  });
  newGroupModel.groupMembers.push(creatorUser._id);
  const newGroup = await newGroupModel.save();
  creatorUser.joinedGroups.push(newGroup._id);
  creatorUser.save();
  otherUsers.forEach((otherUser) => {
    otherUser.invitedGroups.push(newGroup._id);
    otherUser.save();
  });
  res.send();
});

router.get('/getMemberEmails', async (req, res) => {
  const memberEmails = await Users.findAll({
    attributes: ['email'],
  });
  res.send(memberEmails);
});

module.exports = router;
