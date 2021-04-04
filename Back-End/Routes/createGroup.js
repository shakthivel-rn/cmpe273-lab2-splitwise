/* eslint-disable no-underscore-dangle */
const express = require('express');
const Users = require('../ModelsMongoDB/Users');
const Groups = require('../ModelsMongoDB/Groups');
const { checkAuth } = require('../Utils/passport');

const router = express.Router();

router.post('/', checkAuth, async (req, res) => {
  const existingGroup = await Groups.findOne({ name: req.body.groupName });
  if (existingGroup === null) {
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
    res.status(200);
  } else {
    res.status(400);
  }
  res.send();
});

router.get('/getMemberEmails', checkAuth, async (req, res) => {
  const memberEmails = await Users.find({}, { email: 1 });
  res.send(memberEmails);
});

module.exports = router;
