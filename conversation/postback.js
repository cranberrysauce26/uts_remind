'use strict';

const send = require('../facebook/send');
const user = require('../model/user');

const defaultFailure = require('./default_failure.js');

module.exports = {
    GET_STARTED: function (senderID) {
        console.log("New user with id", senderID);

        user
            .createNewUser(senderID)
            .then(() => {
                console.log("In .then of get started postback");
                send.sendTextMessages(
                    senderID,
                    ["Welcome to UTS Remind", "Please enter a username to get started"]
                );
                user.setInputState(senderID, "SET_NAME").catch( defaultFailure(senderID) );
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

        input.setInputState(senderID, 'SET_NAME_FOR_EVENT').catch(defaultFailure(senderID));
    },

    SCHEDULE_EVENT: function (senderID) {

    }
}