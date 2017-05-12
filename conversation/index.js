'use strict';

var processer = require('./processer');

module.exports = {
    respond: function (dataEntry) {

        dataEntry.forEach(function (pageEntry) {
            if (pageEntry.messaging) {

                pageEntry.messaging.forEach(function (messagingEvent) {
                    console.log("recieved messaging event");
                    console.log(JSON.stringify(messagingEvent));
                    if (messagingEvent.message.quick_reply.payload) {
                        console.log("Recieved postback", messagingEvent.message.quick_reply.payload);
                        processer.processPostback[messagingEvent.message.quick_reply.payload](messagingEvent.sender.id);

                    } else if (messagingEvent.message) {

                        processer.processInput(messagingEvent.sender.id, messagingEvent.message.text);

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

