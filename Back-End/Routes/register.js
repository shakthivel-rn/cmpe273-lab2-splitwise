const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../Utils/config');
const kafka = require('../kafka/client');
const { auth } = require('../Utils/passport');

const router = express.Router();

auth();

const encryptionMiddleware = (req, res, next) => {
  bcrypt.genSalt(10, (err1, salt) => {
    bcrypt.hash(req.body.password, salt, (err2, hash) => {
      req.body.password = hash;
      next();
    });
  });
};

const registerUser = async (req, res) => {
  kafka.make_request('register', req.body, (err, result) => {
    if (result === 400) {
      res.sendStatus(400);
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
};

router.post('/', encryptionMiddleware, registerUser);

module.exports = router;
