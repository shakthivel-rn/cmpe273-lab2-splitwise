/* eslint-disable no-underscore-dangle */
const express = require('express');
const Groups = require('../ModelsMongoDB/Groups');
const kafka = require('../kafka/client');
const { checkAuth } = require('../Utils/passport');

const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
  kafka.make_request('get-group-data', req.query, (err, result) => {
    res.send(result);
  });
});

router.get('/getExpenseDetail', checkAuth, async (req, res) => {
  kafka.make_request('get-expense-details', req.query, (err, result) => {
    res.send(result);
  });
});

router.post('/postComment', checkAuth, async (req, res) => {
  kafka.make_request('post-comment', req.body, (err, result) => {
    res.sendStatus(result);
  });
});

router.get('/getComments', checkAuth, async (req, res) => {
  kafka.make_request('get-comments', req.query, (err, result) => {
    res.send(result);
  });
});

router.post('/deleteComment', checkAuth, async (req, res) => {
  kafka.make_request('delete-comment', req.body, (err, result) => {
    res.sendStatus(result);
  });
});

router.get('/getImage', async (req, res) => {
  const group = await Groups.findOne({ name: req.query.groupName }, { image: 1 });
  res.send(group);
});

module.exports = router;
