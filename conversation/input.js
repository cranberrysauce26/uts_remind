'use strict';

const send = require('../facebook/send');
const user = require('../model/user');
const event = require('../model/event');

const defaultFailure = require('./default_failure');

function formatStringQuotes(text) {
    var _text = '';
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char==='\'' || char==="\"") {
            _text += "\\"+char;
        } else {
            _text += char;
        }
    }
    return _text;
}

module.exports = function (senderID, text, state) {
    inputs[state](senderID, formatStringQuotes(text) );
}

const inputs = {

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
                user.setInputState(senderID, 'SET_REMIND_TIME_FOR_EVENT').catch(defaultFailure(senderID));
            })
            .catch(defaultFailure(senderID))
    },

    SET_REMIND_TIME_FOR_EVENT: function (senderID, text) {
        console.log("Setting time for event", text);
        event
            .setEventRemindTime(senderID, text)
            .then(() => {
                send.sendTextMessages(
                    senderID,
                    ["Please add a description that includes the start time, location and any other details"]
                );
                user.setInputState(senderID, 'SET_DESCRIPTION_FOR_EVENT').catch(defaultFailure(senderID));
            })
            .catch( (errno) => {
                console.log("recieved error setting remind time", errno);
                if (errno===0) {
                    send.sendTextMessages(senderID, ["Sorry a database error occured. Please try again."]);
                    return;
                }
                if (errno===1) {
                    send.sendTextMessages(senderID, ["Please enter a valid date. For example, you can say", ["May 4 at 3pm"]]);
                    return;
                }
                send.sendTextMessages(senderID, ["Sorry, an unknown error occured. Please start from the beginning"]);
                user.setInputState(senderID, 'DEFAULT').catch(defaultFailure(senderID));
            });
    },

    SET_DESCRIPTION_FOR_EVENT: function (senderID, text) {
        event
            .setDescription(senderID, text)
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

