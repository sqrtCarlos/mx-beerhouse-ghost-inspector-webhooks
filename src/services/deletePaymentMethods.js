const axios = require('axios');
require('dotenv').config();
const { buildResponse } = require('../utils/webhook.utils.js');
const getCognitoToken = require('./authentication.js');


const getPaymentMethods = async (token) => {
    const data = JSON.stringify({
    query: `query {
                me {
                    paymentMethods {
                        id     
                    }
                }
            }`,
    variables: {}
    });

    const config = {
    method: 'post',
    url: process.env.BH_ENDPOINT,
    headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
    },
    data : data
    };

    let res = await axios(config);
    return buildResponse(200, res, ['data', 'me', 'paymentMethods']);
}

const deletePaymentMethod = async (token, paymentId) => {
    const data = JSON.stringify({
    query: `mutation ($input: DeleteUserPaymentMethodInput!){
        deleteUserPaymentMethod(input: $input) {
            success
            message
        }
    }`,
    variables: {
        input: { id: paymentId}}
    });

    const config = {
    method: 'post',
    url: process.env.BH_ENDPOINT,
    headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
    },
    data : data
    };

    let res = await axios(config);

    return buildResponse(200, res, ['data']);
}

const deletePaymentMethods = async () => {
    let userTokenResponse = await getCognitoToken();
    if (userTokenResponse.success) {
        let paymentResponse = await getPaymentMethods(userTokenResponse.data.IdToken);
        if (paymentResponse.success) {
            let paymentIds = paymentResponse.data;
            paymentIds.forEach(async (paymentId) => {
                let deleteResponse = await deletePaymentMethod(userTokenResponse.data.IdToken, paymentId.id);
                if (!deleteResponse.success) {
                    console.log("Error during deletePaymentMehod:\n" + JSON.stringify(deleteResponse));
                }
            });
            return { success: true }
        }
        else {
            console.log("Error during getPaymentMethods:\n" + JSON.stringify(paymentResponse.data));
        }
    }
    else {
        console.log("Error during getPaymentMethods:\n" + JSON.stringify(userTokenResponse.data));
    }
    throw "Error in deletePaymentMethods";
}

module.exports = deletePaymentMethods;