'use strict'

const express = require('express');
var router = express.Router();
var conversation = require('../conversation');

router.get('/', function (req, res) {
    console.log("GET call to webhook");
    if (req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
        console.log("Verified webhook");
        res.status(200).send(req.query["hub.challenge"]);
    } else {
        console.error("Verification failed. The tokens do not match.");
        res.sendStatus(403);
    }
});

router.post('/', function (req, res) {
    console.log("POST call to webhook. data==");
    var data = req.body;
    console.log(JSON.stringify(data));

    if (data.object === 'page') {
        console.log("data.object==page");
        data.entry.forEach(function (messagingEvent) {
            console.log("recieved messagingEvent==");
            console.log(JSON.stringify(messagingEvent));
            conversation.respond(messagingEvent);
        });
        res.sendStatus(200);
    }
});

module.exports = router;
