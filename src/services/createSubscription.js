const axios = require('axios');
const { buildResponse } = require('../utils/webhook.utils.js');
const getCognitoToken = require('./authentication.js');


const createSubscription = async (subsData, token=null) => {
    if (token === null) {
        const tokenResponse = await getCognitoToken();
        token = tokenResponse.data.IdToken
    }
    const data = JSON.stringify({
    query: `mutation ($input: CreateSubscriptionInput!) {
        createSubscription(input: $input) {
            success
            message
            subscription {
                id
                createdAt
                billingDate
                frequency
                status
                items {
                    id
                    quantity
                }
            }
        }
    }`,
    variables: {
        input: {
            addressId: subsData.userAddressId,
            frequency: subsData.frequency,
            items: subsData.items,
            paymentMethodId: subsData.paymentId
        }
    }
    });

    const config = {
        method: 'post',
        url: process.env.BH_ENDPOINT,
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
        },
        data: data
    };
    let res = await axios(config);
    return buildResponse(200, res, ['data', 'createSubscription', 'subscription'])
}

const pauseSubscription = async (subId, token=null) => {
    if (token === null) {
        const tokenResponse = await getCognitoToken();
        token = tokenResponse.data.IdToken
    }
    const data = JSON.stringify({
    query: `mutation ($input: UpdateSubscriptionStatusInput!){
        pauseSubscription(input: $input) {
            success
            message
            subscription {
                id
                status
                billingDate
            }
        }
    }`,    
    variables: {
        input: {
            id: subId,
            reason: "PAUSE TEST"
        }
    }
    });

    const config = {
        method: 'post',
        url: process.env.BH_ENDPOINT,
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
        },
        data: data
    };

    let res = await axios(config);
    return buildResponse(200, res, ['data','pauseSubscription', 'success']);    
}

module.exports = {
    createSubscription,
    pauseSubscription
}
