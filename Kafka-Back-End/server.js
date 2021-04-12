/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const { mongoDB } = require('./Utils/config');
const connection = require('./kafka/Connection');

const CreateGroup = require('./services/createGroup');
const CreateExpense = require('./services/createExpense');

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
