'use strict';

const facebook = require('../facebook');
const user = require('../model/user');

module.exports = {

    DEFAULT: function(senderID, text) {
        facebook.send.sendTextMessages(senderID, ["Sorry I am illiterate"]);
    },

    SET_NAME : function(senderID, text) {
        if (user.setName(senderID, text)) {
            facebook.send.sendTextMessages(senderId, ["Recorded!"]);
        } else {
            facebook.send.sendTextMessages(senderId, ["Sorry an unknown error occured!"]);
        }
    }  
}
