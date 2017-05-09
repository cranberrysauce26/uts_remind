'use strict';

const facebook = require('../facebook');

const recievedMessage = require('./recieved-message');

module.exports = {
    respond: function (messagingEvent) {
    
        //See https://developers.facebook.com/docs/messenger-platform/webhook-reference 

        if (messagingEvent.message) {
            recievedMessage(messageEvent);
        } else {
            console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
    }
}

