'use strict';

const request = require('request');

function send(messageData) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

    } else {
      console.error("Unable to send message.");
      // console.error(response);
      console.error(error);
    }
  });
}


module.exports.sendTextMessage = function (senderID, messageText) {
  send({
    recipient: {
      id: senderID
    },
    message: {
      text: messageText
    }
  });
}

/*
  message is the prompt
  quickReplies is an array of objects. Each object is like
  {
    text: "text_to_display",
    "payload": "payload_to_call"
  }
*/
module.exports.sendQuickReplies = function(senderID, message, quickReplies) {
  console.log("sending quick reply");
  var messageData = {
    "recipient" : {
      "id": senderID
    },
    "message": {
      "text": message,
      "quick_replies": []
    },
  };
  quickReplies.forEach(function(quickReply) {
    messageData.message.quick_replies.push({
      "content_type": "text",
      "title": quickReply.text,
      "payload": quickReply.payload
    });
  })
  console.log(messageData);
  send(messageData);
}

