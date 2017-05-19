'use strict';

const driver = require('./driver');
const schedule = require('node-schedule');

module.exports = {
    create: function(senderID, name) {
        // Each creator has at most one event
        const session = driver.session();
        return session
            .run(`MATCH (u:User) WHERE u.facebook_id=${senderID} CREATE (e:Event {name: '${name}', owner_id: ${senderID}, scheduled: false})-[:Reminds]->(u) RETURN e`)
            .then( () => {
                console.log("Created event in event!");
                session.close();
            })
            .catch( (error) => {
                console.log("Error creating event", error);
                return new Promise( (resolve, reject) => {
                    reject("A database error occured");
                } );
            });
    },
    

    setDescription: function(senderID, description) {
        const session = driver.session();
        return session
            .run(`MATCH (e:Event) WHERE e.owner_id=${senderID} AND e.scheduled=false SET e.description='${description}' RETURN e`)
            .then( () => {
                console.log("set the description in event!");
                session.close();
            })
            .catch( (error) => {
                console.log("Error adding description for event", error);
                return new Promise( (resolve, reject) => {
                    reject("A database error occured");
                } );
            });
    },

    setEventRemindTime: function(senderID, remindTime) {
        const session = driver.session();
        const formattedRemindTime = remindTime;
        return session
            .run(`MATCH (e:Event) WHERE e.owner_id=${senderID} AND e.scheduled=false SET e.remind_time='${formattedRemindTime}' RETURN e`)
            .then( () => {
                console.log("Set the event remind time");
                session.close();
            })
            .catch( (error) => {
                console.log("Error setting event remind time", error);
                return new Promise( (resolve, reject) => {
                    reject("A database error occured");
                });
            })
    },

    schedule: function(senderID) {
        return new Promise( (resolve, reject) => {
            resolve();
        });
    },
    
}




