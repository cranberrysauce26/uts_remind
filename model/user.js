'use strict';
// var driver = require('./driver');
const neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver(process.env.GRAPHENEDB_BOLT_URL, neo4j.auth.basic(process.env.GRAPHENEDB_BOLT_USER, process.env.GRAPHENEDB_BOLT_PASSWORD));


class User {

    constructor(id) {
        console.log("constructor for user with id " + id);
        this.id = id;
        var session = driver.session();
        session
            .run("CREATE (n {hello: 'SecondWorld'}) RETURN n.name")
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