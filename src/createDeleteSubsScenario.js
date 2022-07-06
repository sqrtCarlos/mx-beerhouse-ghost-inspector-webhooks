require('dotenv').config();
const axios = require('axios');
const createMpPaymentMethod = require('./services/createPaymentMethod.mp.js');
const deleteSubscriptions = require('./services/deleteSubscriptions.js');
const deletePaymentMethods = require('./services/deletePaymentMethods.js');


module.exports.runSubscriptionsSuite = async (event) => {    
    const config = {
        method: 'get',
        url: process.env.SUBSCRIPTION_SUITE,
    }
    try {
        await deleteSubscriptions(1);
        await deletePaymentMethods();
        await createMpPaymentMethod();
        axios(config);
        console.log('Done!');    
    } catch (error) {
        console.log(error);
    }    
};