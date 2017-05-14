'use strict';
var driver = require('./driver');


module.exports = class User {

    constructor(id) {
        console.log("constructor for user with id " + id);
        this.id = id;
        var session = driver.session();

        session
            .run("CREATE (n {hello: 'SecondWorld'}) RETURN n.hello")
            .then(function (result) {
                result.records.forEach(function (record) {
                    console.log(record)
                });

                session.close();
            })
            .catch(function (error) {
                console.log(error);
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