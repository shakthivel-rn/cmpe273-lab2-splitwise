/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const { mongoDB } = require('./Utils/config');
const connection = require('./kafka/Connection');

const CreateGroup = require('./services/createGroup');
const CreateExpense = require('./services/createExpense');
const SettleAmount = require('./services/settleAmount');
const GetDashboardBox = require('./services/getDashboardBox');
const GetYouOwe = require('./services/getYouOwe');
const GetYouAreOwed = require('./services/getYouAreOwed');
const GetGroupNames = require('./services/getGroupNames');
const GetSettleModal = require('./services/getSettleModal');
const GetGroupData = require('./services/getGroupData');
const GetExpenseDetails = require('./services/getExpenseDetails');
const PostComment = require('./services/postComment');
const GetComments = require('./services/getComments');
const DeleteComment = require('./services/deleteComment');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0,
};

mongoose.connect(mongoDB, options, (err) => {
  if (err) {
    console.log(err);
    console.log('MongoDB Connection Failed');
  } else {
    console.log('MongoDB Connected');
  }
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

function handleTopicRequest(topic_name, function_name) {
  const consumer = connection.getConsumer(topic_name);
  const producer = connection.getProducer();

  console.log('server is running');
  consumer.on('message', (message) => {
    console.log(`message recieved for ${topic_name} ${function_name}`);
    console.log(JSON.stringify(message.value));
    const data = JSON.parse(message.value);

    function_name.handle_request(data.data, (err, res) => {
      console.log('After request handling: ', res);
      const payload = [{
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res,
        }),
        partition: 0,
      }];

      producer.send(payload, (err, data) => {
        console.log('Data: ', data);
      });
    });
  });
}

handleTopicRequest('create-group', CreateGroup);
handleTopicRequest('create-expense', CreateExpense);
handleTopicRequest('settle-amount', SettleAmount);
handleTopicRequest('get-dashboard-box', GetDashboardBox);
handleTopicRequest('get-you-owe', GetYouOwe);
handleTopicRequest('get-you-are-owed', GetYouAreOwed);
handleTopicRequest('get-group-names', GetGroupNames);
handleTopicRequest('get-settle-modal', GetSettleModal);
handleTopicRequest('get-group-data', GetGroupData);
handleTopicRequest('get-expense-details', GetExpenseDetails);
handleTopicRequest('post-comment', PostComment);
handleTopicRequest('get-comments', GetComments);
handleTopicRequest('delete-comment', DeleteComment);
