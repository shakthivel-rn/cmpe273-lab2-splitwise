/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const { checkAuth } = require('../Utils/passport');
const kafka = require('../kafka/client');

const router = express.Router();

router.post('/', checkAuth, async (req, res) => {
  kafka.make_request('create-expense', req.body, (err, result) => {
    res.sendStatus(result);
  });
});
module.exports = router;
