'use strict';

const send = require('../facebook/send');

/*
reminderData = {
    eventName: "event-name",
    eventDescription: "jhgjhgjh",
    eventOwner: 765675765,
    subscribers: [
        {
            id: 87678687,
            first_name: 'first_name'
        },
        {
            id: 3354435435,
            first_name: 'first_name'
        }
    ]
}

*/

module.exports = function (reminderData) {
    console.log("In remind.js returning a function with reminderData");
    console.log(JSON.stringify(reminderData));
    return () => {
        console.log("Executing event");
        reminderData.subscribers.forEach((sub) => {
            console.log("Sub is,", JSON.stringify(sub) )
            send.sendTextMessages(
                sub.id,
                (() => {
                    console.log("In anonymous function");
                    if (sub.id == reminderData.eventOwner) {
                        //
                        return [
                            `Hi ${sub.first_name}! Your event "${reminderData.eventName}" has been sent to all subscribers!`,
                            `Here is the description you wrote`,
                            reminderData.eventDescription
                        ];
                    }
                    return [
                        `Hi ${sub.first_name}! You subscribed to the event "${reminderData.eventName}".`,
                        `In case you forgot, here's the description`,
                        reminderData.eventDescription
                    ];

                })()
            );
        });
    }
}