'use strict';
const facebook = require('./../facebook')

module.exports = function(event) {
    var senderID = event.sender.id;
    var message = event.message;

    console.log("Received message for user "+senderID+". Here's the message:");
    console.log(JSON.stringify(message));

    var messageText = message.text;

    if (messageText) {
        facebook.send.sendTextMessage(senderID, messageText);
    } else if (messageAttachments) {
        facebook.send.sendTextMessage(senderID, "Message with attachment received");
    }
}


