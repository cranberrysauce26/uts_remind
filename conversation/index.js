'use strict';

const facebook = require('../facebook');

const recievedMessage = require('./recieved-message');
const recievedPostback = require('./recieved-postback');

module.exports = {
    respond: function (pageEntry) {
        
        if (pageEntry.messaging) {

            pageEntry.messaging.forEach(function (messagingEvent) {
                if (messagingEvent.message) {
                    recievedMessage(messagingEvent);
                } else if (messagingEvent.postback) {
                    recievedPostback(messagingEvent);
                } else {
                     console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });

        } else {
            console.log("messagingEvent in conversation index contains no messaging parameter");
        }
    }
}

