'use strict';

const send = require('../facebook/send');
const user = require('../model/user');

module.exports = (senderID, nextInputState='DEFAULT') => {
    return (reason) => {
        send.sendTextMessages(
            senderID,
            [reason]
        );
        user.setInputState(senderID, nextInputState);
    }
};
