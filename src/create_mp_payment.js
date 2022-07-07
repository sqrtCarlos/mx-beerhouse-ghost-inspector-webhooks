require('dotenv').config();
const createMpPaymentMethod = require('./services/createPaymentMethod.mp.js');  

module.exports.webhookAddMpPaymentMethod = async (event) => {
  createMpPaymentMethod();
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
