'use strict';

const send = require('../facebook/send');
const user = require('../model/user');
const event = require('../model/event');

const apiai = require('apiai')(process.env.API_AI_CLIENT_ACCESS_TOKEN);

const failure = require('./failure');

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

        if (text==='list events') {
            console.log("listing events");
            send.sendQuickReplies(senderID, 'list events?', [
                {
                    text: "List events within a week",
                    payload: "LIST_EVENTS_IN_COMING_WEEK"
                }
            ]);
            return;
        }

        const ai = apiai.textRequest(text, {
            sessionId: 'a_random_session_id'
        });

        ai.on('response', (response) => {
            const responseText = response.result.fulfillment.speech;
            send.sendTextMessages(senderID, [responseText]);
        })

        ai.on('error', (error) => {
            send.sendTextMessages(senderID, ["Sorry I am illiterate"]);
        })

        ai.end();
    },

    SET_NAME_FOR_EVENT: function (senderID, text) {
        console.log("Setting name for event", text);
        event
            .createNewEvent(senderID, text)
            .then(() => {
                console.log("Succesfully set name");
                send.sendTextMessages(
                    senderID,
                    ["When do you want people to be reminded?"]
                );
                user.setInputState(senderID, 'SET_REMIND_TIME_FOR_EVENT').catch(failure(senderID));
            })
            .catch( failure(senderID) )
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
                user.setInputState(senderID, 'SET_DESCRIPTION_FOR_EVENT').catch( failure(senderID) );
            })
            .catch( failure(senderID) );
    },

    SET_DESCRIPTION_FOR_EVENT: function (senderID, text) {
        event
            .setDescription(senderID, text)
            .then(() => {
                user.setInputState('DEFAULT');
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
            .catch(failure(senderID));
    }
}

