const axios = require('axios');
const { sleep, buildResponse } = require('../utils/webhook.utils.js');
const getCognitoToken = require('./authentication.js');


const getSubscriptions = async (token) => {
    const data = JSON.stringify({
    query: `query {
                me {
                    subscriptions {
                        id   
                        status      
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
    return buildResponse(200, res, ['data', 'me', 'subscriptions']);
}

const deleteSubscription = async (serverToken, subId) => {
    const data = JSON.stringify({
    query: `mutation ($input: ActivateSubscriptionInput!){
        deleteSubscription(input: $input) {
            success
            message
        }
    }`,
    variables: {
        input: { id: subId}}
    });

    const config = {
    method: 'post',
    url: process.env.BH_ENDPOINT,
    headers: { 
        'Authorization': `Bearer ${serverToken}`, 
        'Content-Type': 'application/json'
    },
    data : data
    };

    let res = await axios(config);

    return buildResponse(200, res, ['data', 'deleteSubscription']);
}

const activateSubscription = async (token, subId) => {
    const data = JSON.stringify({
    query: `mutation ($input: ActivateSubscriptionInput!){
            activateSubscription(input: $input) {
                success
                message
            }
        }`,
    variables: {
        input: { id: subId }
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

    const res = await axios(config);

    return buildResponse(200, res, ['data', 'success']);
}

const validateSubsStatus = async (token, subs) => {
    let response = false;
    let validatedSubs = [];
    subs.forEach(async (i) => {
        if (i.status === 'ACTIVE') {
            validatedSubs.push(i.id)
        }
        if (i.status === 'PAUSED') {
            response = await activateSubscription(token, i.id);
            if (response) {
                validatedSubs.push(i.id)
            }
        }
        else if (i.status === 'CANCELED') {
            console.error("Can not activate a CANCELED sub");
        }
    });
    return validatedSubs;
}

const deleteSubscriptions = async (timeToSleep) => {
    await sleep(timeToSleep);
    let userTokenResponse = await getCognitoToken();
    if (userTokenResponse.success) {
        let subsResponse = await getSubscriptions(userTokenResponse.data.IdToken);
        if (subsResponse.success) {
            let subsIds = await validateSubsStatus(userTokenResponse.data.IdToken, subsResponse.data);
            subsIds.forEach(async (subId) => {
                let deleteResponse = await deleteSubscription(process.env.SERVER_TOKEN, subId);
                if (!deleteResponse.success) {
                    console.log("Error in deleteSubscription:\n" + deleteResponse);
                }
            });
            return { success: true }
        }
        else {
            console.log("Error in getSubscriptions:\n" + JSON.stringify(subsResponse));
        }
    }
    else {
        console.log("Error in getCognitoToken:\n" + JSON.stringify(userTokenResponse.data));
    }
    throw "Error in deleteSubscriptions";
}

module.exports = deleteSubscriptions;