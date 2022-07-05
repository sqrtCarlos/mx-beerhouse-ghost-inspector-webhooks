require('dotenv').config();
const deleteSubscriptions = require('./services/subscriptions.js');  

module.exports.webhookDeleteSubs = async (event) => {
  deleteSubscriptions();
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Execution in progress!'
      },
      null,
      2
    ),
  };
};
