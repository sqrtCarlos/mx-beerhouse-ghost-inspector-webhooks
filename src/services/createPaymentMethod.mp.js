const axios = require('axios');
const { buildResponse } = require('../utils/webhook.utils.js');
const getCognitoToken = require('./authentication.js');


const createCardMp = async () => {
    const data = JSON.stringify({
        "card_number": process.env.CARD_NUMBER,
        "security_code": process.env.SEC_CODE,
        "expiration_month": process.env.EXP_MONTH,
        "expiration_year": process.env.EXP_YEAR,
        "cardholder": {
          "name": process.env.CARD_OWNER_APRO
        }
    });
    const config = {
        method: 'post',
        url: process.env.MP_URL,
        headers: { 
            'Content-Type': 'application/json'
        },
        data: data        
    };
    let res = await axios(config);    
    return buildResponse(201, res, ['id'])
}

const getPaymentKey = async () => {
    const config = {
        method: 'get',
        url: process.env.ZX_PAYMENT_URL,
        headers: { 
          'Authorization': process.env.ZX_PAYMENT_TOKEN
        }
    };
    let res = await axios(config);  
    return buildResponse(200, res, ['content', 'key'])
}

const getCyberSourceToken = async (key) => {
    const data = JSON.stringify({
        "keyId": key,
        "cardInfo": {
          "cardNumber": process.env.CARD_NUMBER,
          "cardExpirationMonth": process.env.EXP_MONTH,
          "cardExpirationYear": process.env.EXP_YEAR,
          "cardType": "001"
        }
    });
    const config = {
        method: 'post',
        url: process.env.CYBER_URL,
        headers: { 
            'Content-Type': 'application/json'
        },
        data: data
    };
    let res = await axios(config);
    return buildResponse(200, res, ['token'])
}

const createUserCard = async (requestToken, cardToken, cyberToken) => {
    const data = JSON.stringify({
        query: `mutation ($input: CreateUserCardInput!){
            createUserCard(input: $input) {
                id
                email
                cardId
                customerId
                paymentProcessor
                cybersouceToken
                lastFourDigits
                firstSixDigits
                issuerId
                paymentMethodId
                expirationMonth
                expirationYear
                issuerName
            }
        }`,
        variables: {
            "input": {
                "cardToken": cardToken,
                "paymentProcessor": "mercadopago",
                "cybersouceToken": cyberToken
            }
        }
    });
    const config = {
        method: 'post',
        url: process.env.SERVICES_URL,
        headers: { 
            'Authorization': requestToken, 
            'Content-Type': 'application/json'
        },        
        data: data
    };
    let res = await axios(config);
    return buildResponse(200, res, ['data', 'createUserCard', 'id'])
}

const setDefaulCard = async (requestToken, paymentId) => {
    const data = JSON.stringify({
    query: `mutation ($input: String!){ 
        setDefaultPaymentMethod(id: $input){
            id
        }
    }`,
    variables: { "input": paymentId }
    });

    const config = {
        method: 'post',
        url: process.env.SERVICES_URL,
        headers: { 
            'Authorization': `Bearer ${requestToken}`, 
            'Content-Type': 'application/json'
        },
        data: data
    };
    let res = await axios(config);   
    return buildResponse(200, res, ['data', 'setDefaultPaymentMethod', 'id'])
}

const createMpPaymentMethod = async () => {
    const mpId = await createCardMp();
    if (mpId.success) {
       const keyPayment = await getPaymentKey();
       if (keyPayment.success) {
            const cyberToken = await getCyberSourceToken(keyPayment.data);
            const userTokenResponse = await getCognitoToken();
            if (userTokenResponse.success) {
                const userCard = await createUserCard(userTokenResponse.data.IdToken, mpId.data, cyberToken.data);
                if (userCard.success) {
                    const defaultCard = await setDefaulCard(userTokenResponse.data.IdToken, userCard.data)
                    if (defaultCard.success) {
                        return { 
                            success: true,
                            data: defaultCard
                        }
                    }
                }
                else {
                    console.log(userCard.data);
                }
            }
            else {
                userTokenResponse.data
            }            
       }
       else {
        console.log(keyPayment.data);
       }
    }
    else {
        console.log(mpId.data);
    }
    throw "Error in createMpPaymentMethod"
}

module.exports = createMpPaymentMethod;
