'use strict';

const send = require('../facebook/send');
const user = require('../model/user');
const event = require('../model/event');

const failure = require('./failure');

module.exports = function (senderID, payload) {
    let queryIndex = payload.indexOf('?');
    if (queryIndex !== -1) {
        let command = payload.substring(0, queryIndex);
        console.log("command is", command);
        let query = payload.substring(queryIndex + 1);
        console.log("query is", query);
        return postbacks[command](senderID, query);
    }
    postbacks[payload](senderID);
}

const postbacks = {

    DEFAULT: function (senderID) {
        user.setInputState(senderID, 'DEFAULT').catch(failure(senderID));
        send.sendTextMessages(senderID, ["You're back home"]);
    },

    GET_STARTED: function (senderID) {
        console.log("New user with id", senderID);
        send.sendTextMessages(senderID, ["Welcome to UTS Remind", "Please give me a second to set up your account"]);
        user
            .createNewUser(senderID)
            .then(() => {
                console.log("postback.js. succesfully created user with id", senderID);
                send.sendTextMessages(
                    senderID,
                    ["All right!", "To the testers, type 'add event' or 'list events'"]
                );
            })
            .catch(failure(senderID));
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
    },

    LIST_EVENTS: function (senderID, time) {
        console.log("Listing events in coming week");
        event
            .listEvents(time)
            .then((eventNames) => {
                console.log("In then with eventNames", eventNames);
                let t, n, N;
                switch (time) {
                    case 'WEEK':
                        t = 'week';
                        n = 'month';
                        N = 'MONTH';
                        break;
                    case 'MONTH':
                        t = 'month';
                        n = 'year';
                        N = 'YEAR';
                        break;
                    case 'YEAR':
                        t = 'year';
                        n = null;
                        N = null;
                        break;
                    default:
                        t = 'week';
                        n = 'month';
                        N = 'MONTH';
                }
                if (eventNames.length === 0) {
                    send.sendTextMessages(senderID, ["There are no events in the next " + t]);
                    return;
                }
                let buttons = [];
                eventNames.forEach(eventName => {
                    buttons.push({
                        text: eventName,
                        payload: 'DESCRIBE_EVENT?' + eventName
                    });
                });
                if (n !== null) {
                    buttons.push({
                        text: 'Tap for events in the next '+n,
                        payload: 'LIST_EVENTS?'+N
                    });
                }

                send.sendButtons(senderID, 'Here are the events in the coming ' + t + '. Tap to get a description', buttons)
            })
    },

    DESCRIBE_EVENT: function (senderID, eventName) {
        console.log("In describe event with event name", eventName);
        event
            .getDescription(eventName)
            .then(description => {
                console.log("got description", description);
                send.sendTextMessages(
                    senderID,
                    ["Here's the description for event " + eventName, description],
                    () => {
                        send.sendQuickReplies(senderID, 'Schedule this event', [
                            {
                                text: 'Schedule',
                                payload: 'SUBSCRIBE_TO_EVENT?' + eventName
                            },
                            {
                                text: 'Cancel',
                                payload: 'DEFAULT'
                            }
                        ]);
                    }
                );
            })
    },

    SUBSCRIBE_TO_EVENT: function (senderID, eventName) {
        console.log("adding user to event");
        event
            .addUserToEvent(senderID, eventName)
            .then(() => {
                send.sendTextMessages(senderID, ["You've been added to the event!"]);
            })
            .catch(failure(senderID));
    }
}