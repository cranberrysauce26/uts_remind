'use strict';

const send = require('../facebook/send');
const user = require('../model/user');


module.exports = {
    GET_STARTED: function (senderID) {
        console.log("New user with id", senderID);

        user
            .createNewUser(senderID)
            .then(function (val) {
                send.sendTextMessages(
                    senderID,
                    ["Welcome to UTS Remind", "Please enter a username to get started"],
                    "SET_NAME"
                );
            })
            .catch(function(reason) {
                send.sendTextMessages(
                    senderID,
                    [reason]
                );
            })
    },

    LIST_FUTURE_EVENTS_FOR_USER: function (senderID) {
        return;
    },

    CREATE_EVENT: function (senderID) {

        if (user.hasAnOpenEvent(senderID)) {

        }

        send.sendTextMessages(
            senderID,
            ["What's the name of your event?"],
            "NAME_EVENT"
        );

    },

    SCHEDULE_EVENT: function(senderID) {

    }
}