/* eslint-disable no-underscore-dangle */
const express = require('express');
const kafka = require('../kafka/client');

const { checkAuth } = require('../Utils/passport');

const router = express.Router();

router.get('/getGroupNames', checkAuth, async (req, res) => {
  kafka.make_request('get-group-names', req.query, (err, result) => {
    res.send(result);
  });
});

router.get('/getTotalPaidAndOwedAmount', checkAuth, async (req, res) => {
  kafka.make_request('get-dashboard-box', req.query, (err, result) => {
    res.send(result);
  });
});

router.get('/getIndividualOwedAmount', checkAuth, async (req, res) => {
  kafka.make_request('get-you-owe', req.query, (err, result) => {
    res.send(result);
  });
});

router.get('/getIndividualPaidAmount', checkAuth, async (req, res) => {
  kafka.make_request('get-you-are-owed', req.query, (err, result) => {
    res.send(result);
  });
});

router.get('/getSettleModalDetails', checkAuth, async (req, res) => {
  kafka.make_request('get-settle-modal', req.query, (err, result) => {
    res.send(result);
  });
});

router.post('/settleAmount', checkAuth, async (req, res) => {
  kafka.make_request('settle-amount', req.body, (err, result) => {
    console.log(result);
    res.sendStatus(200);
  });
});

module.exports = router;
