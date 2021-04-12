/* eslint-disable no-console */
const mongoose = require('mongoose');
const { mongoDB } = require('./Utils/config');
var connection = require('./kafka/Connection');

var CreateGroup = require('./services/createGroup');


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

function handleTopicRequest(topic_name, function_name){

  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();

  console.log('server is running');
  consumer.on('message', function(message){
      console.log('message recieved for ' + topic_name + " " + function_name);
      console.log(JSON.stringify(message.value));
      var data = JSON.parse(message.value);

      function_name.handle_request(data.data, function(err, res){
          console.log('After request handling: ', res);
          var payload = [{
              topic: data.replyTo,
              messages: JSON.stringify({
                  correlationId : data.correlationId,
                  data : res,
              }),
              partition: 0
          }];

          producer.send(payload, function(err, data){
              console.log('Data: ', data);
          });
          return;

      });
  });
}

handleTopicRequest("create-group", CreateGroup);
