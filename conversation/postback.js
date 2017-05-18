'use strict';

const facebook = require('./facebook');
const user = require('../model/user');


module.exports = {
    GET_STARTED: function (senderID) {
        console.log("New user with id", senderID);

        user
            .createNewUser(senderID)
            .then(function (val) {
                facebook.send.sendTextMessages(
                    senderID,
                    ["Welcome to UTS Remind", "Please enter a username to get started"],
                    "SET_NAME"
                );
            })
            .catch(function(reason) {
                facebook.send.sendTextMessages(
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

        facebook.send.sendTextMessages(
            senderID,
            ["What's the name of your event?"],
            "NAME_EVENT"
        );

    },

    SCHEDULE_EVENT: function(senderID) {
        
    }
}