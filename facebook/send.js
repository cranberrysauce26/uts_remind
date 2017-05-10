'use strict';

const request = require('request');

function send(messageData) {
    console.log("In send with messageData==");
    console.log(JSON.stringify(messageData));
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log("Successfully sent message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            // console.error(response);
            console.error(error);
        }
    });
}


module.exports.sendTextMessage = function (senderID, messageText) {
    console.log("sending text message "+messageText);
    send({
        recipiend: {
            id: senderID
        },
        message: {
            text: messageText
        }
    });
}

