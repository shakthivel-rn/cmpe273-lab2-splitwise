const express = require('express');
const Users = require('../models/Users')();

const router = express.Router();

router.get('/getUserDetails', async (req, res) => {
  const user = await Users.findAll({
    where: {
      user_id: req.query.userId,
    },
  });
  res.send(user);
});

router.put('/editName', async (req, res) => {
  await Users.update({ name: req.body.name }, {
    where: {
      user_id: req.body.userId,
    },
  });
  res.send();
});

router.put('/editEmail', async (req, res) => {
  let status = 500;
  const userEmail = await Users.findAll({
    where: {
      email: req.body.email,
    },
  });
  if (userEmail.length === 0) {
    await Users.update({ email: req.body.email }, {
      where: {
        user_id: req.body.userId,
      },
    });
    status = 200;
  } else {
    status = 500;
  }
  res.sendStatus(status);
});

router.put('/editPhoneNumber', async (req, res) => {
  await Users.update({ phone_number: req.body.phone }, {
    where: {
      user_id: req.body.userId,
    },
  });
  res.send();
});

router.put('/editDefaultCurrency', async (req, res) => {
  await Users.update({ default_currency: req.body.defaultcurrency }, {
    where: {
      user_id: req.body.userId,
    },
  });
  res.send();
});

router.put('/editTimeZone', async (req, res) => {
  await Users.update({ timezone: req.body.timezone }, {
    where: {
      user_id: req.body.userId,
    },
  });
  res.send();
});

router.put('/editLanguage', async (req, res) => {
  await Users.update({ language: req.body.language }, {
    where: {
      user_id: req.body.userId,
    },
  });
  res.send();
});
module.exports = router;
