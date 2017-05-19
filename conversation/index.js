'use strict';

const input = require('./input');
const postback = require('./postback');
const user = require('../model/user');

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
                    postback(id, payload);
                    return;
                }

                user
                    .getInputState(id)
                    .then( (state) => {
                        console.log("state is", state);
                        input[state](id, message.text);
                    })
                    .catch( () => {
                        input.DEFAULT(id, message.text);
                    });
            });
        });
    }
};

