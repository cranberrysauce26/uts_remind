'use strict';
var connection = require('./connection');

var Event = require('./event');

class User {
    constructor(id, name) {
        this.id = id;
        this.firstName = name.firstName;
        this.lastName = name.lastName;
    }

    save() {

    }

    subscribeToEvent(eventName) {
        var event = new Event(eventName);
        event.addSubscriber(this.id);
    }

    isNewUser() {

    }

    configureDefaultSettings() {

    }

    unsubscribe() {

    }

    getAllFutureEvents() {

    }
}