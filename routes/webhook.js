'use strict'

const express = require('express');
var router = express.Router();
var conversation = require('../conversation');

router.get('/', function (req, res) {
    if (req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
        res.status(200).send(req.query["hub.challenge"]);
    } else {
        res.sendStatus(403);
    }
});

router.post('/', function (req, res) {
    var data = req.body;
    console.log(JSON.stringify(data));

    if (data.object === 'page') {
        if (data.entry) {
            conversation.respond(data.entry);
            res.sendStatus(200);
        } else {
            console.error("post call to webhook does not have entry property");
        }
       
    }
});

module.exports = router;
