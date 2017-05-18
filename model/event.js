'use strict';

const driver = require('./driver');
const schedule = require('node-schedule');

module.exports = {
    create: function(senderID, name) {
        // Each creator has at most one event
    },
    

    setDescription: function(senderID, description) {
        this.description = description;
    },

    setEventStartTime: function(senderID, startTime) {
        this.startTime = startTime;
        if (this.remindTime===null) {
            this.remindTime = /* a default value*/ 5;
        }
    },

    schedule: function(senderID) {

    },
    
}




