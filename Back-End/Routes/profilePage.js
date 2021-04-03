const express = require('express');
const Users = require('../ModelsMongoDB/Users');
const User = require('../ModelsMongoDB/Users');

const router = express.Router();

router.get('/getUserDetails', async (req, res) => {
  const user = await Users.findOne({ _id: req.query.userId });
  res.send(user);
});

router.put('/editName', async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  user.name = req.body.name;
  user.save();
  res.send();
});

router.put('/editEmail', async (req, res) => {
  try {
    const user = await Users.findOne({ _id: req.body.userId });
    user.email = req.body.email;
    user.save();
    res.status(200);
  } catch {
    res.status(400);
  } finally {
    res.send();
  }
});

router.put('/editPhoneNumber', async (req, res) => {
  const user = await User.findOne({ _id: req.body.userId });
  user.phoneNumber = req.body.phone;
  user.save();
  res.send();
});

router.put('/editDefaultCurrency', async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  user.defaultCurrency = req.body.defaultcurrency;
  user.save();
  res.send();
});

router.put('/editTimeZone', async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  user.timezone = req.body.timezone;
  user.save();
  res.send();
});

router.put('/editLanguage', async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  user.language = req.body.language;
  user.save();
  res.send();
});
module.exports = router;
