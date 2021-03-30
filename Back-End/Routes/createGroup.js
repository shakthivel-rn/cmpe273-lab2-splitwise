const express = require('express');
const Users = require('../ModelsMongoDB/Users');
const Groups = require('../ModelsMongoDB/Groups');

const router = express.Router();

router.post('/', async (req, res) => {
  const creatorUser = await Users.findOne({ _id: req.body.userId });
  const otherUsers = await Users.find({ email: req.body.memberEmails });
  const newGroupModel = new Groups({
    name: req.body.groupName,
    creatorId: req.body.userId,
  });
  newGroupModel.groupMembers.push(req.body.userId);
  await newGroupModel.save();
  creatorUser.joinedGroups.push(newGroupModel);
  await creatorUser.save();
  otherUsers.forEach((otherUser) => {
    otherUser.invitedGroups.push(newGroupModel);
    otherUser.save();
  });
  /* creatorUser.joinedGroups.push(newGroupModel);
  otherUsers.forEach((otherUser) => {
    otherUser.invitedGroups.push(newGroupModel);
  });
  console.log(newGroupModel);
  console.log(creatorUser);
  console.log(otherUsers); */
  res.send();
});

router.get('/getMemberEmails', async (req, res) => {
  const memberEmails = await Users.findAll({
    attributes: ['email'],
  });
  res.send(memberEmails);
});

module.exports = router;
