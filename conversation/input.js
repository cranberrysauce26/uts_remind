'use strict';

const send = require('../facebook/send');
const user = require('../model/user');
const event = require('../model/event');

const defaultFailure = require('./default_failure');

module.exports = {

    DEFAULT: function (senderID, text) {
        if (text==='add event') {
            console.log("add event");
            send.sendQuickReplies(senderID, 'add event?', [
                {
                    text: "Add event",
                    payload: "CREATE_EVENT"
                }
            ]);
            return;
        }
        send.sendTextMessages(senderID, ["Sorry I am illiterate"]);
    },

    SET_NAME: function (senderID, text) {
        console.log("In SET_NAME function input.js");
        user
            .setName(senderID, text)
            .then( () => {
                console.log("In .then set_name input.js");
                send.sendTextMessages(senderID, ["Recorded!"]);
                user.setInputState(senderID, 'DEFAULT').catch(defaultFailure(senderID));
            })
            .catch(defaultFailure(senderID));
    },

    SET_NAME_FOR_EVENT: function (senderID, text) {
        console.log("Setting name for event", text);
        event
            .create(senderID, text)
            .then(() => {
                console.log("Succesfully set name");
                send.sendTextMessages(
                    senderID,
                    ["When do you want people to be reminded?"]
                );
                user.setInputState(senderID, 'SET_TIME_FOR_EVENT').catch(defaultFailure(senderID));
            })
            .catch(defaultFailure(senderID))
    },

    SET_TIME_FOR_EVENT: function (senderID, text) {
        console.log("Setting time for event", text);
        event
            .setEventStartTime(senderID, text)
            .then(() => {
                send.sendTextMessages(
                    senderID,
                    ["Please add a description that includes the start time, location and any other details"]
                );
                user.setInputState(senderID, 'SET_DESCRIPTION_FOR_EVENT').catch(defaultFailure(senderID));
            })
            .catch(defaultFailure(senderID));
    },

    SET_DESCRIPTION_FOR_EVENT: function (senderID, text) {
        event
            .setEventDescription(senderID, text)
            .then(() => {
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
            .catch(defaultFailure(senderID));
    }
}

