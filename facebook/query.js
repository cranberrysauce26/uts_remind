'use strict';
const request = require('request');

module.exports = {
    /*
        fields = 'first_name,last_name,timezone'
    */
    userInfo: (id, fields, callback) => {
        request({
            url: `https://graph.facebook.com/v2.6/${id}`,
            qs: {
                fields: fields,
                access_token: process.env.PAGE_ACCESS_TOKEN
            }
        }, (err, response, body) => {
            if (err) {
                // null for error
                callback(null);
            }
            callback( JSON.parse(body) );
        });
    }
}