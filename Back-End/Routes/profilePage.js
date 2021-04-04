const express = require('express');
const Users = require('../ModelsMongoDB/Users');
const User = require('../ModelsMongoDB/Users');
const { checkAuth } = require('../Utils/passport');

const router = express.Router();

router.get('/getUserDetails', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.query.userId });
  res.send(user);
});

router.put('/editName', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  user.name = req.body.name;
  user.save();
  res.send();
});

router.put('/editEmail', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  try {
    user.email = req.body.email;
    await user.save();
    res.status(200);
  } catch {
    res.status(400);
  } finally {
    res.send();
  }
});

router.put('/editPhoneNumber', checkAuth, async (req, res) => {
  const user = await User.findOne({ _id: req.body.userId });
  user.phoneNumber = req.body.phone;
  user.save();
  res.send();
});

router.put('/editDefaultCurrency', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  user.defaultCurrency = req.body.defaultcurrency;
  user.save();
  res.send();
});

router.put('/editTimeZone', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  user.timezone = req.body.timezone;
  user.save();
  res.send();
});

router.put('/editLanguage', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  user.language = req.body.language;
  user.save();
  res.send();
});
module.exports = router;
