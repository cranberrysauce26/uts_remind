'use strict';

const send = require('../facebook/send');

module.exports = (senderID, nextInputState='DEFAULT') => {
    return (reason) => {
        send.sendTextMessages(
            senderID,
            [reason]
        );
        user.setInputState(senderID, nextInputState);
    }
};
