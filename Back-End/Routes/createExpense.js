/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const { checkAuth } = require('../Utils/passport');
const kafka = require('../kafka/client');

const router = express.Router();

router.post('/', checkAuth, async (req, res) => {
  console.log('Inside Create Expense POST!');
  console.log('Request Body: ', req.body);
  kafka.make_request('create-expense', req.body, (err, result) => {
    if (result === 401) {
      res.status(401);
    } else {
      res.status(200);
    }
    console.log(result);
    res.send();
  });
});
module.exports = router;
