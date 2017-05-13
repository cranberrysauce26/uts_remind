'use strict';
var driver = require('./driver');

var Event = require('./event');

class User {

    constructor(id) {
        this.id = id;
        var session = driver.session();
        session
            .run('CREATE (usr:USER {id={idParam} }) RETURN usr', {idParam: id})
            .subscribe({
                onCompleted: function() {
                    session.close();
                },
                onError: function(err) {
                    console.error(err);
                }
            });
    }

    setName(name) {
        this.name = name;
        console.log("some logic in here");
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