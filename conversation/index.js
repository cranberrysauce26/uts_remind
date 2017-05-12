'use strict';

var processer = require('./processer');

module.exports = {
    respond: function (dataEntry) {

        dataEntry.forEach(function (pageEntry) {
            if (pageEntry.messaging) {

                pageEntry.messaging.forEach(function (messagingEvent) {
                    if (messagingEvent.message) {
                        // recieved input
                        processer.processInput(messagingEvent.sender.id, messagingEvent.message.text);

                    } else if (messagingEvent.postback) {
                        // recieved postback
                        // processer.processPostback is an object with payloads as keys mapping to functions
                        // The functions take sender ID as arguments
                        processer.processPostback[messagingEvent.postback.payload](messagingEvent.sender.id);
                    } else {
                        console.log("Webhook received unknown messagingEvent:", messagingEvent);
                    }
                });
            } else {
                console.log("messagingEvent in conversation index contains no messaging parameter");
            }
        })
    }
}

