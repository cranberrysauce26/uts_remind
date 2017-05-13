'use strict';

var processer = require('./processer');

module.exports = {
    respond: function (dataEntry) {

        dataEntry.forEach(function (pageEntry) {
            if (pageEntry.messaging) {

                pageEntry.messaging.forEach(function (messagingEvent) {
                    

                    if (messagingEvent.postback) {
                        processer.processPostback[messagingEvent.postback.payload](messagingEvent.sender.id);
                        return;
                    }
                    
                    if (messagingEvent.message) {
                        if (messagingEvent.message.quick_reply) {
                            if (messagingEvent.message.quick_reply.payload) {
                                var payload = messagingEvent.message.quick_reply.payload;
                                processer.processPostback[payload](messagingEvent.sender.id);
                            } else {
                                console.error("Recieved quick_reply with no payload");
                            }
                        } else if (messagingEvent.message.text){
                            processer.processInput(messagingEvent.sender.id, messagingEvent.message.text);
                        } else {
                            console.error("Webhook recieved messagingEvent.message with unknown data:", JSON.stringify(messagingEvent));
                        }
                    } else {
                        console.error("Webhook received unknown messagingEvent:", JSON.stringify(messagingEvent) );
                    }
                });
            } else {
                console.error("pageEntry in conversation contains no messaging parameter");
            }
        })
    }
}

