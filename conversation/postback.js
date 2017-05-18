'use strict';

const facebook = require('./facebook');
const user = require('../model/user');


module.exports = {
    GET_STARTED: function (senderID) {
        console.log("New user with id", senderID);

        if (user.createNewUser(senderID)) {
            facebook.send.sendTextMessages(
                senderID,
                ["Welcome to UTS Remind", "Please enter a username to get started"],
                "SET_NAME"
            );
        } else {
            facebook.send.sendTextMessages(
                senderID, 
                ["Sorry we are experiencing problems right now", "Please check back later"]
            );
        }
    },

    LIST_FUTURE_EVENTS_FOR_USER: function(senderID) {
        
    }
}