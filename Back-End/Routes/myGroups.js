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
});

module.exports = router;
