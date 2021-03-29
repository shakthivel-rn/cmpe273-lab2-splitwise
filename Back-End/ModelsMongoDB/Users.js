const mongoose = require('mongoose');

const { Schema } = mongoose;

const usersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  defaultCurrency: {
    type: String,
  },
  timezone: {
    type: String,
  },
  language: {
    type: String,
  },
  userImage: {
    type: String,
  },
},
{
  versionKey: false,
});

module.exports = mongoose.model('users', usersSchema);
