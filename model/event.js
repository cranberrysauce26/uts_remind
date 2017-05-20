'use strict';

const driver = require('./driver');
const nodeSchedule = require('node-schedule');
const remind = require('../conversation/remind');
const chrono = require('chrono-node');

module.exports = {

    create: function (senderID, name) {
        // Each creator has at most one event
        const session = driver.session();
        return session
            .run(`MATCH (u:User) WHERE u.facebook_id='${senderID}' CREATE (e:Event {name: '${name}', owner_id: '${senderID}', scheduled: false})-[:Reminds]->(u) RETURN e`)
            .then(() => {
                console.log("Created event in event!");
                session.close();
            })
            .catch((error) => {
                console.log("Error creating event", error);
                return Promise.reject("A database error occured");
            });
    },

    deleteUnscheduledEvent: function (senderID) {
        const session = driver.session();
        return session
            .run(`MATCH (e:Event) WHERE e.owner_id='${senderID}' DETACH DELETE e`)
            .then(() => session.close())
            .catch((error) => {
                console.log("Error deleting event", error);
                return Promise.reject("A database error occured");
            });
    },

    setDescription: function (senderID, description) {
        const session = driver.session();
        return session
            .run(`MATCH (e:Event) WHERE e.owner_id='${senderID}' AND e.scheduled=false SET e.description='${description}' RETURN e`)
            .then(() => {
                console.log("set the description in event!");
                session.close();
            })
            .catch((error) => {
                console.log("Error adding description for event", error);
                return Promise.reject("A database error occured");
            });
    },

    setEventRemindTime: function (senderID, remindTime) {
        const session = driver.session();
        var chronoResults = new chrono.parse(remindTime);

        return new Promise((resolve, reject) => {
            if (chronoResults.length === 0) {
                console.log("Invalid date");
                reject(1);
                return;
            }
            session
                .run(`MATCH (u:User) WHERE u.facebook_id='${senderID}' RETURN u.timezone AS timezoneOffset`)
                .then((result) => {
                    const timezoneOffset = result.records[0].get('timezoneOffset');
                    chronoResults[0].start.assign('timezoneOffset', 60 * timezoneOffset);
                    console.log("date is ", chronoResults[0].start.date().toString());
                    return chronoResults[0].start.date().toString();
                })
                .then((formattedTime) => {
                    console.log("formattedTime is", formattedTime);
                    return session
                        .run(`MATCH (e:Event) WHERE e.owner_id='${senderID}' AND e.scheduled=false SET e.remind_time='${formattedTime}' RETURN e`)
                        .then((result) => {
                            console.log("Set the event remind time. result.records[0] is", JSON.stringify(result.records[0]));
                            session.close();
                            resolve();
                        })
                        .catch((error) => {
                            console.log("Error setting event remind time", error);
                            reject(0);
                        })
                })
                .catch((error) => {
                    console.log("error at timezone query?", error);
                    reject(0);
                })
        })

    },

    schedule: function (senderID) {
        console.log(`Scheduling event for user with id ${senderID}`);
        const session = driver.session();

        return session
            .run(`MATCH (e:Event)-[:Reminds]->(u:User) WHERE e.owner_id='${senderID}' AND e.scheduled=false RETURN e.remind_time AS remindTime, e.name AS eventName, e.description AS eventDescription, u.facebook_id AS userID, u.first_name AS firstName`)
            .then((result) => {
                console.log("Result is", JSON.stringify(result));
                var remindTime;

                var remindData = {
                    subscribers: []
                };

                result.records.forEach((q) => {
                                    
                    console.log("q is", q);
                    console.log(q.get('userID'));
                    remindTime = remindTime || q.get('remindTime');
                    remindData.eventName = remindData.eventName || q.get('eventName');
                    remindData.eventDescription = remindData.eventDescription || q.get('eventDescription');
                    remindData.subscribers.push({
                        id: q.get('userID'),
                        first_name: q.get('firstName')
                    });
                })
                console.log("remindTime is", remindTime);
                nodeSchedule.scheduleJob(new Date(remindTime), remind(remindData));
            })
            .then(() => {
                return session
                    .run(`MATCH (e:Event) WHERE e.owner_id='${senderID}' AND e.scheduled=false SET e.scheduled=true RETURN e.scheduled`)
                    .then(() => {
                        session.close();
                    })
                    .catch((err) => {
                        console.error("Error scheduling event", err);
                        return Promise.reject("A database error occured");
                    })
            })
            .catch((err) => {
                console.error("Error scheduling event", err);
                return Promise.reject("A database error occured");
            })
    },

}




