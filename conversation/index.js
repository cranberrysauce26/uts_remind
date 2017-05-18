'use strict';

var input = require('./input');
var postback = require('./postback');

module.exports = {
    respond: function (dataEntry) {

        dataEntry.forEach(function (pageEntry) {
            if (!pageEntry.messaging) {
                console.error("cannot find messaging property of pageEntry");
                return;
            }
            pageEntry.messaging.forEach(function (messagingEvent) {

                const id = messagingEvent.sender.id;

                if (messagingEvent.hasOwnProperty('postback')) {
                    postback[messagingEvent.postback.payload](id);
                    return;
                }

                if (!messagingEvent.hasOwnProperty('message')) {
                    console.error("messaging event contains no message or postback: ");
                    console.error(messagingEvent);
                    return;
                }

                const message = messagingEvent.message;

                if (message.hasOwnProperty('quick_reply')) {
                    var payload = message.quick_reply.payload;
                    postback[payload](senderid);
                    return;
                }

                const text = message.text;

                if (message.is_echo) {
                    var metadata = message.metadata;
                    input[metadata](id, text);
                    return;
                }

                input.DEFAULT(id, text);

            });
        });
    }
};

