'use strict';

const facebook = require('../facebook');

const recievedMessage = require('./recieved-message');
const recievedPostback = require('./recieved-postback');

module.exports = {
    respond: function (messagingEvent) {

        //See https://developers.facebook.com/docs/messenger-platform/webhook-reference 
        console.log("responding to messagingEvent in conversation");

        if (messagingEvent.messaging) {
            console.log("recieved a message");
            /*
                messagingEvent.messaging is actually an array cuz according to facebook,
                you might need to handle multiple calls at once. However, apparently 99% of the time
                the array has only one element.
            */
            messagingEvent.messaging.forEach(function (message) {
                recievedMessage(message);
            });
        } else if (messagingEvent.postback) {
            console.log("recieved a postback. messaginEvent is ");
            console.log(JSON.stringify(messagingEvent));
            console.log("doing nothing for now");
            // messagingEvent.postback.forEach(function(postback) {
            //     recievedPostback(postback);
            // }); 
        } else {
            console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
    }
}

