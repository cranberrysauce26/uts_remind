'use strict';

const send = require('../facebook/send');
const user = require('../model/user');
const event = require('../model/event');

function defaultFailure() {
    return () => {
        facebook.send.sendTextMessages(
            senderID,
            ["An unknown error occured. Please try again later"]
        );
    }
}


module.exports = {

    DEFAULT: function (senderID, text) {
        send.sendTextMessages(senderID, ["Sorry I am illiterate"]);
    },

    SET_NAME: function (senderID, text) {
        function success() {
            send.sendTextMessages(senderId, ["Recorded!"]);
        }
        user.setName(senderID, text, success, defaultFailure(senderID));
    },

    NAME_EVENT: function (senderID, text) {

        function success() {
            send.sendTextMessages(
                senderID,
                ["When do you want people to be reminded?"],
                "SET_TIME_FOR_EVENT"
            );
        }

        event.create(senderID, text, success, defaultFailure(senderID));
    },

    SET_TIME_FOR_EVENT: function (senderID, text) {

        function success() {
            send.sendTextMessages(
                senderID,
                ["Please add a description that includes the start time, location and any other details"],
                "SET_DESCRIPTION_FOR_EVENT"
            );
        }
        event.setEventStartTime(senderID, text, success, defaultFailure(senderID) );
    },

    SET_DESCRIPTION_FOR_EVENT: function (senderID, text) {
        event
            .setEventDescription(senderID, text)
            .then((val) => {
                send.sendQuickReplies(
                    senderID,
                    "Confirm event!",
                    [
                        {
                            text: "Schedule",
                            payload: "SCHEDULE_EVENT"
                        },
                        {
                            text: "Cancel",
                            payload: "CANCEL_EVENT"
                        },
                    ]
                );
            })
            .catch(sendError(senderID));
    }
}

