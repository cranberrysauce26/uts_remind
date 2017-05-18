'use strict';

const send = require('../facebook/send');
const user = require('../model/user');
const event = require('../model/event');

module.exports = {

    DEFAULT: function (senderID, text) {
        send.sendTextMessages(senderID, ["Sorry I am illiterate"]);
    },

    SET_NAME: function (senderID, text) {
        user
            .setName(senderID, text)
            .then((val) => {
                send.sendTextMessages(senderId, ["Recorded!"]);
            })
            .catch( sendError(senderID) );
    },

    NAME_EVENT: function (senderID, text) {
        event
            .create(senderID, text)
            .then((val) => {
                send.sendTextMessages(
                    senderID,
                    ["When do you want people to be reminded?"],
                    "SET_TIME_FOR_EVENT"
                );
            })
            .catch( sendError(senderID) );
    },

    SET_TIME_FOR_EVENT: function (senderID, text) {
        event
            .setEventStartTime(senderID, text)
            .then((val) => {
                send.sendTextMessages(
                    senderID,
                    ["Please add a description that includes the start time, location and any other details"],
                    "SET_DESCRIPTION_FOR_EVENT"
                );
            })
            .catch( sendError(senderID) );
    },

    SET_DESCRIPTION_FOR_EVENT: function(senderID, text) {
        event
            .setEventDescription(senderID, text)
            .then( (val) => {
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
            .catch( sendError(senderID) );
    }
}

function sendError(senderID) {
    return (reason) => {
        facebook.send.sendTextMessages(
            senderID,
            [reason]
        );
    }
}