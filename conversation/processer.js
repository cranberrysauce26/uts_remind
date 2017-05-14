'use strict';

const facebook = require('../facebook');
const User = require('../model/user');

var user;

module.exports.processInput = function (senderID, text) {
    // Default function.
    facebook.send.sendTextMessages(senderID, ["Sorry, I am illiterate"]);
}

module.exports.processPostback = {};

module.exports.processPostback.GET_STARTED = function(senderID) {
    console.log("New user with id", senderID);

    facebook.send.sendTextMessages(senderID, ["Welcome to UTS Remind", "Please enter a username to get started"]);

    user = new User(senderID);

    setProcessInput(function(senderID, text) {
        // text is the name.
        user.setName(text);        
    });
}
    
function setProcessInput(target) {
    var tmp = module.exports.processInput;
    module.exports.processInput = function(senderID, text) {
        target(senderID, text);
        module.exports.processInput = tmp;
    }
}