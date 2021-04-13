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
});

module.exports = router;
