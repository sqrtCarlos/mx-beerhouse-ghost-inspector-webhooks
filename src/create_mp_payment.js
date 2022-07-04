require('dotenv').config();
const createPaymentMethod = require('./services/paymentMethod.mp.js');  

module.exports.webhookAddMpPaymentMethod = async (event) => {
  createPaymentMethod();
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
