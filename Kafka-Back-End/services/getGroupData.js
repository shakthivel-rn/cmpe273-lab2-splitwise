/* eslint-disable camelcase */
const Transactions = require('../ModelsMongoDB/Transactions');

async function handle_request(message, callback) {
  const transactions = await Transactions.find({ groupName: message.groupName },
    { expenseId: 1, expenseDescription: 1 }).sort({ time: 'desc' });
  const result = transactions.map((transaction) => ({
    expenseId: transaction.expenseId,
    expenseDescription: transaction.expenseDescription,
  }));
  const uniq = new Set(result.map((e) => JSON.stringify(e)));
  const uniqueResult = Array.from(uniq).map((e) => JSON.parse(e));
  callback(null, uniqueResult);
}

exports.handle_request = handle_request;
