'use strict';

module.exports = function(postbackEvent) {
    console.log("In function recieved postback with postbackEvent");
    console.log(JSON.stringify(postbackEvent));
    // do someting.
}