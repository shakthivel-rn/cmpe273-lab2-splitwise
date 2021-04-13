/* eslint-disable no-underscore-dangle */
const express = require('express');
const kafka = require('../kafka/client');
const { checkAuth } = require('../Utils/passport');

const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
  kafka.make_request('get-invited-groups', req.query, (err, result) => {
    res.send(result);
  });
});

router.post('/acceptGroupInvite', checkAuth, async (req, res) => {
  kafka.make_request('accept-group-invite', req.body, (err, result) => {
    res.sendStatus(result);
  });
});

router.post('/leaveGroup', checkAuth, async (req, res) => {
  kafka.make_request('leave-group', req.body, (err, result) => {
    res.sendStatus(result);
  });
  /* let status = 401;
  const user = await Users.findOne({ _id: req.body.userId });
  const group = await Groups.findOne({ name: req.body.groupName });
  const groupOwedAmount = await Transactions.aggregate(
    [{
      $match: {
        groupName: req.body.groupName,
        owedUserId: user._id,
        paymentStatus: false,
      },
    },
    {
      $group: {
        _id: null,
        totalOwedAmount: {
          $sum: '$splitAmount',
        },
      },
    },
    ],
  );
  if (groupOwedAmount.length === 0) {
    const elementPos = user.joinedGroups.map((x) => x._id).indexOf(group._id);
    user.joinedGroups.splice(elementPos, 1);
    user.save();
    const groupElementPos = group.groupMembers.map((x) => x._id).indexOf(user._id);
    group.groupMembers.splice(groupElementPos, 1);
    group.save();
    status = 200;
  }
  res.sendStatus(status); */
});

module.exports = router;
