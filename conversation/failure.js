'use strict';

const send = require('../facebook/send');
const user = require('../model/user');

module.exports = (senderID) => {
    (errorCode) => {
        if (failures.hasOwnProperty(errorCode)) {
            return failures[errorCode](senderID);
        }
        console.error("UNDEFINED ERROR CODE!!!");
        send.sendTextMessages(senderID, ["An unknown error occured. Sorry"]);
    }
};

const failures = {

    DATABASE_ERROR: (senderID) => {
        send.sendTextMessages(senderID, ["Sorry a database error occured."]);
        user.setInputState(senderID, 'DEFAULT');
    },

    INVALID_DATE_ERROR: (senderID) => {
        send.sendTextMessages(senderID, ["Please enter a valid date. For example, you can say May 4 at 3pm, or Today at 5pm"]);
    },

    PAST_DATE_ERROR: (senderID) => {
        send.sendTextMessages(senderID, ["We don't have a time machine yet. Please enter a date in the future"]);
    },

    FACEBOOK_ERROR: (senderID) => {
        send.sendTextMessages(senderID, ["A facebook error occured. Sorry :("]);
        user.setInputState(senderID, 'DEFAULT');
    }

}
