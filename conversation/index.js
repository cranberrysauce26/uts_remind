'use strict';

const facebook = require('../facebook');

const recievedMessage = require('./recieved-message');

module.exports = {
    respond: function (messagingEvent) {

        /*
            See https://developers.facebook.com/docs/messenger-platform/webhook-reference 
        */
        if (messagingEvent.message) {
            recievedMessage(messageEvent);
        } else {
            console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
        // if (messagingEvent.optin) {
        //     receivedAuthentication(messagingEvent);
        // } else if (messagingEvent.message) {
        //     receivedMessage(messagingEvent);
        // } else if (messagingEvent.delivery) {
        //     receivedDeliveryConfirmation(messagingEvent);
        // } else if (messagingEvent.postback) {
        //     receivedPostback(messagingEvent);
        // } else if (messagingEvent.read) {
        //     receivedMessageRead(messagingEvent);
        // } else if (messagingEvent.account_linking) {
        //     receivedAccountLink(messagingEvent);
        // } else {
        //     console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        // }
    }
}

