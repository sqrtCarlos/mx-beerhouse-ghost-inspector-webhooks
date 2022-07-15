require('dotenv').config();
const axios = require('axios');
const createMpPaymentMethod = require('./services/createPaymentMethod.mp.js');
const deleteSubscriptions = require('./services/deleteSubscriptions.js');
const deletePaymentMethods = require('./services/deletePaymentMethods.js');
const sendMessage = require('./utils/slack.utils.js');


module.exports.runSubscriptionsSuite = async (event) => {
    const data = JSON.stringify({
        apiKey: process.env.API_KEY,
        email: process.env.USER_EMAIL,
        password: process.env.USER_PWD
    })    
    const config = {
        method: 'post',
        url: process.env.SUBSCRIPTION_SUITE,
        headers: { 
            'Content-Type': 'application/json'
        },
        data: data
    }
    try {
        await deleteSubscriptions(1);
        await deletePaymentMethods();
        await createMpPaymentMethod();
        axios(config);   
    } catch (error) {
        sendMessage(error);
    }    
};