'use strict'

const express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    if (req.query["hub.verify_token"] === process.env.VALIDATION_TOKEN) {
        console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});

router.post('/', function(req, res) {
    var data = req.body;

    if (data.object === 'page') {
        data.entry.forEach(function(event) {
            if (event.message) {
                // do something
            } else {
                console.log("webhook recieved invalid event");
            }
        });
    }
});

module.exports = router;
