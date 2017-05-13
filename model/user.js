'use strict';
var driver = require('./driver');

class User {

    constructor(id) {
        console.log("constructor for user with id "+id);
        this.id = id;
        var session = driver.session();
        session
            .run("CREATE (n {facebook_id:"+id+"}) RETURN n.facebook_id")
            .then(function(result) {
                console.log("DATABASE: In .then");
                result.records.forEach(function(record) {
                    console.log(record);
                })
                session.close();
            })
            .catch(function(err) {
                console.log(err);
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