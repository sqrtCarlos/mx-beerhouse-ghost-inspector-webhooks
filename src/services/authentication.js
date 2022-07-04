const axios = require('axios');
const { buildResponse } = require('../utils/webhook.utils.js');


const getCognitoToken = async () => {
    const data = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.CLIENT_ID,
        AuthParameters:
            {
                USERNAME: process.env.USER_EMAIL,
                PASSWORD: process.env.USER_PWD
            },
        ClientMetadata: {}
    };
    
    const config = {
      method: 'post',
      url: process.env.COGNITO_URL,
      headers: { 
        'Content-Type': 'application/x-amz-json-1.1', 
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth', 
        'X-Amz-User-Agent': 'aws-amplify/5.0.4 js'
      },
      data : data
    };
    
    let res = await axios(config);  
    return buildResponse(200, res, ['AuthenticationResult'])
}

module.exports = getCognitoToken