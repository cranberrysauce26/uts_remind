'use strict';

const facebook = require('../facebook');

module.exports.processInput = function (senderID, text) {
    // Default function.
    if (text==='test') {
        console.log("recieved input 'test'");
        var quickReplies = [
            {
                "text": "Press me!",
                "payload": "TEST"
            }
        ];
        facebook.send.sendQuickReplies(senderID, "Press the button", quickReplies);
        return;
    }
    facebook.send.sendTextMessage(senderID, "Sorry, I am illiterate");
}

module.exports.processPostback = {};

module.exports.processPostback.TEST = function(senderID) {
    console.log("Recieved test postback");
    facebook.send.sendTextMessage(senderID, "Please enter a random thought");
    var tmp = module.exports.processInput;
    module.exports.processInput = function (senderID, text) {
        facebook.send.sendTextMessage(senderID, "Recieved your input!");
        module.exports.processInput = tmp;
    }
}

    