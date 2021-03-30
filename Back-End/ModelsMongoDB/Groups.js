const mongoose = require('mongoose');
const Transactions = require('./Transactions').schema;

const { Schema } = mongoose;

const groupsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  creatorId: {
    type: String,
    required: true,
  },
  groupMembers: {
    type: Array,
  },
  image: {
    type: String,
  },
  groupTransactions: [Transactions],
},
{
  versionKey: false,
});

module.exports = mongoose.model('group', groupsSchema);
