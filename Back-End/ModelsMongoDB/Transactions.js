const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionsSchema = new Schema({
  groupName: {
    type: String,
    required: true,
  },
  expenseDescription: {
    type: String,
    require: true,
  },
  paidUserName: {
    type: String,
    required: true,
  },
  owedUserName: {
    type: String,
    required: true,
  },
  splitAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: Boolean,
    required: true,
  },
},
{
  versionKey: false,
});

module.exports = mongoose.model('transaction', transactionsSchema);
