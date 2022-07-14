const axios = require('axios');



const postMessage = async (channel, message) => {
    const slackToken = process.env.SLACK_TOKEN;
    const url = 'https://slack.com/api/chat.postMessage';
    const res = await axios.post(url, {
        channel: channel,
        text: message
        }, 
        { headers: { authorization: `Bearer ${slackToken}` } }
    );
    try {
        return { success: res.data.ok };
    } catch (error) {
        return { success: false };
    }
}

const sendMessage = async (message) => {
    const channels = String(process.env.SLACK_CHANNELS).split(',');    
    for (ch of channels) {
        if (ch.startsWith('#')) {
            await postMessage(ch.trim(), message);
        }
    }
}

module.exports = {
    sendMessage
}