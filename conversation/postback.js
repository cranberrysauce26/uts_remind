'use strict';

const send = require('../facebook/send');
const user = require('../model/user');
const event = require('../model/event');

const failure = require('./failure');

module.exports = function (senderID, payload) {
    postbacks[payload](senderID);
}

const postbacks = {
    GET_STARTED: function (senderID) {
        console.log("New user with id", senderID);
        send.sendTextMessages(senderID, ["Welcome to UTS Remind", "Please give me a second to set up your account"]);
        user
            .createNewUser(senderID)
            .then(() => {
                console.log("postback.js. succesfully created user with id", senderID);
                send.sendTextMessages(
                    senderID,
                    ["All right!", "TESTING: type 'add event' "]
                );
            })
            .catch(failure(senderID));
    },

    LIST_FUTURE_EVENTS_FOR_USER: function (senderID) {
        return;
    },

    CREATE_EVENT: function (senderID) {

        send.sendTextMessages(
            senderID,
            ["What's the name of your event?"]
        );

        user.setInputState(senderID, 'SET_NAME_FOR_EVENT').catch(failure(senderID));
    },

    SCHEDULE_EVENT: function (senderID) {
        event
            .schedule(senderID)
            .then(() => {
                console.log("succesfully scheduled event");
                send.sendTextMessages(senderID, ["Successfully scheduled event!"]);
                user.setInputState(senderID, 'DEFAULT');
            })
            .catch(failure(senderID));
    },

    CANCEL_EVENT: function (senderID) {
        event
            .deleteUnscheduledEvent(senderID)
            .then(() => {
                user.setInputState(senderID, 'DEFAULT').catch(failure(senderID));
            })
            .catch(failure(senderID));
    }
}