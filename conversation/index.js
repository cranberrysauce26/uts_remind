'use strict';

const facebook = require('../facebook');

module.exports = {
    respond: function(userInput) {
        facebook.send.sendmessage(userInput);
    }
}