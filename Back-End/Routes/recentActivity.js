/* eslint-disable no-underscore-dangle */
const express = require('express');
const kafka = require('../kafka/client');
const { checkAuth } = require('../Utils/passport');

const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
  kafka.make_request('get-recent-activity', req.query, (err, result) => {
    res.send(result);
  });
});

router.get('/getPaginationNumbers', checkAuth, async (req, res) => {
  kafka.make_request('get-pagination-number', req.query, (err, result) => {
    res.send(result);
  });
  /* const user = await Users.findOne({ _id: req.query.userId });
  const groupIds = user.joinedGroups;
  const memberGroups = await Groups.find({ _id: groupIds });
  const memberGroupsNames = memberGroups.map((memberGroup) => memberGroup.name);
  const { selectedGroup } = req.query;
  let groupTransactions = [];
  if (selectedGroup === 'All') {
    groupTransactions = await Transactions.
    find({ groupName: memberGroupsNames }).sort({ time: 'desc' });
  } else {
    groupTransactions = await Transactions.
    find({ groupName: selectedGroup }).sort({ time: 'desc' });
  }
  const { pageSize } = req.query;
  const paginationNumber = (groupTransactions.length / pageSize);
  res.send({ paginationNumber: Math.ceil(paginationNumber) }); */
});

module.exports = router;
