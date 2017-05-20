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
                    postback(id, messagingEvent.postback.payload);
                    return;
                }

                if (!messagingEvent.hasOwnProperty('message')) {
                    console.error("messaging event contains no message or postback", JSON.stringify(messagingEvent));
                    return;
                }

                const message = messagingEvent.message;

                if (message.hasOwnProperty('quick_reply')) {
                    postback(id, message.quick_reply.payload);
                    return;
                }

                user
                    .getInputState(id)
                    .then( (state) => {
                        input(id, message.text, state);
                    })
                    .catch( () => {
                        input(id, message.text, 'DEFAULT');
                    });
            });
        });
    }
};

