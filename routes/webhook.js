'use strict'

const express = require('express');
var router = express.Router();
var conversation = require('../conversation');

router.get('/', function (req, res) {
    console.log("calling router.get in webhook.js");
    if (req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
        console.log("Verified webhook");
        res.status(200).send(req.query["hub.challenge"]);
    } else {
        console.error("Verification failed. The tokens do not match.");
        res.sendStatus(403);
    }
});

router.post('/', function (req, res) {
    console.log("calling router.post in webhook.js");

    var data = req.body;

    if (data.object === 'page') {
        data.entry.forEach(function (messagingEvent) {
            conversation.respond(messagingEvent);
        });
    }
    res.sendStatus(200);
});

module.exports = router;
