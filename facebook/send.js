'use strict';

const request = require('request');

function send(messageData) {
    console.log("In send with messageData==");
    console.log(JSON.stringify(messageData));
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log("Successfully sent message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            // console.error(response);
            console.error(error);
        }
    });
}


module.exports.sendTextMessage = function (senderID, messageText) {
    console.log("sending text message "+messageText);
    send({
        recipient: {
            id: senderID
        },
        message: {
            text: messageText
        }
    });
}

/**************************************
 * TESTING
 */
module.exports.sendGenericMessage = function(senderID) {
  var messageData = {
    recipient: {
      id: senderID
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  send(messageData);
}

/***************************************** */
