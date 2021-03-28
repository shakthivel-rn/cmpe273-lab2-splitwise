const express = require('express');
const Users = require('../models/Users')();
const Groups = require('../models/Groups')();
const UsersGroups = require('../models/Users_Groups')();

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const group = await Groups.create(
      {
        group_name: req.body.groupName,
      },
    );
    await UsersGroups.create(
      {
        user_id: req.body.userId,
        group_id: group.dataValues.group_id,
        creator_id: req.body.userId,
        invite_status: true,
      },
    );
    console.log(req.body.memberEmails);
    const members = await Users.findAll({
      where: {
        email: req.body.memberEmails,
      },
    });
    const finalMap = members.map((member) => ({
      user_id: member.dataValues.user_id,
      group_id: group.dataValues.group_id,
      creator_id: req.body.userId,
      invite_status: false,
    }));
    await UsersGroups.bulkCreate(finalMap);
    res.status(200);
  } catch (e) {
    res.status(500);
  } finally {
    res.send();
  }
});

router.get('/getMemberEmails', async (req, res) => {
  const memberEmails = await Users.findAll({
    attributes: ['email'],
  });
  res.send(memberEmails);
});

module.exports = router;
