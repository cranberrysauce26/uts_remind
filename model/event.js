'use strict';

const driver = require('./driver');
const nodeSchedule = require('node-schedule');
const remind = require('../conversation/remind');
const chrono = require('chrono-node');

module.exports = {

    createNewEvent: function (senderID, name) {
        // Each creator has at most one event
        const session = driver.session();
        return session
            .run(`
                MATCH (u:User {facebook_id: '${senderID}'})-[:Owns]->(:Event {scheduled: FALSE} ) 
                WITH count(*) AS numOpen, u
                MATCH (u)-[:Owns]->(:Event {name: '${name}'})
                WITH count(*) AS numSameName
                FOREACH (_ IN CASE numOpen+numSameName WHEN 0 THEN [1] ELSE [] END | 
                CREATE (u)-[:Owns]->(:Event {name: '${name}', scheduled: FALSE}) )
                RETURN numOpen, numSameName
            `)
            .then( result => {
                const numOpen = results.records[0].get('numOpen');
                if (numOpen > 0) {
                    return Promise.reject('UNSCHEDULED_EVENT_ERROR');
                }
                const numSameName = results.records[0].get('numSameName');
                if (numSameName > 0) {
                    return Promise.reject('DUPLICATE_EVENT_NAME_ERROR');
                }
                console.log("Succesfully created event in event!");
                session.close();
            })
            .catch( error => {
                console.log("Error creating event", error);
                return Promise.reject('DATABASE_ERROR');
            });
    },

    deleteUnscheduledEvent: function (senderID) {
        const session = driver.session();
        return session
            .run(`
                MATCH (:User {facebook_id: '${senderID}'}-[:Owns]->(e:Event {scheduled: FALSE})
                DETACH DELETE e
            `)
            .then(() => session.close())
            .catch( error => {
                console.log("Error deleting event", error);
                return Promise.reject('DATABASE_ERROR');
            });
    },

    setDescription: function (senderID, description) {
        const session = driver.session();
        return session
            .run(`
                MATCH (:User {facebook_id: '${senderID}'}-[:Owns]->(e:Event {scheduled: FALSE}) 
                SET e.description='${description}' 
            `)
            .then(() => {
                console.log("set the description in event!");
                session.close();
            })
            .catch( error => {
                console.log("Error adding description for event", error);
                return Promise.reject('DATABASE_ERROR');
            });
    },

    setEventRemindTime: function (senderID, remindTime) {
        const session = driver.session();
        var chronoResults = new chrono.parse(remindTime);

        return new Promise((resolve, reject) => {

            if (chronoResults.length === 0) {
                console.log("Invalid date");
                reject('INVALID_DATE_ERROR');
                return;
            }

            function getMinutes(result) {
                const timezoneOffset = result.records[0].get('timezoneOffset');
                chronoResults[0].start.assign('timezoneOffset', 60 * timezoneOffset);
                const date = chronoResults[0].start.date();
                const now = new Date();
                if (date <= now) {
                    reject('PAST_DATE_ERROR');
                    return Promise.reject();
                }
                return Math.floor(chronoResults[0].start.date().getTime() / 6000);
            }

            function setRemindTime(minutes) {
                return session
                    .run(`
                        MATCH (:User {facebook_id: '${senderID}'}-[:Owns]->(e:Event {scheduled: FALSE})
                        SET e.remind_time=${minutes}
                    `)
                    .then(() => {
                        session.close();
                        resolve();
                    })
                    .catch((error) => {
                        console.log("Error setting event remind time", error);
                        reject('DATABASE_ERROR');
                    })
            }

            session
                .run(`
                    MATCH (u:User {facebook_id: '${senderID}'}) 
                    RETURN u.timezone AS timezoneOffset
                `)
                .then(getMinutes)
                .then(setRemindTime)
                .catch((error) => {
                    console.log("error at timezone query?", error);
                    reject('DATABASE_ERROR');
                })
        })

    },

    schedule: function (senderID) {
        console.log(`Scheduling event for user with id ${senderID}`);
        const session = driver.session();

        return session
            .run(`
                MATCH (:User {facebook_id: '${senderID}'})-[:Owns]->(e:Event {scheduled: FALSE})-[:Reminds]->(u:User)
                WITH {
                    eventName: e.name, 
                    eventDescription: e.description,
                    eventOwner: '${senderID}',
                    subscribers: COLLECT({
                        id: u.facebook_id,
                        first_name: u.first_name
                    })
                } AS reminderData, e 
                SET e.scheduled=TRUE
                RETURN reminderData, e.remind_time AS remindTime
            `)
            .then(result => {
                const reminderData = result.records[0].get('reminderData');
                console.log("ReminderData is", JSON.parse(reminderData));
                const remindTime = result.records[0].get('remindTime');
                console.log("remindTime is", remindTime);
                nodeSchedule.scheduleJob(new Date(remindTime * 6000), remind(reminderData));
            })
            .catch( err => {
                console.error("Error scheduling event", err);
                return Promise.reject('DATABASE_ERROR');
            })
    },

}




