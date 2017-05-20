'use strict';

var driver = require('./driver');

module.exports = {
    createNewGroup: function(senderID, groupName) {
        const session = driver.session();
        return new Promise( (resolve, reject) => {
            // Check if the groupName already exists
            // If it does, throw a rejection
        })
    }
}