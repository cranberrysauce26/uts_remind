'use strict';
var driver = require('./driver');

class User {

    constructor(id) {
        console.log("constructor for user with id "+id);
        this.id = id;
        var session = driver.session();
        session
            .run('CREATE (usr:USER {id={idParam} }) RETURN usr', {idParam: id})
            .subscribe({
                onCompleted: function() {
                    console.log("Created new user");
                    session.close();
                },
                onError: function(err) {
                    console.error(err);
                }
            });
    }

    setName(name) {
        this.name = name;
        console.log("name");
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