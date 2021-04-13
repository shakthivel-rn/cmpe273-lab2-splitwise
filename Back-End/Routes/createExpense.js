/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const { checkAuth } = require('../Utils/passport');
const kafka = require('../kafka/client');

const router = express.Router();

router.post('/', checkAuth, async (req, res) => {
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
