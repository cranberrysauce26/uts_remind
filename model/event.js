'use strict';

const driver = require('./driver');
const nodeSchedule = require('node-schedule');
const remind = require('../conversation/remind');
const chrono = require('chrono-node');

module.exports = {

//#region CREATE
    createNewEvent: function (senderID, name) {

        const session = driver.session();

        return new Promise((resolve, reject) => {
            session
                .run(`
                    OPTIONAL MATCH (:User {facebook_id: '${senderID}'})-[:Owns]->(b:Event {scheduled: FALSE} ) 
                    WITH COUNT(b) AS numOpen
                    OPTIONAL MATCH (a:Event {name: '${name}'})
                    WITH COUNT(a) AS numSameName, numOpen
                    MERGE (u:User {facebook_id: '${senderID}'})
                    MERGE (v:Event {name: '${name}'})
                    ON CREATE SET v.scheduled=FALSE
                    MERGE (u)-[:Owns]->(v) 
                    MERGE (v)-[:Reminds]-(u)
                    RETURN 
                        (numSameName > 0) AS hasDuplicateName, 
                        (numOpen > 0) AS hasUnscheduledEvent
                `)
                .then(result => {
                    const hasUnscheduledEvent = result.records[0].get('hasUnscheduledEvent');
                    console.log("hasUnscheduledEvent is", hasUnscheduledEvent);
                    if (hasUnscheduledEvent) {
                        return reject('UNSCHEDULED_EVENT_ERROR');
                    }
                    const hasDuplicateName = result.records[0].get('hasDuplicateName');
                    console.log("hasDuplicateName is", hasDuplicateName);
                    if (hasDuplicateName) {
                        return reject('DUPLICATE_EVENT_NAME_ERROR');
                    }
                    console.log("Succesfully created event in event!");
                    session.close();
                    resolve();
                })
                .catch(error => {
                    console.log("Error creating event", error);
                    reject('DATABASE_ERROR');
                });
        })
    },

    deleteUnscheduledEvent: function (senderID) {
        const session = driver.session();
        return session
            .run(`
                MATCH (:User {facebook_id: '${senderID}'}-[:Owns]->(e:Event {scheduled: FALSE})
                DETACH DELETE e
            `)
            .then(() => session.close())
            .catch(error => {
                console.log("Error deleting event", error);
                return Promise.reject('DATABASE_ERROR');
            });
    },

    setDescription: function (senderID, description) {
        const session = driver.session();
        return session
            .run(`
                MATCH (:User {facebook_id: '${senderID}'})-[:Owns]->(e:Event {scheduled: FALSE}) 
                SET e.description='${description}' 
            `)
            .then(() => {
                console.log("set the description in event!");
                session.close();
            })
            .catch(error => {
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
                return Math.floor(chronoResults[0].start.date().getTime() / 60000);
            }

            function setRemindTime(minutes) {
                return session
                    .run(`
                        MATCH (:User {facebook_id: '${senderID}'})-[:Owns]->(e:Event {scheduled: FALSE})
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
                .catch(error => {
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
                console.log("ReminderData is", reminderData);
                console.log("Typeof remiderData is", typeof (reminderData));
                const remindTime = result.records[0].get('remindTime');
                console.log("remindTime is", remindTime);
                nodeSchedule.scheduleJob(new Date(remindTime * 60000), remind(reminderData));
            })
            .catch(err => {
                console.error("Error scheduling event", err);
                return Promise.reject('DATABASE_ERROR');
            })
    },

//#endregion CREATE

//#region LIST
    listEvents: function(time) {
        console.log("listing all events in coming week in event");
        const session = driver.session();
        const now = new Date();
        const minutesNow = Math.floor( now.getTime()/60000 );
        let nextWeek;

        switch (time) {
            case 'WEEK':
                nextWeek = minutesNow+7*24*60;
                break;
            case 'MONTH':
                nextWeek = minutesNow+7*24*60*4;
                break;
            case 'YEAR':
                nextWeek = minutesNow+7*24*60*365;
                break;
            default:
                // Week by default
                nextWeek = minutesNow+7*24*60;
        }
        
        return session
            .run(`
                MATCH (e:Event {scheduled: TRUE})
                WITH e 
                ORDER BY e.remind_time ASC
                WHERE e.remind_time > ${minutesNow} AND e.remind_time < ${nextWeek}
                RETURN COLLECT(e.name) AS eventNames
            `)
            .then( result => {
                console.log("result for coming events is", result);
                session.close();
                return result.records[0].get('eventNames');
            })
            .catch( err => {
                console.log("list all events in coming week error", err);
                return Promise.reject('DATABASE_ERROR');
            })
    },

    getDescription: function(eventName) {
        const session = driver.session();
        return session
            .run(`
                MATCH (e:Event {name: '${eventName}'})
                RETURN e.description AS description
            `)
            .then( result => {
                session.close();
                return result.records[0].get('description');
            })
            .catch( err => {
                console.log("get description error", err);
                return Promise.reject('DATABASE_ERROR');
            })
    },

    addUserToEvent: function (senderID, eventName) {
        const session = driver.session();
        return new Promise( (resolve, reject) => {
            session
                .run(`
                    OPTIONAL MATCH 
                    (:Event {name: '${eventName}'})-[r:Reminds]->(:User {facebook_id: '${senderID}'})
                    WITH r IS NOT NULL AS alreadySubscribed
                    MERGE (e:Event {name: '${eventName}'})
                    MERGE (u:User {facebook_id: '${senderID}'})
                    MERGE (e)-[:Reminds]->(u)
                    RETURN alreadySubscribed
                `)
                .then( result => result.records[0].get('alreadySubscribed'))
                .then( alreadySubscribed => {
                    if (alreadySubscribed) {
                        reject('ALREADY_SUBSCRIBED_TO_EVENT_ERROR')
                    }
                    session.close();
                })
                .catch( err => {
                    console.log("error subscribing to event", err);
                    reject('DATABASE_ERROR');
                })
        })

    }
//#endregion LIST
}




