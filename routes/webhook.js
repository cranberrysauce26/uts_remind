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
    console.log("POST call to webhook");
    var data = req.body;

    if (data.object === 'page') {
        data.entry.forEach(function (messagingEvent) {
            conversation.respond(messagingEvent);
        });
        res.sendStatus(200);
    }
});

module.exports = router;
/*

at=error code=H12 desc="Request timeout" method=POST path="/webhook?hub.veri
fy_token=legit_token" host=uts-remind.herokuapp.com request_id=8ee28ade-897e-4d62-ab71-ec58706eeb75 fwd="99.231.244.250" dyno
=web.1 connect=1ms service=30000ms status=503 bytes=0 protocol=https
*/