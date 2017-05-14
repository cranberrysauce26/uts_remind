'use strict';
var driver = require('./driver');


module.exports = class User {

    constructor(id) {
        console.log("constructor for user with id " + id);
        this.id = id;
        var session = driver.session();

        session
            .run("CREATE (n:User {facebook_id:"+id+"}) RETURN n.id")
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
        console.log("in name");
        var session = driver.session();
        session
            .run("MATCH (p:User) WHERE p.facebook_id="+this.id+" SET p.name='"+name+"' RETURN p")
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