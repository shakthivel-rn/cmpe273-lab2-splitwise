/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const { mongoDB } = require('./Utils/config');
const connection = require('./kafka/Connection');

const CreateGroup = require('./services/CreateGroup/createGroup');
const CreateExpense = require('./services/CreateExpense/createExpense');
const SettleAmount = require('./services/Dashboard/settleAmount');
const GetDashboardBox = require('./services/Dashboard/getDashboardBox');
const GetYouOwe = require('./services/Dashboard/getYouOwe');
const GetYouAreOwed = require('./services/Dashboard/getYouAreOwed');
const GetGroupNames = require('./services/Dashboard/getGroupNames');
const GetSettleModal = require('./services/Dashboard/getSettleModal');
const GetGroupData = require('./services/GroupPage/getGroupData');
const GetExpenseDetails = require('./services/GroupPage/getExpenseDetails');
const PostComment = require('./services/GroupPage/postComment');
const GetComments = require('./services/GroupPage/getComments');
const DeleteComment = require('./services/GroupPage/deleteComment');
const GetRecentActivity = require('./services/RecentActivity/getRecentActivity');
const GetPaginationNumber = require('./services/RecentActivity/getPaginationNumber');
const GetInvitedGroups = require('./services/MyGroups/getInvitedGroups');
const AcceptGroupInvite = require('./services/MyGroups/acceptGroupInvite');
const LeaveGroup = require('./services/MyGroups/leaveGroup');
const Login = require('./services/User/login');
const Register = require('./services/User/register');
const EditName = require('./services/ProfilePage/editName');
const EditEmail = require('./services/ProfilePage/editEmail');
const EditPhoneNumber = require('./services/ProfilePage/editPhoneNumber');
const EditDefaultCurrency = require('./services/ProfilePage/editDefaultCurrency');
const EditTimeZone = require('./services/ProfilePage/editTimeZone');
const EditLanguage = require('./services/ProfilePage/editLanguage');
const GetUserDetails = require('./services/ProfilePage/getUserDetails');
const StoreUserImage = require('./services/ProfilePage/storeUserImage');
const GetUserImage = require('./services/ProfilePage/getUserImage');
const GetMemberEmails = require('./services/CreateGroup/getMemberEmails');
const StoreGroupImage = require('./services/CreateGroup/storeGroupImage');
const GetGroupImage = require('./services/GroupPage/getGroupImage');

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
handleTopicRequest('get-recent-activity', GetRecentActivity);
handleTopicRequest('get-pagination-number', GetPaginationNumber);
handleTopicRequest('get-invited-groups', GetInvitedGroups);
handleTopicRequest('accept-group-invite', AcceptGroupInvite);
handleTopicRequest('leave-group', LeaveGroup);
handleTopicRequest('login', Login);
handleTopicRequest('register', Register);
handleTopicRequest('edit-name', EditName);
handleTopicRequest('edit-email', EditEmail);
handleTopicRequest('edit-phonenumber', EditPhoneNumber);
handleTopicRequest('edit-defaultcurrency', EditDefaultCurrency);
handleTopicRequest('edit-timezone', EditTimeZone);
handleTopicRequest('edit-language', EditLanguage);
handleTopicRequest('get-user-details', GetUserDetails);
handleTopicRequest('store-user-image', StoreUserImage);
handleTopicRequest('get-user-image', GetUserImage);
handleTopicRequest('get-member-emails', GetMemberEmails);
handleTopicRequest('store-group-image', StoreGroupImage);
handleTopicRequest('get-group-image', GetGroupImage);
