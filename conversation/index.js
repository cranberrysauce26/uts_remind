'use strict';

const facebook = require('../facebook');

const recievedMessage = require('./recieved-message');

module.exports = {
    respond: function (messagingEvent) {
    
        //See https://developers.facebook.com/docs/messenger-platform/webhook-reference 
        console.log("responding in conversation");
        if (messagingEvent.message) {
            console.log("recieved a message");
            recievedMessage(messageEvent);
        } else {
            console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
    }
}

