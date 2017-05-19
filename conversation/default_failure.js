'use strict';

const send = require('../facebook/send');
const user = require('../model/user');

module.exports = (senderID, nextInputState='DEFAULT') => {
    console.log("In default error");
    return (reason) => {
        send.sendTextMessages(
            senderID,
            [reason]
        );
        user.setInputState(senderID, nextInputState);
    }
};
