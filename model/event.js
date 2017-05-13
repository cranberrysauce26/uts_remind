'use strict';

const driver = require('./driver');
const schedule = require('node-schedule');

module.exports = class Event {
    constructor(eventName) {
        this.name = eventName;
        this.creatorID = null;
        this.description = null;
        this.remindTime = null;
        this.password = null;
    }

    // static methods

    static getAllFutureEvents() {
        // returns a list of event objects
    }


    static doesEventExist() {
       
    }

    // Configuration

    setDescription(description) {
        this.description = description;
    }

    setEventStartTime(startTime) {
        this.startTime = startTime;
        if (this.remindTime===null) {
            this.remindTime = /* a default value*/ 5;
        }
    }

    setCreator(creatorID) {
        this.creatorID = creatorID;
    }

    setPassword(password) {
        this.password = password;
    }


    addSubscriber(studentID) {

    }


    saveAndSchedule() {
        // save the event in the database
        // create a job
        _save();
        _schedule();
    }

    _save() {

    }

    _schedule() {

    }

    _eventProcedure() {
        // This returns a function
        return function() {
            // for every subscriber, call facebook.sendMessage(subscriber, description);
        }
    }
    
    
}




