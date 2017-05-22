'use strict';

const send = require('../facebook/send');
const user = require('../model/user');

module.exports = (senderID) => {
    return (errorCode) => {
        console.log("errorCode is", errorCode);
        if (failures.hasOwnProperty(errorCode)) {
            console.log("failures has property errorCode");
            return failures[errorCode](senderID);
        }
        console.error("UNDEFINED ERROR CODE!!!");
        send.sendTextMessages(senderID, ["An unknown error occured. Sorry"]);
    }
};

const failures = {

    DATABASE_ERROR: senderID => {
        console.log("Triggering databse error");
        send.sendTextMessages(senderID, ["Sorry a database error occured."]);
        user.setInputState(senderID, 'DEFAULT');
    },

    INVALID_DATE_ERROR: senderID => {
        console.log("Triggering invalid date error");
        send.sendTextMessages(senderID, ["Please enter a valid date. For example, you can say May 4 at 3pm, or Today at 5pm"]);
    },

    PAST_DATE_ERROR: senderID => {
        console.log("Triggering past date error");
        send.sendTextMessages(senderID, ["We don't have a time machine yet. Please enter a date in the future"]);
    },

    FACEBOOK_ERROR: senderID => {
        console.log("triggering facebook error");
        send.sendTextMessages(senderID, ["A facebook error occured. Sorry :("]);
        user.setInputState(senderID, 'DEFAULT');
    },

    DUPLICATE_EVENT_NAME_ERROR: senderID => {
        console.log("triggering duplicate event name error");
        send.sendTextMessages(senderID, ["An event with that name already exists.", "Please enter a different name"]);
    },

    UNSCHEDULED_EVENT_ERROR: senderID => {
        console.log("triggering unscheduled event error");
        send.sendTextMessages(senderID, ["You have an event that you did not finish scheduling", "Please schedule it first"]);
    },

    ALREADY_SUBSCRIBED_TO_EVENT_ERROR: senderID => {
        console.log("triggering already subscribed to event error");
        send.sendTextMessages(senderID, ["You aready subscribed to this event"] );
        user.setInputState('DEFAULT');
    }
}
