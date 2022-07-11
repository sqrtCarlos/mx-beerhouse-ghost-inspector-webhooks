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
    channels = String(process.env.SLACK_CHANNELS).trim();
    myChannels = channels.split(',');
    for (ch of myChannels) {
        if (ch.startsWith('#')) {
            await postMessage(ch.trim());
        }
    }
    
}

module.exports = {
    sendMessage
}