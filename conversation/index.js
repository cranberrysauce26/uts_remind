'use strict';

var processer = require('./processer');

module.exports = {
    respond: function (dataEntry) {

        dataEntry.forEach(function (pageEntry) {
            if (pageEntry.messaging) {

                pageEntry.messaging.forEach(function (messagingEvent) {
                    console.log("recieved messaging event");
                    console.log(JSON.stringify(messagingEvent));
                    if (messagingEvent.message) {
                        if (messagingEvent.message.quick_reply) {
                            if (messagingEvent.message.quick_reply.payload) {
                                processer.processPostback[messagingEvent.postback.payload](messagingEvent.sender.id);
                            } else {
                                console.error("Recieved quick_reply with no payload");
                            }
                        } else {
                            processer.processInput(messagingEvent.sender.id, messagingEvent.message.text);
                        }
                    } else {
                        console.log("Webhook received unknown messagingEvent:", JSON.stringify(messagingEvent) );
                    }
                });
            } else {
                console.log("messagingEvent in conversation index contains no messaging parameter");
            }
        })
    }
}

