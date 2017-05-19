'use strict';

const send = require('../facebook/send');
const user = require('../model/user');
const event = require('../model/event');

const defaultFailure = require('./default_failure.js');

module.exports = {
    GET_STARTED: function (senderID) {
        console.log("New user with id", senderID);
        user
            .createNewUser(senderID)
            .then(() => {
                console.log("postback.js. succesfully created user with id", senderID);
                send.sendTextMessages(
                    senderID,
                    ["Welcome to UTS Remind", "TEST: type 'add event'"]
                );
            })
            .catch( defaultFailure(senderID) );
    },

    LIST_FUTURE_EVENTS_FOR_USER: function (senderID) {
        return;
    },

    CREATE_EVENT: function (senderID) {

        send.sendTextMessages(
            senderID,
            ["What's the name of your event?"]
        );

        user.setInputState(senderID, 'SET_NAME_FOR_EVENT').catch(defaultFailure(senderID));
    },

    SCHEDULE_EVENT: function (senderID) {
        event
            .schedule(senderID)
            .then(() => {
                console.log("succesfully scheduled event");
                send.sendTextMessages(senderID, ["Successfully scheduled event!"]);
                user.setInputState(senderID, 'DEFAULT');
            })
            .catch(defaultFailure(senderID));
    }
}