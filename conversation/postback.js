'use strict';

const send = require('../facebook/send');
const user = require('../model/user');

function defaultFailure(senderID) {
    return (reason) => {
        facebook.send.sendTextMessages(
            senderID,
            [reason]
        );
    }
}


module.exports = {
    GET_STARTED: function (senderID) {
        console.log("New user with id", senderID);

        function success() {
            send.sendTextMessages(
                senderID,
                ["Welcome to UTS Remind", "Please enter a username to get started"],
                "SET_NAME"
            );
        }

        user.createNewUser(senderID, success, defaultFailure(senderID) );
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

    SCHEDULE_EVENT: function (senderID) {

    }
}