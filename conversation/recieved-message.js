'use strict';
const facebook = require('./../facebook')

module.exports = function(event) {
    var senderID = event.sender.id;
    var message = event.message;
    var messageText = message.text;

    console.log("Received message for user "+senderID+" with message "+messageText);

    /***********************************
     * TESTING
     */
    if (messageText === 'test') {
        facebook.send.sendGenericMessage(senderID);
    }
    /********************************** */

    if (messageText) {
        console.log("sending messageText to facebook");
        facebook.send.sendTextMessage(senderID, messageText);
    } else {
        console.log("messageText is null.");
    }
}


