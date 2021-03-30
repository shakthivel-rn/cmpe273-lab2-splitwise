const mongoose = require('mongoose');
const Groups = require('./Groups').schema;
const Transactions = require('./Transactions').schema;

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
  joinedGroups: [Groups],
  invitedGroups: [Groups],
  paidTransactions: [Transactions],
  owedTransactions: [Transactions],
},
{
  versionKey: false,
});

module.exports = mongoose.model('user', usersSchema);
