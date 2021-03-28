const express = require('express');
const encrypt = require('../Encryption/encryption');
// const Users = require('../models/Users');
const Users = require('../models/Users')();

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Inside Login Post Request');
  console.log('Req Body: ', req.body);
  let status = 500;
  let userData = {};
  const users = await Users.findAll({
    attributes: ['user_id', 'name', 'email', 'password'],
  });
  users.forEach((user) => {
    if (user.dataValues.email === req.body.email) {
      const encryptedPassword = encrypt(req.body.password);
      if (user.dataValues.password === encryptedPassword) {
        res.cookie('cookie', user.dataValues.user_id, { maxAge: 900000, httpOnly: false, path: '/' });
        req.session.user = user;
        status = 200;
        userData = {
          id: user.dataValues.user_id,
          name: user.dataValues.name,
          email: user.dataValues.email,
        };
      }
    }
  });
  console.log(users);
  res.status(status);
  res.send(userData);
});

module.exports = router;
