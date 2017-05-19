'use strict';
const request = require('request');

module.exports = {
    /*
        fields = 'first_name,last_name,timezone'
    */
    userInfo: (id, fields, callback) => {
        console.log(`querying facebook for id ${id} and for fields ${fields}`);
        request({
            url: `https://graph.facebook.com/v2.6/${id}`,
            qs: {
                fields: fields,
                access_token: process.env.PAGE_ACCESS_TOKEN
            }
        }, (err, response, body) => {
            if (err) {
                console.log(`There was an error querying facebook`, err);
                // null for error
                callback(null);
            }
            console.log(`query succesful. Returning`, JSON.parse(body));
            callback( JSON.parse(body) );
        });
    }
}