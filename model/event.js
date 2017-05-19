'use strict';

const driver = require('./driver');
const schedule = require('node-schedule');

module.exports = {
    create: function(senderID, name) {
        // Each creator has at most one event
        const session = driver.session();
        return session
            .run(`CREATE (e:Event {name: '${name}', owner_id: ${senderID}}) RETURN e`)
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
            .run(`MATCH (e:Event) WHERE e.owner_id=${senderID} SET e.description='${description}' RETURN e`)
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

    setEventStartTime: function(senderID, startTime) {
        
    },

    schedule: function(senderID) {

    },
    
}




