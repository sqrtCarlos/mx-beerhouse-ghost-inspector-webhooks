require('dotenv').config();
const deleteSubscriptions = require('./services/deleteSubscriptions.js');  

module.exports.webhookDeleteSubs = async (event) => {
  deleteSubscriptions(40000);
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
