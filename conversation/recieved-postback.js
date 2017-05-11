'use strict';

const facebook = require('../facebook');

module.exports = function(postbackEvent) {
    console.log("In function recieved postback with postbackEvent");
    console.log(JSON.stringify(postbackEvent));
    // do someting.
    console.log("payload is", postbackEvent.postback.payload);
    facebook.send.sendTextMessage(postbackEvent.sender.id, postbackEvent.postback.payload);
}