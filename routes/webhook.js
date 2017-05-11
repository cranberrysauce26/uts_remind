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
        data.entry.forEach(function (pageEntry) {
            conversation.respond(pageEntry);
        });
        res.sendStatus(200);
    }
});

module.exports = router;
