const express = require('express');
const jwt = require('jsonwebtoken');
const { secret } = require('../Utils/config');
const kafka = require('../kafka/client');
const { auth } = require('../Utils/passport');

const router = express.Router();

auth();

router.post('/', async (req, res) => {
  kafka.make_request('login', req.body, (err, result) => {
    if (result === 401) {
      res.sendStatus(401);
    } else {
      req.session.user = result;
      const { _id, name } = result;
      const payload = { _id, name };
      const token = jwt.sign(payload, secret, {
        expiresIn: 1008000,
      });
      res.status(200).send(`JWT ${token}`);
    }
  });
});

module.exports = router;
