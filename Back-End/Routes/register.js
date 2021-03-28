const express = require('express');
const Users = require('../models/Users')();
const encrypt = require('../Encryption/encryption');

const router = express.Router();

router.post('/', async (req, res) => {
  let userData = {};
  function validateEmail(email) {
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  try {
    if (validateEmail(req.body.email)) {
      const encryptedPassword = encrypt(req.body.password);
      const user = await Users.create(
        {
          name: req.body.name,
          password: encryptedPassword,
          email: req.body.email,
        },
      );
      res.cookie('cookie', 'admin', { maxAge: 900000, httpOnly: false, path: '/' });
      req.session.user = user;
      userData = {
        id: user.user_id,
        name: user.name,
        email: user.email,
      };
      res.status(200);
    } else {
      res.status(500);
    }
  } catch (e) {
    res.status(500);
  } finally {
    res.send(userData);
  }
});

module.exports = router;
